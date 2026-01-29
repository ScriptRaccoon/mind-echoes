import { fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'
import * as v from 'valibot'
import { email_schema, username_schema } from '$lib/server/schemas'
import crypto from 'node:crypto'
import { REGISTER_COOKIE_NAME, registration_cache } from '$lib/server/registration-cache'
import { query } from '$lib/server/db'

export const actions: Actions = {
	default: async (event) => {
		const form = await event.request.formData()
		const username = form.get('username') as string
		const email = form.get('email') as string

		const username_parsed = v.safeParse(username_schema, username)

		if (!username_parsed.success) {
			return fail(400, {
				username,
				email,
				error: username_parsed.issues[0].message,
			})
		}

		const email_parsed = v.safeParse(email_schema, email)

		if (!email_parsed.success) {
			return fail(400, {
				username,
				email,
				error: email_parsed.issues[0].message,
			})
		}

		const sql = `SELECT id FROM users WHERE username = ? OR email = ?`

		const { rows, err } = await query(sql, [username, email])

		if (err) {
			return fail(400, {
				username,
				email,
				error: 'Datebase error',
			})
		}

		if (rows.length) {
			return fail(409, {
				username,
				email,
				error: 'Username or email is already taken',
			})
		}

		const register_session_id = crypto.randomUUID()

		registration_cache.set(register_session_id, {
			expires_at: Date.now() + 1000 * 60 * 60, // after 1 hour
			username,
			email,
		})

		event.cookies.set(REGISTER_COOKIE_NAME, register_session_id, {
			path: '/',
			sameSite: 'strict',
			httpOnly: true,
			secure: true,
			maxAge: 60 * 60, // 1 hour
		})

		redirect(303, '/register/step-2')
	},
}
