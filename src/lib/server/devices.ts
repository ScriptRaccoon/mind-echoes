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

export async function check_device(event: RequestEvent): Promise<void> {
	const device_token = event.cookies.get(COOKIE_DEVICE_TOKEN)
	if (!device_token) return

	const token_hash = hash_token(device_token)

	const user = event.locals.user
	if (!user) return

	const { rows } = await query<{ id: number; token_hash: string }>(
		'SELECT id, token_hash FROM devices WHERE user_id = ? AND approved_at IS NOT NULL',
		[user.id],
	)

	if (!rows) return

	for (const device of rows) {
		if (device.token_hash === token_hash) {
			event.locals.device_id = device.id
			return
		}
	}
}

export async function save_device_token_in_database(
	user_id: number,
	label: string,
	token: string,
): Promise<{ success: boolean; approved: boolean }> {
	const { rows, err: err_devices } = await query<{ id: number }>(
		'SELECT id FROM devices WHERE user_id = ?',
		[user_id],
	)

	if (err_devices) return { success: false, approved: false }

	const approved = rows.length === 0

	const token_hash = hash_token(token)

	const sql = approved
		? 'INSERT INTO devices (user_id, label, token_hash, approved_at) VALUES (?,?,?, current_timestamp)'
		: 'INSERT INTO devices (user_id, label, token_hash) VALUES (?,?,?)'

	const { err: err_insert } = await query(sql, [user_id, label, token_hash])

	const success = !err_insert
	return { success, approved }
}

function hash_token(token: string): string {
	return crypto.createHash('sha256').update(token).digest('hex')
}
