import { error, fail, redirect } from '@sveltejs/kit'
import bcrypt from 'bcrypt'
import type { Actions, PageServerLoad } from './$types'
import * as v from 'valibot'
import { password_schema } from '$lib/server/schemas'
import { REGISTER_COOKIE_NAME, registration_cache } from '$lib/server/registration-cache'
import { query, is_constraint_error } from '$lib/server/db'
import { RateLimiter } from '$lib/server/ratelimit'

export const load: PageServerLoad = async (event) => {
	const register_id = event.cookies.get(REGISTER_COOKIE_NAME)
	if (!register_id) error(403, 'Forbidden')

	const progress = registration_cache.get(register_id)
	if (!progress) error(403, 'Forbidden')

	if (progress.expires_at <= Date.now()) {
		error(403, 'Session expired')
	}
}

const limiter = new RateLimiter({ limit: 1, window_ms: 30_000 })

export const actions: Actions = {
	default: async (event) => {
		const ip = event.getClientAddress()

		if (!limiter.is_allowed(ip)) {
			return fail(429, {
				device_label: '',
				error: 'Too many registrations. Try again later.',
			})
		}

		const register_id = event.cookies.get(REGISTER_COOKIE_NAME)
		if (!register_id) error(403, 'Forbidden')

		const progress = registration_cache.get(register_id)
		if (!progress) error(403, 'Forbidden')

		if (progress.expires_at <= Date.now()) {
			error(403, 'Session expired')
		}

		const { username, email } = progress

		const form = await event.request.formData()
		const password = form.get('password') as string
		const repeat_password = form.get('repeat_password') as string

		const password_parsed = v.safeParse(password_schema, password)

		if (!password_parsed.success) {
			return fail(400, { error: password_parsed.issues[0].message })
		}

		if (password !== repeat_password) {
			return fail(400, { error: 'Passwords do not match' })
		}

		const password_hash = await bcrypt.hash(password, 10)

		const sql = `
			INSERT INTO users
				(username, email, password_hash)
			VALUES (?,?,?)
			RETURNING id`

		const { rows: users, err } = await query<{ id: number }>(sql, [
			username,
			email,
			password_hash,
		])

		if (err) {
			if (is_constraint_error(err)) {
				return fail(409, {
					error: 'Username or email is already taken',
				})
			}
			return fail(500, { error: 'Database error' })
		}

		if (!users.length) {
			return fail(500, { error: 'Database error' })
		}

		const user_id = users[0].id

		registration_cache.set(register_id, { ...progress, user_id })

		limiter.record(ip)

		redirect(303, '/register/step-3')
	},
}
