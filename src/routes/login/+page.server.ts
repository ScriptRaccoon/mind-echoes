import { query } from '$lib/server/db'
import { fail, redirect } from '@sveltejs/kit'
import bcrypt from 'bcrypt'
import type { Actions, PageServerLoad } from './$types'
import { RateLimiter } from '$lib/server/ratelimit'
import { set_auth_cookie } from '$lib/server/auth'
import { save_login_date_for_device } from '$lib/server/devices'

export const load: PageServerLoad = (event) => {
	const from = event.url.searchParams.get('from') ?? ''

	const LOGIN_MESSAGES: Record<string, undefined | string> = {
		logout: 'You have been logged out successfully',
		device_verification: 'Your device has been verified. You can now log in.',
		password_reset: 'Password has been reset. You can now log in with the new password.',
	}

	const username = event.url.searchParams.get('username') ?? ''

	return { message: LOGIN_MESSAGES[from], username }
}

const limiter = new RateLimiter({ limit: 5, window_ms: 60_000 })

export const actions: Actions = {
	default: async (event) => {
		const ip = event.getClientAddress()

		if (!limiter.is_allowed(ip)) {
			return fail(429, {
				username: '',
				error: 'Too many login attempts. Please try again later.',
			})
		}

		const form = await event.request.formData()
		const identifier = form.get('identifier') as string
		const password = form.get('password') as string

		if (!identifier || !password) {
			return fail(400, { identifier, error: 'Both fields are required' })
		}

		const identifier_name = identifier.includes('@') ? 'email' : 'username'

		const sql = `
			SELECT id, username, email, password_hash, email_verified_at
			FROM users
			WHERE ${identifier_name} = ?`

		const { rows, err } = await query<{
			id: number
			username: string
			email: string
			password_hash: string
			email_verified_at: string | null
		}>(sql, [identifier])

		if (err) {
			return fail(500, { identifier, error: 'Database error' })
		}

		if (!rows.length) {
			limiter.record(ip)
			return fail(401, { identifier, error: 'Invalid credentials' })
		}

		const { id, password_hash, username, email, email_verified_at } = rows[0]

		const is_correct = await bcrypt.compare(password, password_hash)
		if (!is_correct) {
			limiter.record(ip)
			return fail(401, { identifier, error: 'Invalid credentials' })
		}

		if (!email_verified_at) {
			return fail(403, { identifier, error: 'Email has not been verified yet' })
		}

		limiter.clear(ip)

		set_auth_cookie(event, { id, email, username })
		event.locals.user = { id, email, username }

		save_login_date_for_device(event)

		redirect(303, '/dashboard')
	},
}
