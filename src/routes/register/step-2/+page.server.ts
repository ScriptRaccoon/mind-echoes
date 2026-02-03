import { error, fail, redirect } from '@sveltejs/kit'
import bcrypt from 'bcrypt'
import type { Actions, PageServerLoad } from './$types'
import * as v from 'valibot'
import { password_schema } from '$lib/server/schemas'
import { query, is_constraint_error } from '$lib/server/db'
import { RateLimiter } from '$lib/server/ratelimit'
import { generate_code, get_device_label } from '$lib/server/utils'
import { save_device } from '$lib/server/devices'
import { COOKIE_REGISTRATION } from '$lib/server/registration'
import type { RegistrationRequest } from '$lib/shared/types'

export const load: PageServerLoad = async (event) => {
	const register_id = event.cookies.get(COOKIE_REGISTRATION)
	if (!register_id) error(403, 'Forbidden')
}

const limiter = new RateLimiter({ limit: 1, window_ms: 30_000 })

export const actions: Actions = {
	default: async (event) => {
		const ip = event.getClientAddress()

		if (!limiter.is_allowed(ip)) {
			return fail(429, { error: 'Too many registrations. Try again later.' })
		}

		const registration_id = event.cookies.get(COOKIE_REGISTRATION)
		if (!registration_id) return fail(403, { error: 'Forbidden' })

		const sql_request = `
			SELECT username, email FROM registration_requests
			WHERE id = ? AND expires_at < CURRENT_TIMESTAMP`

		const { rows: requests, err: err_requests } = await query<RegistrationRequest>(
			sql_request,
			[registration_id],
		)

		if (err_requests) return fail(500, { error: 'Database error' })

		if (!requests.length) return fail(403, { error: 'Forbidden' })

		const { username, email } = requests[0]

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

		const device_label = get_device_label(event.request.headers)

		const { device_id } = await save_device(event, user_id, device_label, {
			verify: true,
		})

		if (!device_id) {
			return fail(500, { error: 'Database error' })
		}

		const code = generate_code()

		const sql_update_request = `
			UPDATE registration_requests
			SET user_id = ?, device_id = ?, code = ?
			WHERE id = ?`

		const args = [user_id, device_id, code, registration_id]

		const { err: err_update } = await query(sql_update_request, args)

		if (err_update) return fail(500, { error: 'Database error' })

		limiter.record(ip)

		redirect(303, '/register/step-3')
	},
}
