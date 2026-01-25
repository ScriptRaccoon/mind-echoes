import { query } from '$lib/server/db'
import jwt from 'jsonwebtoken'
import { fail, redirect, type Actions } from '@sveltejs/kit'
import bcrypt from 'bcrypt'
import type { PageServerLoad } from './$types'
import { JWT_SECRET } from '$env/static/private'
import { Rate_Limiter } from '$lib/server/ratelimit'
import { ts } from '$lib/translations/main'
import { COOKIE_JWT, COOKIE_OPTIONS, COOKIE_USERNAME } from '$lib/server/config'
import { get_language } from '$lib/translations/request'

export const load: PageServerLoad = (event) => {
	const lang = get_language(event.cookies)

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
		const lang = get_language(event.cookies)
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

		event.cookies.set(COOKIE_JWT, token, COOKIE_OPTIONS)
		event.cookies.set(COOKIE_USERNAME, username, COOKIE_OPTIONS)

		return redirect(303, '/dashboard')
	},
}
