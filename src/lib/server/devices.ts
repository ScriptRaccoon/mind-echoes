import type { RequestEvent } from '@sveltejs/kit'
import { query } from './db'
import crypto from 'crypto'

const COOKIE_DEVICE_TOKEN = 'device_token'

const DEVICE_COOKIE_OPTIONS = {
	httpOnly: true,
	path: '/',
	maxAge: 60 * 60 * 24 * 365, // 1 year
	sameSite: 'strict',
	secure: true,
} as const

export function create_device_token(): string {
	return crypto.randomBytes(32).toString('hex')
}

export function save_device_cookie(event: RequestEvent, token: string): void {
	event.cookies.set(COOKIE_DEVICE_TOKEN, token, DEVICE_COOKIE_OPTIONS)
}

export function delete_device_cookie(event: RequestEvent): void {
	event.cookies.delete(COOKIE_DEVICE_TOKEN, { path: '/' })
}

const device_cache: Map<string, number> = new Map()

export function delete_device_token_hash_from_cache(token_hash: string) {
	device_cache.delete(token_hash)
}

export async function check_device(event: RequestEvent): Promise<void> {
	const user = event.locals.user
	if (!user) return

	const device_token = event.cookies.get(COOKIE_DEVICE_TOKEN)
	if (!device_token) return

	const token_hash = hash_token(device_token)

	const hashed_device_id = device_cache.get(token_hash)
	if (hashed_device_id !== undefined) {
		event.locals.device_id = hashed_device_id
		return
	}

	const sql = `
		SELECT id, token_hash
		FROM devices
		WHERE user_id = ? AND approved_at IS NOT NULL`

	const { rows: devices } = await query<{ id: number; token_hash: string }>(sql, [
		user.id,
	])

	if (!devices) return

	for (const device of devices) {
		if (device.token_hash === token_hash) {
			event.locals.device_id = device.id
			device_cache.set(token_hash, device.id)
			return
		}
	}
}

export async function save_device_token_in_database(
	user_id: number,
	label: string,
	token: string,
): Promise<{ success: boolean; approved: boolean }> {
	const get_sql = 'SELECT id FROM devices WHERE user_id = ?'
	const { rows, err: err_devices } = await query<{ id: number }>(get_sql, [user_id])

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
