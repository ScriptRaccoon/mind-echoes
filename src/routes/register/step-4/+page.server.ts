import { error, fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { REGISTER_COOKIE_NAME } from '$lib/server/registration-cache'
import { registration_cache } from '$lib/server/registration-cache'
import { batched_query, query } from '$lib/server/db'
import { send_registration_email } from '$lib/server/email'
import { generate_code } from '$lib/server/utils'
import { RateLimiter } from '$lib/server/ratelimit'

const limiter = new RateLimiter({ limit: 2, window_ms: 60_000 })

export const load: PageServerLoad = async (event) => {
	const register_id = event.cookies.get(REGISTER_COOKIE_NAME)
	if (!register_id) error(403, 'Forbidden')

	const progress = registration_cache.get(register_id)
	if (!progress || !progress.user_id || !progress.device_id) error(403, 'Forbidden')

	if (progress.expires_at <= Date.now()) {
		error(403, 'Session expired')
	}

	const { username, email, user_id } = progress

	const code = generate_code()

	const sql = 'INSERT INTO registration_requests (code, user_id) VALUES (?,?)'

	const { err } = await query(sql, [code, user_id])

	if (err) error(500, 'Database error')

	try {
		await send_registration_email(username, email, code)
	} catch (err) {
		console.error(err)
		error(500, 'Failed to send verification email')
	}
}

export const actions: Actions = {
	default: async (event) => {
		const ip = event.getClientAddress()

		if (!limiter.is_allowed(ip)) {
			return fail(429, {
				device_label: '',
				error: 'Too many registration attempts. Try again later.',
			})
		}

		const register_id = event.cookies.get(REGISTER_COOKIE_NAME)
		if (!register_id) error(403, 'Forbidden')

		const progress = registration_cache.get(register_id)
		if (!progress || !progress.user_id || !progress.device_id) error(403, 'Forbidden')

		if (progress.expires_at <= Date.now()) {
			error(403, 'Session expired')
		}

		const { user_id, username } = progress

		const form = await event.request.formData()

		const code = form.get('code') as string

		if (!code) return fail(400, { error: 'Code required' })

		const sql_request = `
			SELECT id FROM registration_requests
			WHERE user_id = ? AND code = ? AND expires_at > CURRENT_TIMESTAMP`

		const { rows: requests, err: err_request } = await query<{ id: number }>(
			sql_request,
			[user_id, code],
		)

		if (err_request) return fail(500, { error: 'Database error' })

		if (!requests.length) {
			limiter.record(ip)
			return fail(401, { error: 'Invalid code' })
		}

		const request_id = requests[0].id

		const sql_clean = `DELETE FROM registration_requests WHERE id = ?`

		const sql_verify = `
			UPDATE users
			SET email_verified_at = CURRENT_TIMESTAMP
			WHERE id = ?`

		const { err } = await batched_query(
			[
				{ sql: sql_verify, args: [user_id] },
				{ sql: sql_clean, args: [request_id] },
			],
			'write',
		)

		if (err) return fail(500, { error: 'Database error' })

		limiter.clear(ip)

		redirect(303, `/login?from=register&username=${username}`)
	},
}
