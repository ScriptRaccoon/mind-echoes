import type { Actions } from './$types'
import { error, fail, redirect } from '@sveltejs/kit'
import { is_constraint_error, query } from '$lib/server/db'
import { set_auth_cookie } from '$lib/server/auth'
import { send_email_inform_changed_email } from '$lib/server/email'

export const actions: Actions = {
	default: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')

		const form = await event.request.formData()
		const code = form.get('code') as string

		if (!code) return fail(400, { error: 'Code required' })

		const sql_code = `
            DELETE FROM email_change_requests
            WHERE user_id = ? AND code = ? AND expires_at > CURRENT_TIMESTAMP
            RETURNING new_email`

		const { rows: rows_requests, err: err_requests } = await query<{ new_email: string }>(
			sql_code,
			[user.id, code],
		)

		if (err_requests) {
			return fail(500, { error: 'Database error' })
		}

		if (!rows_requests.length) {
			return fail(400, { error: 'Invalid code' })
		}

		const { new_email } = rows_requests[0]

		const sql_email = `UPDATE users SET email = ? WHERE id = ?`

		const { err } = await query(sql_email, [new_email, user.id])

		if (err) {
			if (is_constraint_error(err)) {
				return fail(409, { error: 'Email is already taken' })
			}
			return fail(500, { error: 'Database error' })
		}

		set_auth_cookie(event, { id: user.id, username: user.username, email: new_email })

		try {
			send_email_inform_changed_email(user.username, user.email, new_email)
		} catch (_) {}

		redirect(303, '/account?from=email_change')
	},
}
