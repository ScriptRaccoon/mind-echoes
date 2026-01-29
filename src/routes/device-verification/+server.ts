import { error, redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { db } from '$lib/server/db'

const sql_tokens = `
	SELECT device_id
	FROM device_verification_requests
	WHERE id = ? AND expires_at > CURRENT_TIMESTAMP`

const sql_verify = `
	UPDATE devices
	SET verified_at = CURRENT_TIMESTAMP
	WHERE id = ?`

const sql_delete = 'DELETE FROM device_verification_requests WHERE id = ?'

class TokenError extends Error {}

export const GET: RequestHandler = async (event) => {
	const token_id = event.url.searchParams.get('token')
	if (!token_id) error(400, 'Token is missing')

	const tx = await db.transaction()

	try {
		const { rows: tokens } = await tx.execute({ sql: sql_tokens, args: [token_id] })

		if (!tokens.length) throw new TokenError('Invalid token')

		const { device_id } = tokens[0]

		await tx.execute({ sql: sql_verify, args: [device_id] })

		await tx.execute({ sql: sql_delete, args: [token_id] })

		await tx.commit()

		tx.close()
	} catch (err) {
		tx.close()
		if (err instanceof TokenError) {
			error(400, err.message)
		}
		console.error(err)
		error(500, 'Database error')
	}

	return redirect(303, '/login?from=device_verification')
}
