import { error, redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { batched_query, query } from '$lib/server/db'

const sql_request = `
	SELECT device_id
	FROM device_verification_requests
	WHERE token = ? AND expires_at > CURRENT_TIMESTAMP`

const sql_verify = `
	UPDATE devices
	SET verified_at = CURRENT_TIMESTAMP
	WHERE id = ?`

const sql_clean = 'DELETE FROM device_verification_requests WHERE token = ?'

export const GET: RequestHandler = async (event) => {
	const token = event.url.searchParams.get('token')
	if (!token) error(400, 'Token is missing')

	const { rows: requests, err: err_request } = await query<{ device_id: number }>(
		sql_request,
		[token],
	)

	if (err_request) error(500, 'Database error')

	if (!requests.length) error(400, 'Invalid token')

	const { device_id } = requests[0]

	const { err } = await batched_query(
		[
			{ sql: sql_verify, args: [device_id] },
			{ sql: sql_clean, args: [token] },
		],
		'write',
	)

	if (err) error(500, 'Database error')

	redirect(303, '/login?from=device_verification')
}
