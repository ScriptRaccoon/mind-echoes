import { is_constraint_error, query } from '$lib/server/db'
import { fail } from '@sveltejs/kit'
import bcrypt from 'bcrypt'
import type { Actions } from './$types'
import * as v from 'valibot'
import { email_schema, password_schema, username_schema } from '$lib/server/schemas'
import { PURPOSES } from '$lib/server/config'
import { send_verification_email } from '$lib/server/email'

export const actions: Actions = {
	default: async (event) => {
		const form = await event.request.formData()
		const username = form.get('username') as string
		const email = form.get('email') as string
		const password = form.get('password') as string

		// --- Validation ---

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

		const password_parsed = v.safeParse(password_schema, password)

		if (!password_parsed.success) {
			return fail(400, {
				username,
				email,
				error: password_parsed.issues[0].message,
			})
		}

		// --- User creation ---

		const password_hash = await bcrypt.hash(password, 10)

		const { rows: users, err } = await query<{ id: number }>(
			'INSERT INTO users (username, email, password_hash) VALUES (?,?,?) RETURNING id',
			[username, email, password_hash],
		)

		if (err) {
			if (is_constraint_error(err)) {
				return fail(409, { username, email, error: 'Username or email is already taken' })
			}
			return fail(500, { username, email, error: 'Database error' })
		}

		if (!users.length) {
			return fail(500, { username, email, error: 'Database error' })
		}

		// --- Email verification ---

		const user_id = users[0].id

		const token_id = crypto.randomUUID()

		const sql_token = 'INSERT INTO tokens (id, purpose, user_id) VALUES (?,?,?)'

		const { err: err_token } = await query(sql_token, [
			token_id,
			PURPOSES.EMAIL_VERIFICATION,
			user_id,
		])

		if (err_token) {
			return fail(500, { username, email, error: 'Database error' })
		}

		const link = `${event.url.origin}/email-verification?token=${token_id}`

		try {
			await send_verification_email(username, email, link)
		} catch (err) {
			console.error(err)
			return fail(500, { username, email, error: 'Failed to send verification email' })
		}

		const message =
			`Your account has been created. ` +
			`Check your email inbox to complete the registration.`

		return { username, email, message }
	},
}
