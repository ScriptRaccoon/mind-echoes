import { fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'
import * as v from 'valibot'
import { email_schema, username_schema } from '$lib/server/schemas'
import { is_constraint_error, query } from '$lib/server/db'
import { generate_id } from '$lib/server/utils'
import {
	COOKIE_REGISTRATION,
	COOKIE_REGISTRATION_OPTIONS,
} from '$lib/server/registration'

export const actions: Actions = {
	default: async (event) => {
		const form = await event.request.formData()
		const username = form.get('username') as string
		const email = form.get('email') as string

		const username_parsed = v.safeParse(username_schema, username)

		if (!username_parsed.success) {
			return fail(400, { username, email, error: username_parsed.issues[0].message })
		}

		const email_parsed = v.safeParse(email_schema, email)

		if (!email_parsed.success) {
			return fail(400, { username, email, error: email_parsed.issues[0].message })
		}

		const sql_user = `SELECT id FROM users WHERE username = ? OR email = ?`

		const { rows: users, err: err_users } = await query(sql_user, [username, email])

		if (err_users) return fail(500, { username, email, error: 'Datebase error' })

		if (users.length) {
			return fail(409, { username, email, error: 'Username or email is already taken' })
		}

		const registration_id = generate_id()
		const expires_at = Date.now() + 1000 * 60 * 60 // after 1 hour

		const sql = `
			INSERT INTO registration_requests
				(id, username, email, expires_at)
			VALUES (?, ?, ?, ?)`

		const { err } = await query(sql, [registration_id, username, email, expires_at])

		if (err) {
			if (is_constraint_error(err)) {
				return fail(409, { username, email, error: 'Username or email is already taken' })
			}
			return fail(500, { username, email, error: 'Datebase error' })
		}

		event.cookies.set(COOKIE_REGISTRATION, registration_id, COOKIE_REGISTRATION_OPTIONS)

		redirect(303, '/register/step-2')
	},
}
