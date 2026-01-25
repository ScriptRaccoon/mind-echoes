import { MINIMAL_PASSWORD_LENGTH } from '$lib/server/config'
import { query } from '$lib/server/db'
import { fail, redirect } from '@sveltejs/kit'
import bcrypt from 'bcrypt'
import type { Actions } from './$types'
import { set_auth_cookie } from '$lib/server/auth'

export const actions: Actions = {
	default: async (event) => {
		const form = await event.request.formData()
		const username = form.get('username') as string
		const password = form.get('password') as string

		if (!username) {
			return fail(400, {
				username,
				error: 'Username cannot be empty.',
			})
		}

		if (password.length < MINIMAL_PASSWORD_LENGTH) {
			return fail(400, {
				username,
				error: 'Password must be at least 8 characters long.',
			})
		}

		const password_hash = await bcrypt.hash(password, 10)

		const { rows, err } = await query<{ id: number }>(
			'INSERT INTO users (username, password_hash) VALUES (?,?) RETURNING id',
			[username, password_hash],
		)

		if (err || !rows.length) {
			return fail(500, {
				username,
				error: 'Database error.',
			})
		}

		const { id } = rows[0]

		set_auth_cookie(event, { id, username })

		redirect(303, '/device-registration')
	},
}
