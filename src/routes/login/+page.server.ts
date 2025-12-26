import { query } from '$lib/server/db'
import jwt from 'jsonwebtoken'
import { fail, redirect, type Actions } from '@sveltejs/kit'
import bcrypt from 'bcrypt'
import type { PageServerLoad } from './$types'
import { JWT_SECRET } from '$env/static/private'
import { Rate_Limiter } from '$lib/server/ratelimit'
import { ts, type Lang } from '$lib/translations/main'

export const load: PageServerLoad = (event) => {
	const lang = event.cookies.get('lang') as Lang

	const LOGIN_MESSAGES: Record<string, undefined | string> = {
		logout: ts('login.from.logout', lang),
		register: ts('login.from.register', lang),
	}

	const from = event.url.searchParams.get('from') ?? ''
	return { message: LOGIN_MESSAGES[from] }
}

const limiter = new Rate_Limiter({ limit: 5, window_ms: 60_000 })

export const actions: Actions = {
	default: async (event) => {
		const lang = event.cookies.get('lang') as Lang
		const ip = event.getClientAddress()

		if (!limiter.is_allowed(ip)) {
			return fail(429, { error: ts('error.login_attempts', lang) })
		}

		const form = await event.request.formData()
		const password = form.get('password') as string

		const { rows, success } = await query<{ username: string; password_hash: string }>(
			'SELECT username, password_hash FROM users WHERE id = 1',
		)

		if (!success || !rows.length) {
			return fail(500, { error: ts('error.database', lang) })
		}

		const { username, password_hash } = rows[0]

		const is_correct = await bcrypt.compare(password, password_hash)
		if (!is_correct) return fail(401, { error: ts('error.password_incorrect', lang) })

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
