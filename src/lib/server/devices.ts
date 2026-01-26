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

function generate_token(): string {
	return crypto.randomBytes(32).toString('hex')
}

function hash_token(token: string): string {
	return crypto.createHash('sha256').update(token).digest('hex')
}

export function delete_device_cookie(event: RequestEvent): void {
	event.cookies.delete(COOKIE_DEVICE_TOKEN, { path: '/' })
}

const device_cache: Map<string, number> = new Map()

export function delete_device_from_cache(token_hash: string) {
	device_cache.delete(token_hash)
}

export async function check_device(event: RequestEvent): Promise<void> {
	const user = event.locals.user
	if (!user) return

	const device_token = event.cookies.get(COOKIE_DEVICE_TOKEN)
	if (!device_token) return

	const token_hash = hash_token(device_token)

	const cashed_device_id = device_cache.get(token_hash)

	if (cashed_device_id !== undefined) {
		event.locals.device_id = cashed_device_id
		return
	}

	const sql = `
		SELECT id
		FROM devices
		WHERE user_id = ? AND approved_at IS NOT NULL AND token_hash = ?`

	const { rows: devices } = await query<{ id: number }>(sql, [user.id, token_hash])

	if (!devices?.length) return

	event.locals.device_id = devices[0].id
}

export async function save_device(
	event: RequestEvent,
	label: string,
): Promise<{ success: boolean; approved: boolean }> {
	const user = event.locals.user
	if (!user) return { success: false, approved: false }

	const token = generate_token()

	const get_sql = 'SELECT id FROM devices WHERE user_id = ?'
	const { rows, err: err_devices } = await query<{ id: number }>(get_sql, [user.id])

	if (err_devices) return { success: false, approved: false }

	// approve when it's the first device
	const approved = rows.length === 0

	const token_hash = hash_token(token)

	const sql_approved = `
		INSERT INTO devices
			(user_id, label, token_hash, approved_at)
		VALUES (?,?,?, current_timestamp)`

	const sql_unapproved = `
		INSERT INTO devices
			(user_id, label, token_hash)
		VALUES (?,?,?)`

	const insert_sql = approved ? sql_approved : sql_unapproved

	const { err: err_insert } = await query(insert_sql, [user.id, label, token_hash])

	const success = !err_insert

	event.cookies.set(COOKIE_DEVICE_TOKEN, token, DEVICE_COOKIE_OPTIONS)

	return { success, approved }
}
