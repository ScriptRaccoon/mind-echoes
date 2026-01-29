import { error, fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { REGISTER_COOKIE_NAME } from '$lib/server/registration-cache'
import { registration_cache } from '$lib/server/registration-cache'
import { query } from '$lib/server/db'
import { send_registration_email } from '$lib/server/email'

export const load: PageServerLoad = async (event) => {
	const register_id = event.cookies.get(REGISTER_COOKIE_NAME)
	if (!register_id) error(403, 'Forbidden')

	const progress = registration_cache.get(register_id)
	if (!progress || !progress.user_id) error(403, 'Forbidden')

	if (progress.expires_at <= Date.now()) {
		error(403, 'Session expired')
	}

	const { username, email, user_id } = progress

	const code = Math.floor(Math.random() * 10000)

	const sql = 'INSERT INTO registration_codes (code, user_id) VALUES (?,?)'

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
		const register_id = event.cookies.get(REGISTER_COOKIE_NAME)
		if (!register_id) error(403, 'Forbidden')

		const progress = registration_cache.get(register_id)
		if (!progress || !progress.user_id) error(403, 'Forbidden')

		if (progress.expires_at <= Date.now()) {
			error(403, 'Session expired')
		}

		const { user_id } = progress

		const form = await event.request.formData()

		const code = form.get('code') as string

		if (!code) return fail(400, { error: 'Code required' })

		const sql_code = `
			DELETE FROM registration_codes
			WHERE user_id = ? AND code = ? AND expires_at > CURRENT_TIMESTAMP
			RETURNING id`

		const { rows, err: err_code } = await query<{ id: number }>(sql_code, [user_id, code])

		if (err_code) return fail(500, { error: 'Database error' })

		if (!rows.length) return fail(401, { error: 'Invalid code' })

		const sql_verify = `
			UPDATE users
			SET email_verified_at = CURRENT_TIMESTAMP
			WHERE id = ?`

		const { err: err_verify } = await query(sql_verify, [user_id])

		if (err_verify) return fail(500, { error: 'Database error' })

		redirect(303, '/login?from=register')
	},
}
