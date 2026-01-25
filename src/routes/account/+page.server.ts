import { error, fail, redirect, type Actions } from '@sveltejs/kit'
import bcrypt from 'bcrypt'
import { query } from '$lib/server/db'
import { MINIMAL_PASSWORD_LENGTH } from '$lib/server/config'
import { delete_auth_cookie, set_auth_cookie } from '$lib/server/auth'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user
	if (!user) error(401, 'Unauthorized')

	const { rows: devices, err } = await query<{ id: number; label: string }>(
		'SELECT id, label FROM devices WHERE user_id = ?',
		[user.id],
	)

	if (err) {
		error(500, 'Database error.')
	}

	return { devices }
}

export const actions: Actions = {
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
			return fail(500, {
				type: 'password',
				error: 'Database error.',
			})
		}

		const { password_hash } = rows[0]

		const current_is_correct = await bcrypt.compare(current_password, password_hash)
		if (!current_is_correct) {
			return fail(401, {
				type: 'password',
				error: 'Current password is incorrect.',
			})
		}

		if (new_password.length < MINIMAL_PASSWORD_LENGTH) {
			return fail(400, {
				type: 'password',
				error: 'Password must be at least 8 characters long.',
			})
		}

		const new_password_hash = await bcrypt.hash(new_password, 10)

		const { err: update_err } = await query(
			'UPDATE users SET password_hash = ? WHERE id = ?',
			[new_password_hash, user.id],
		)

		if (update_err) {
			return fail(500, {
				type: 'password',
				error: 'Database error.',
			})
		}

		return {
			type: 'password',
			message: 'Password has been updated successfully.',
		}
	},

	username: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')

		const form = await event.request.formData()
		const username = form.get('username') as string

		if (!username.length) {
			return fail(400, {
				type: 'username',
				error: 'Username cannot be empty.',
			})
		}

		const { err } = await query('UPDATE users SET username = ? WHERE id = ?', [
			username,
			user.id,
		])

		if (err) {
			return fail(500, {
				type: 'username',
				error: 'Database error.',
			})
		}

		user.username = username

		set_auth_cookie(event, user)

		return {
			type: 'username',
			message: 'Username has been updated successfully.',
		}
	},

	delete: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')

		const form = await event.request.formData()
		const user_yes = form.get('yes') as string
		const actual_yes = 'Yes'

		if (user_yes.toLowerCase() !== actual_yes.toLowerCase()) {
			return fail(400, {
				type: 'delete',
				error: 'Type "Yes" (3 letters) to confirm this action.',
			})
		}

		const { err } = await query('DELETE FROM users WHERE id = ?', [user.id])

		if (err) {
			return fail(500, {
				type: 'delete',
				error: 'Database error.',
			})
		}

		delete_auth_cookie(event)

		redirect(302, '/')
	},
}
