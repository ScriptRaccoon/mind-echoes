import { query } from '$lib/server/db'
import jwt from 'jsonwebtoken'
import { fail, redirect, type Actions } from '@sveltejs/kit'
import bcrypt from 'bcrypt'
import type { PageServerLoad } from './$types'
import { JWT_SECRET } from '$env/static/private'
import { Rate_Limiter } from '$lib/server/ratelimit'

const LOGIN_MESSAGES: Record<string, undefined | string> = {
	logout: 'You have been logged out successfully.',
	register: 'Registration successful. You can now log in.',
}

export const load: PageServerLoad = (event) => {
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
		const password = form.get('password') as string

		const { rows, success } = await query<{ username: string; password_hash: string }>(
			'SELECT username, password_hash FROM users WHERE id = 1',
		)

		if (!success || !rows.length) {
			return fail(500, { error: 'Could not retrieve user.' })
		}

		const { username, password_hash } = rows[0]

		const is_correct = await bcrypt.compare(password, password_hash)
		if (!is_correct) return fail(401, { error: 'Password is incorrect.' })

		limiter.clear(ip)

		const token = jwt.sign({ sub: 'user' }, JWT_SECRET, { expiresIn: '1w' })

		event.cookies.set('jwt', token, {
			httpOnly: true,
			path: '/',
			maxAge: 60 * 60 * 24 * 7,
			sameSite: 'strict',
			secure: true,
		})

		event.cookies.set('username', username, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: true,
		})

		return redirect(303, '/app')
	},
}
