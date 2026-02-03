import { error, fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { batched_query, query } from '$lib/server/db'
import { send_registration_email } from '$lib/server/email'
import { RateLimiter } from '$lib/server/ratelimit'
import type { RegistrationRequest } from '$lib/shared/types'
import { COOKIE_REGISTRATION } from '$lib/server/registration'
import { set_auth_cookie } from '$lib/server/auth'

export const load: PageServerLoad = async (event) => {
	const registration_id = event.cookies.get(COOKIE_REGISTRATION)
	if (!registration_id) error(403, 'Forbidden')

	const sql_request = `
		SELECT username, email, code
		FROM registration_requests
		WHERE id = ? AND expires_at < CURRENT_TIMESTAMP
		AND user_id IS NOT NULL
		AND device_id IS NOT NULL
		AND code IS NOT NULL`

	const { rows, err } = await query<RegistrationRequest>(sql_request, [registration_id])

	if (err) error(500, 'Database error')

	if (!rows.length) error(403, 'Forbidden')

	const { username, email, code } = rows[0]

	try {
		await send_registration_email(username, email, code!)
	} catch (err) {
		console.error(err)
		error(500, 'Failed to send verification email')
	}
}

const limiter = new RateLimiter({ limit: 2, window_ms: 60_000 })

export const actions: Actions = {
	default: async (event) => {
		const ip = event.getClientAddress()

		if (!limiter.is_allowed(ip)) {
			return fail(429, { error: 'Too many invalid codes detected. Try again later.' })
		}

		const registration_id = event.cookies.get(COOKIE_REGISTRATION)
		if (!registration_id) error(403, 'Forbidden')

		const sql_request = `
			SELECT user_id, username, email, code, device_id
			FROM registration_requests
			WHERE id = ? AND expires_at < CURRENT_TIMESTAMP
			AND user_id IS NOT NULL
			AND device_id IS NOT NULL
			AND code IS NOT NULL`

		const { rows: requests, err: err_requests } = await query<RegistrationRequest>(
			sql_request,
			[registration_id],
		)

		if (err_requests) return fail(500, { error: 'Database error' })

		if (!requests.length) {
			limiter.record(ip)
			return fail(403, { error: 'Forbidden' })
		}

		const { user_id, username, email, code: actual_code, device_id } = requests[0]

		const form = await event.request.formData()

		const code = form.get('code') as string

		if (!code) return fail(400, { error: 'Code required' })

		if (parseInt(code) !== actual_code) {
			limiter.record(ip)
			return fail(401, { error: 'Invalid code' })
		}

		const sql_verify = `
			UPDATE users
			SET email_verified_at = CURRENT_TIMESTAMP
			WHERE id = ?`

		const sql_login_date = `
			UPDATE devices
			SET last_login_at = CURRENT_TIMESTAMP
			WHERE id = ?`

		const sql_clean = `DELETE FROM registration_requests WHERE id = ?`

		const { err } = await batched_query(
			[
				{ sql: sql_verify, args: [user_id] },
				{ sql: sql_login_date, args: [device_id] },
				{ sql: sql_clean, args: [registration_id] },
			],
			'write',
		)

		if (err) return fail(500, { error: 'Database error' })

		limiter.clear(ip)

		event.cookies.delete(COOKIE_REGISTRATION, { path: '/' })

		set_auth_cookie(event, { id: user_id!, email, username })

		redirect(303, `/dashboard`)
	},
}
