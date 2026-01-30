import { error, fail, redirect, type Actions } from '@sveltejs/kit'
import bcrypt from 'bcrypt'
import { is_constraint_error, query } from '$lib/server/db'
import { delete_auth_cookie, set_auth_cookie } from '$lib/server/auth'
import type { PageServerLoad } from './$types'
import * as v from 'valibot'
import { username_schema, password_schema, email_schema } from '$lib/server/schemas'
import { delete_device_cookie, delete_device_from_cache } from '$lib/server/devices'
import type { Device } from '$lib/types'
import { send_email_change_email } from '$lib/server/email'
import { generate_token } from '$lib/server/utils'

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user
	if (!user) error(401, 'Unauthorized')

	const from = event.url.searchParams.get('from')
	const message =
		from === 'email_change' ? 'Your email has been updated successfully' : null

	const sql = `
		SELECT id, label, created_at, last_login_at
		FROM devices
		WHERE user_id = ? AND verified_at IS NOT NULL
		ORDER BY created_at`

	const { rows: devices, err } = await query<Device>(sql, [user.id])

	if (err) {
		error(500, 'Database error')
	}

	return { devices, current_device_id: event.locals.device_id, message }
}

export const actions: Actions = {
	username: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')

		const form = await event.request.formData()
		const username = form.get('username') as string

		const username_parsed = v.safeParse(username_schema, username)

		if (!username_parsed.success) {
			return fail(400, { type: 'username', error: username_parsed.issues[0].message })
		}

		const sql = 'UPDATE users SET username = ? WHERE id = ?'
		const { err } = await query(sql, [username, user.id])

		if (err) {
			if (is_constraint_error(err)) {
				return fail(409, { type: 'username', error: 'Username is already taken' })
			}
			return fail(500, { type: 'username', error: 'Database error' })
		}

		set_auth_cookie(event, { id: user.id, email: user.email, username })

		return { type: 'username', message: 'Username has been updated successfully' }
	},

	email: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')

		const form = await event.request.formData()
		const email = form.get('email') as string

		const email_parsed = v.safeParse(email_schema, email)

		if (!email_parsed.success) {
			return fail(400, { type: 'email', error: email_parsed.issues[0].message })
		}

		const sql_duplicate = `SELECT id FROM users WHERE email = ?`
		const { rows, err: err_dupl } = await query(sql_duplicate, [email])

		if (err_dupl) return fail(500, { type: 'email', error: 'Database error' })

		if (rows.length) return fail(409, { type: 'email', error: 'Email is already taken' })

		const token = generate_token()

		const sql = `
			INSERT INTO email_change_requests
				(token, user_id, new_email)
			VALUES (?,?,?)`

		const { err } = await query(sql, [token, user.id, email])

		if (err) {
			return fail(500, { type: 'email', error: 'Database error' })
		}

		const link = `${event.url.origin}/email-verification?token=${token}`

		try {
			await send_email_change_email(user.username, email, link)
		} catch (err) {
			console.error(err)
			return fail(500, { type: 'email', error: 'Failed to send verification email' })
		}

		return {
			type: 'email',
			message: 'We have sent a verification link to the new email address.',
		}
	},

	password: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')

		const form = await event.request.formData()
		const current_password = form.get('current_password') as string
		const new_password = form.get('new_password') as string

		const sql_check = 'SELECT password_hash FROM users WHERE id = ?'
		const { rows, err } = await query<{ password_hash: string }>(sql_check, [user.id])

		if (err || !rows.length) {
			return fail(500, { type: 'password', error: 'Database error' })
		}

		const { password_hash } = rows[0]

		const current_is_correct = await bcrypt.compare(current_password, password_hash)
		if (!current_is_correct) {
			return fail(401, { type: 'password', error: 'Current password is incorrect' })
		}

		const password_parsed = v.safeParse(password_schema, new_password)

		if (!password_parsed.success) {
			return fail(400, { type: 'password', error: password_parsed.issues[0].message })
		}

		const new_password_hash = await bcrypt.hash(new_password, 10)

		const sql = 'UPDATE users SET password_hash = ? WHERE id = ?'
		const { err: update_err } = await query(sql, [new_password_hash, user.id])

		if (update_err) {
			return fail(500, { type: 'password', error: 'Database error' })
		}

		return { type: 'password', message: 'Password has been updated successfully' }
	},

	delete_account: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')

		const sql = 'DELETE FROM users WHERE id = ?'
		const { err } = await query(sql, [user.id])

		if (err) {
			return fail(500, { type: 'delete_account', error: 'Database error' })
		}

		delete_auth_cookie(event)
		delete_device_cookie(event)

		redirect(302, '/')
	},

	remove_device: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')

		const form = await event.request.formData()

		const device_id = parseInt(form.get('id') as string)

		if (!device_id) {
			return fail(400, { type: 'device', error: 'Device ID is required' })
		}

		if (device_id === event.locals.device_id) {
			return fail(403, { type: 'device', error: 'You cannot remove the current device' })
		}

		const sql = `
			DELETE FROM devices
			WHERE user_id = ? AND id = ?
			RETURNING token_hash`

		const { rows, err } = await query<{ token_hash: string }>(sql, [user.id, device_id])

		if (err || !rows.length) {
			return fail(400, { type: 'device', error: 'Database error' })
		}

		const { token_hash } = rows[0]

		delete_device_from_cache(token_hash)

		return { type: 'device', message: 'Device has been removed' }
	},
}
