import { error, fail, redirect, type Actions } from '@sveltejs/kit'
import bcrypt from 'bcrypt'
import { is_constraint_error, query } from '$lib/server/db'
import { delete_auth_cookie, set_auth_cookie } from '$lib/server/auth'
import type { PageServerLoad } from './$types'
import * as v from 'valibot'
import { username_schema, password_schema } from '$lib/server/schemas'

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user
	if (!user) error(401, 'Unauthorized')

	const { rows: devices, err } = await query<{ id: number; label: string }>(
		'SELECT id, label FROM devices WHERE user_id = ?',
		[user.id],
	)

	if (err) {
		error(500, 'Database error')
	}

	return { devices }
}

export const actions: Actions = {
	username: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')

		const form = await event.request.formData()
		const username = form.get('username') as string

		const username_parsed = v.safeParse(username_schema, username)

		if (!username_parsed.success) {
			return fail(400, {
				type: 'username',
				username,
				error: username_parsed.issues[0].message,
			})
		}

		const { err } = await query('UPDATE users SET username = ? WHERE id = ?', [
			username,
			user.id,
		])

		if (err) {
			if (is_constraint_error(err)) {
				return fail(409, {
					type: 'username',
					username,
					error: 'Username is already taken',
				})
			}
			return fail(500, { type: 'username', username, error: 'Database error' })
		}

		user.username = username

		set_auth_cookie(event, user)

		return {
			type: 'username',
			username,
			message: 'Username has been updated successfully',
		}
	},

	password: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')

		const form = await event.request.formData()
		const current_password = form.get('current_password') as string
		const new_password = form.get('new_password') as string

		const { rows, err } = await query<{ password_hash: string }>(
			'SELECT password_hash FROM users WHERE id = ?',
			[user.id],
		)

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
			return fail(400, {
				type: 'password',
				error: password_parsed.issues[0].message,
			})
		}

		const new_password_hash = await bcrypt.hash(new_password, 10)

		const { err: update_err } = await query(
			'UPDATE users SET password_hash = ? WHERE id = ?',
			[new_password_hash, user.id],
		)

		if (update_err) {
			return fail(500, { type: 'password', error: 'Database error' })
		}

		return { type: 'password', message: 'Password has been updated successfully' }
	},

	delete: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')

		const { err } = await query('DELETE FROM users WHERE id = ?', [user.id])

		if (err) {
			return fail(500, { type: 'delete', error: 'Database error' })
		}

		delete_auth_cookie(event)

		redirect(302, '/')
	},

	remove_device: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')

		const form = await event.request.formData()

		const device_id = form.get('device_id') as string

		if (!device_id) {
			return fail(400, { type: 'device', error: 'Device ID is required' })
		}

		const { err } = await query('DELETE FROM devices WHERE user_id = ? AND id = ?', [
			user.id,
			device_id,
		])

		if (err) {
			return fail(400, { type: 'device', error: 'Database error' })
		}

		return { type: 'device', message: 'Device has been removed' }
	},
}
