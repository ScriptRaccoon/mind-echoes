import { MINIMAL_PASSWORD_LENGTH } from '$lib/server/config'
import { query } from '$lib/server/db'
import { ts } from '$lib/translations/main'
import { get_language } from '$lib/translations/request'
import { fail, redirect, type Actions } from '@sveltejs/kit'
import bcrypt from 'bcrypt'

export const actions: Actions = {
	default: async (event) => {
		const lang = get_language(event.cookies)

		const form = await event.request.formData()
		const username = form.get('username') as string
		const password = form.get('password') as string

		const { rows: users, success: user_success } = await query<{ id: number }>(
			'SELECT id FROM users',
		)

		if (!user_success) {
			return fail(500, {
				username,
				error: ts('error.database', lang),
			})
		}

		if (users.length) {
			return fail(409, {
				username,
				error: ts('error.user_created', lang),
			})
		}

		if (!username) {
			return fail(400, {
				username,
				error: ts('error.username_empty', lang),
			})
		}

		if (password.length < MINIMAL_PASSWORD_LENGTH) {
			return fail(400, {
				username,
				error: ts('error.password_min', lang),
			})
		}

		const password_hash = await bcrypt.hash(password, 10)

		const { success: registration_success } = await query(
			'INSERT INTO users (id, username, password_hash) VALUES (?,?,?)',
			[1, username, password_hash],
		)

		if (!registration_success) {
			return fail(500, { username, error: ts('error.database', lang) })
		}

		return redirect(303, '/login?from=register')
	},
}
