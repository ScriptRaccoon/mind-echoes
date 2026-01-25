import { query } from '$lib/server/db'
import { fail, redirect, type Actions } from '@sveltejs/kit'
import bcrypt from 'bcrypt'
import type { PageServerLoad } from './$types'
import { Rate_Limiter } from '$lib/server/ratelimit'
import { set_auth_cookie } from '$lib/server/auth'

export const load: PageServerLoad = (event) => {
	const LOGIN_MESSAGES: Record<string, undefined | string> = {
		logout: 'You have been logged out successfully.',
	}

	const from = event.url.searchParams.get('from') ?? ''
	return { message: LOGIN_MESSAGES[from] }
}

const limiter = new Rate_Limiter({ limit: 5, window_ms: 60_000 })

export const actions: Actions = {
	default: async (event) => {
		const ip = event.getClientAddress()

		if (!limiter.is_allowed(ip)) {
			return fail(429, { error: 'Too many login attempts. Please try again later.' })
		}

		const form = await event.request.formData()
		const username = form.get('username') as string
		const password = form.get('password') as string

		const { rows, success } = await query<{
			id: number
			password_hash: string
		}>('SELECT id, password_hash FROM users WHERE username = ?', [username])

		if (!success) {
			return fail(500, { error: 'Database error.' })
		}

		if (!rows.length) {
			return fail(401, { error: 'Username or password are incorrect.' })
		}

		const { id, password_hash } = rows[0]

		const is_correct = await bcrypt.compare(password, password_hash)
		if (!is_correct) return fail(401, { error: 'Incorrect password.' })

		limiter.clear(ip)

		set_auth_cookie(event, { id, username })

		redirect(303, '/dashboard')
	},
}
