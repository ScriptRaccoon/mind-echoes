import { error, redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { db } from '$lib/server/db'

const sql_tokens = `
	SELECT device_id
	FROM device_verification_tokens
	WHERE id = ? AND expires_at > datetime('now')`

const sql_verify = `
	UPDATE devices
	SET verified_at = datetime('now')
	WHERE id = ?`

const sql_delete = 'DELETE FROM device_verification_tokens WHERE id = ?'

class TokenError extends Error {}

export const GET: RequestHandler = async (event) => {
	const tx = await db.transaction()

	const token_id = event.url.searchParams.get('token')
	if (!token_id) error(400, 'Token is missing')

	try {
		const { rows: tokens } = await tx.execute({ sql: sql_tokens, args: [token_id] })

		if (!tokens.length) {
			throw new TokenError('Invalid token')
		}

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
