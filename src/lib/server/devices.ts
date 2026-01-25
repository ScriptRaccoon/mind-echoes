import type { RequestEvent } from '@sveltejs/kit'
import { query } from './db'
import crypto from 'crypto'
import { COOKIE_DEVICE_TOKEN, DEVICE_COOKIE_OPTIONS } from './config'

export function create_device_token(): string {
	return crypto.randomBytes(32).toString('hex')
}

export function save_device_cookie(event: RequestEvent, token: string): void {
	event.cookies.set(COOKIE_DEVICE_TOKEN, token, DEVICE_COOKIE_OPTIONS)
}

export async function is_known_device(event: RequestEvent): Promise<boolean> {
	const device_token = event.cookies.get(COOKIE_DEVICE_TOKEN)
	if (!device_token) return false

	const token_hash = hash_token(device_token)

	const user = event.locals.user
	if (!user) return false

	const { rows } = await query<{ token_hash: string }>(
		'SELECT token_hash FROM devices WHERE user_id = ?',
		[user.id],
	)

	if (!rows) return false

	return rows.some((row) => row.token_hash === token_hash)
}

export async function save_device_token_in_database(
	user_id: number,
	label: string,
	token: string,
) {
	const token_hash = hash_token(token)

	const { success } = await query(
		'INSERT INTO devices (user_id, label, token_hash) VALUES (?,?,?)',
		[user_id, label, token_hash],
	)

	return success
}

function hash_token(token: string): string {
	return crypto.createHash('sha256').update(token).digest('hex')
}
