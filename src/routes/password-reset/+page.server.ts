import { error, fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import * as v from 'valibot'
import { password_schema } from '$lib/server/schemas'
import bcrypt from 'bcrypt'
import { batched_query, query } from '$lib/server/db'

export const load: PageServerLoad = async (event) => {
	const token = event.url.searchParams.get('token')
	if (!token) error(401, 'Token required')
}

const sql_request = `
        SELECT user_id FROM password_reset_requests
        WHERE token = ? AND expires_at > CURRENT_TIMESTAMP`

const sql_pw = `UPDATE users SET password_hash = ? WHERE id = ?`

const sql_clean = `DELETE FROM password_reset_requests WHERE token = ?`

export const actions: Actions = {
	default: async (event) => {
		const token = event.url.searchParams.get('token')
		if (!token) return fail(400, { error: 'Token required' })

		const { rows: requests, err: err_request } = await query<{ user_id: number }>(
			sql_request,
			[token],
		)

		if (err_request) return fail(500, { error: 'Database error' })

		if (!requests.length) return fail(400, { error: 'Invalid token' })

		const { user_id } = requests[0]

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

		const { err } = await batched_query(
			[
				{ sql: sql_pw, args: [password_hash, user_id] },
				{ sql: sql_clean, args: [token] },
			],
			'write',
		)

		if (err) return fail(500, { error: 'Database error' })

		redirect(303, '/login?from=password_reset')
	},
}
