import { MINIMAL_PASSWORD_LENGTH } from '$lib/server/config'
import { query } from '$lib/server/db'
import { fail, redirect, type Actions } from '@sveltejs/kit'
import bcrypt from 'bcrypt'

export const actions: Actions = {
	default: async (event) => {
		const form = await event.request.formData()
		const username = form.get('username') as string
		const password = form.get('password') as string

		const { rows: users, success: user_success } = await query<{ id: number }>(
			'SELECT id FROM users',
		)

		if (!user_success) {
			return fail(500, {
				username,
				error: 'Cannot retrieve existing user.',
			})
		}

		if (users.length) {
			return fail(409, {
				username,
				error: 'A user has already been created before.',
			})
		}

		if (!username) {
			return fail(400, {
				username,
				error: 'Username cannot be empty.',
			})
		}

		if (password.length < MINIMAL_PASSWORD_LENGTH) {
			return fail(400, {
				username,
				error: 'Password must be at least 8 characters.',
			})
		}

		const password_hash = await bcrypt.hash(password, 10)

		const { success: registration_success } = await query(
			'INSERT INTO users (id, username, password_hash) VALUES (?,?,?)',
			[1, username, password_hash],
		)

		if (!registration_success) {
			return fail(500, { username, error: 'Registration failed.' })
		}

		return redirect(303, '/login?from=register')
	},
}
