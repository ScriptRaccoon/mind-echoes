import type { RequestHandler } from './$types'
import { error, redirect } from '@sveltejs/kit'
import { batched_query, is_constraint_error, query } from '$lib/server/db'
import { set_auth_cookie } from '$lib/server/auth'
import { send_email_inform_changed_email } from '$lib/server/email'

const sql_request = `
	SELECT new_email FROM email_change_requests
	WHERE user_id = ? AND token = ? AND expires_at > CURRENT_TIMESTAMP`

const sql_email = `UPDATE users SET email = ? WHERE id = ?`
const sql_clean = `DELETE FROM email_change_requests WHERE token = ?`

export const GET: RequestHandler = async (event) => {
	const user = event.locals.user
	if (!user) error(401, 'Unauthorized')

	const token = event.url.searchParams.get('token')
	if (!token) error(400, 'Token required')

	const { rows: rows_requests, err: err_requests } = await query<{ new_email: string }>(
		sql_request,
		[user.id, token],
	)

	if (err_requests) {
		error(500, 'Database error')
	}

	if (!rows_requests.length) {
		error(400, 'Invalid token')
	}

	const { new_email } = rows_requests[0]

	const { err } = await batched_query(
		[
			{ sql: sql_email, args: [new_email, user.id] },
			{ sql: sql_clean, args: [token] },
		],
		'write',
	)

	if (err) {
		if (is_constraint_error(err)) {
			error(409, 'Email is already taken')
		}
		error(500, 'Database error')
	}

	set_auth_cookie(event, { id: user.id, username: user.username, email: new_email })

	try {
		send_email_inform_changed_email(user.username, user.email, new_email)
	} catch (_) {}

	redirect(303, '/account?from=email_change')
}
