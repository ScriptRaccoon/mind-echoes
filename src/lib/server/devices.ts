import { query } from './db'
import crypto from 'crypto'

export async function is_valid_device(token: string): Promise<boolean> {
	const token_hash = crypto.createHash('sha256').update(token).digest('hex')

	const { rows } = await query<{ id: number }>(
		'SELECT id FROM devices WHERE token_hash = ? LIMIT 1',
		[token_hash],
	)

	return rows !== null && rows.length > 0
}
