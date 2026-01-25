import { query } from '$lib/server/db'
import { fail, redirect, type Actions } from '@sveltejs/kit'
import bcrypt from 'bcrypt'
import type { PageServerLoad } from './$types'
import { Rate_Limiter } from '$lib/server/ratelimit'
import { ts } from '$lib/translations/main'
import { get_language } from '$lib/translations/request'
import { set_auth_cookie } from '$lib/server/auth'

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
		const username = form.get('username') as string
		const password = form.get('password') as string

		const { rows, success } = await query<{
			id: number
			password_hash: string
		}>('SELECT id, password_hash FROM users WHERE username = ?', [username])

		if (!success) {
			return fail(500, { error: ts('error.database', lang) })
		}

		if (!rows.length) {
			return fail(401, { error: ts('error.password_username_incorrect', lang) })
		}

		const { id, password_hash } = rows[0]

		const is_correct = await bcrypt.compare(password, password_hash)
		if (!is_correct) return fail(401, { error: ts('error.password_incorrect', lang) })

		limiter.clear(ip)

		set_auth_cookie(event, { id, username })

		redirect(303, '/dashboard')
	},
}
