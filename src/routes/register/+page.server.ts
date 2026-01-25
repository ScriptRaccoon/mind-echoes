import { MINIMAL_PASSWORD_LENGTH } from '$lib/server/config'
import { query } from '$lib/server/db'
import { ts } from '$lib/translations/main'
import { get_language } from '$lib/translations/request'
import { fail, redirect } from '@sveltejs/kit'
import bcrypt from 'bcrypt'
import type { Actions } from './$types'

export const actions: Actions = {
	default: async (event) => {
		const lang = get_language(event.cookies)

		const form = await event.request.formData()
		const username = form.get('username') as string
		const password = form.get('password') as string

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

		const { success } = await query(
			'INSERT INTO users (username, password_hash) VALUES (?,?)',
			[username, password_hash],
		)

		if (!success) {
			return fail(500, {
				username,
				error: ts('error.database', lang),
			})
		}

		return redirect(303, '/login?from=register')
	},
}
