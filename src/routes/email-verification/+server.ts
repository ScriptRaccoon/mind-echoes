import { error, redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { db } from '$lib/server/db'
import { PURPOSES } from '$lib/server/config'

const sql_tokens = `
        SELECT user_id
        FROM tokens
        WHERE id = ? AND expires_at > datetime('now') AND purpose = ?`

const sql_verify = `
		UPDATE users
		SET email_verified_at = datetime('now')
		WHERE id = ?`

const sql_delete = 'DELETE FROM tokens WHERE id = ?'

class TokenError extends Error {}

export const GET: RequestHandler = async (event) => {
	const tx = await db.transaction()

	const token_id = event.url.searchParams.get('token')
	if (!token_id) error(400, 'Token is missing')

	try {
		const { rows: tokens } = await tx.execute({
			sql: sql_tokens,
			args: [token_id, PURPOSES.EMAIL_VERIFICATION],
		})

		if (!tokens.length) {
			throw new TokenError('Invalid token')
		}

		const { user_id } = tokens[0]

		await tx.execute({ sql: sql_verify, args: [user_id] })

		await tx.execute({ sql: sql_delete, args: [token_id] })

		await tx.commit()

		tx.close()
	} catch (err) {
		tx.close()
		if (err instanceof TokenError) {
			error(400, err.message)
		}
		error(500, 'Database error')
	}

	return redirect(303, '/login?from=email_verification')
}
