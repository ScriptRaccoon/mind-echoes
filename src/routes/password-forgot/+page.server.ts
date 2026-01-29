import { email_schema } from '$lib/server/schemas'
import { fail } from '@sveltejs/kit'
import type { Actions } from './$types'
import * as v from 'valibot'
import crypto from 'node:crypto'
import { query } from '$lib/server/db'
import { send_password_reset_email } from '$lib/server/email'
import { RateLimiter } from '$lib/server/ratelimit'

const msg =
	'If you have an account with that email address, ' +
	'we have sent you an email with a reset link.'

const limiter = new RateLimiter({ limit: 2, window_ms: 60_000 })

export const actions: Actions = {
	default: async (event) => {
		const ip = event.getClientAddress()

		if (!limiter.is_allowed(ip)) {
			return fail(429, {
				username: '',
				error: 'Too many reset attempts. Please try again later.',
			})
		}

		const form = await event.request.formData()
		const email = form.get('email') as string

		const email_parsed = v.safeParse(email_schema, email)

		if (!email_parsed.success) {
			return fail(400, {
				email,
				error: email_parsed.issues[0].message,
			})
		}

		const sql_user = `SELECT id, username FROM users WHERE email = ?`
		const { rows: users, err: err_user } = await query<{ id: number; username: string }>(
			sql_user,
			[email],
		)

		if (err_user) return fail(500, { email, error: 'Database error' })

		if (!users.length) {
			limiter.record(ip)
			return { email, message: msg }
		}

		const user = users[0]

		const token = crypto.randomBytes(32).toString('hex')

		const sql = `INSERT INTO password_reset_requests (token, user_id) VALUES (?,?)`

		const { err } = await query(sql, [token, user.id])

		const link = `${event.url.origin}/password-reset?token=${token}`

		try {
			await send_password_reset_email(user.username, email, link)
		} catch (err) {
			console.error(err)

			return fail(500, { email, error: 'Failed to send email' })
		}

		if (err) return fail(500, { email, error: 'Database error' })

		limiter.record(ip)

		return { email, message: msg }
	},
}
