import { is_constraint_error, query } from '$lib/server/db'
import { fail, redirect } from '@sveltejs/kit'
import bcrypt from 'bcrypt'
import type { Actions } from './$types'
import { set_auth_cookie } from '$lib/server/auth'
import * as v from 'valibot'
import { password_schema, username_schema } from '$lib/server/schemas'

export const actions: Actions = {
	default: async (event) => {
		const form = await event.request.formData()
		const username = form.get('username') as string
		const password = form.get('password') as string

		const username_parsed = v.safeParse(username_schema, username)

		if (!username_parsed.success) {
			return fail(400, {
				username,
				error: username_parsed.issues[0].message,
			})
		}

		const password_parsed = v.safeParse(password_schema, password)

		if (!password_parsed.success) {
			return fail(400, {
				password,
				error: password_parsed.issues[0].message,
			})
		}

		const password_hash = await bcrypt.hash(password, 10)

		const { rows, err } = await query<{ id: number }>(
			'INSERT INTO users (username, password_hash) VALUES (?,?) RETURNING id',
			[username, password_hash],
		)

		if (err) {
			if (is_constraint_error(err)) {
				return fail(409, { username, error: 'Username is already taken' })
			}
			return fail(500, { username, error: 'Database error' })
		}

		if (!rows.length) {
			return fail(500, { username, error: 'Database error' })
		}

		const { id } = rows[0]

		set_auth_cookie(event, { id, username })

		redirect(303, '/device-registration')
	},
}
