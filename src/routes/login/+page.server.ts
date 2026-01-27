import { query } from '$lib/server/db'
import { fail, redirect, type Actions } from '@sveltejs/kit'
import bcrypt from 'bcrypt'
import type { PageServerLoad } from './$types'
import { RateLimiter } from '$lib/server/ratelimit'
import { set_auth_cookie } from '$lib/server/auth'

export const load: PageServerLoad = (event) => {
	const LOGIN_MESSAGES: Record<string, undefined | string> = {
		logout: 'You have been logged out successfully',
		email_verification: 'Your email address has been verified. You can now log in.',
		device_verification: 'Your device has been verified. You can now log in.',
	}

	const from = event.url.searchParams.get('from') ?? ''
	return { message: LOGIN_MESSAGES[from] }
}

const limiter = new RateLimiter({ limit: 5, window_ms: 60_000 })

export const actions: Actions = {
	default: async (event) => {
		const ip = event.getClientAddress()

		if (!limiter.is_allowed(ip)) {
			return fail(429, { error: 'Too many login attempts. Please try again later.' })
		}

		const form = await event.request.formData()
		const username = form.get('username') as string
		const password = form.get('password') as string

		if (!username || !password) {
			return fail(400, { error: 'Username and password required' })
		}

		const sql = `
			SELECT id, password_hash, email, email_verified_at
			FROM users
			WHERE username = ?`

		const { rows, err } = await query<{
			id: number
			email: string
			password_hash: string
			email_verified_at: string | null
		}>(sql, [username])

		if (err) {
			return fail(500, { error: 'Database error' })
		}

		if (!rows.length) {
			limiter.record(ip)
			return fail(401, { error: 'Invalid credentials' })
		}

		const { id, password_hash, email, email_verified_at } = rows[0]

		const is_correct = await bcrypt.compare(password, password_hash)
		if (!is_correct) {
			limiter.record(ip)
			return fail(401, { error: 'Invalid credentials' })
		}

		if (!email_verified_at) {
			return fail(403, { error: 'Email has not been verified yet' })
		}

		limiter.clear(ip)

		set_auth_cookie(event, { id, email, username })

		redirect(303, '/dashboard')
	},
}
