import type { RequestEvent } from '@sveltejs/kit'
import { query } from './db'
import crypto from 'node:crypto'
import { generate_token } from './utils'

const COOKIE_DEVICE_TOKEN = 'device_token'

const DEVICE_COOKIE_OPTIONS = {
	httpOnly: true,
	path: '/',
	maxAge: 60 * 60 * 24 * 365, // 1 year
	sameSite: 'strict',
	secure: true,
} as const

function hash_token(token: string): string {
	return crypto.createHash('sha256').update(token).digest('hex')
}

export async function save_device(
	event: RequestEvent,
	user_id: number,
	label: string,
	options: { verify: boolean },
): Promise<{ device_id: number | null }> {
	const token = generate_token()

	const token_hash = hash_token(token)

	const sql_verified = `
		INSERT INTO devices
			(user_id, label, token_hash, verified_at)
		VALUES (?,?,?, CURRENT_TIMESTAMP)
		RETURNING id`

	const sql_unverified = `
		INSERT INTO devices
			(user_id, label, token_hash)
		VALUES (?,?,?)
		RETURNING id`

	const sql = options.verify ? sql_verified : sql_unverified

	const { rows, err } = await query<{ id: number }>(sql, [user_id, label, token_hash])

	if (err || !rows.length) return { device_id: null }

	event.cookies.set(COOKIE_DEVICE_TOKEN, token, DEVICE_COOKIE_OPTIONS)

	return { device_id: rows[0].id }
}

export function delete_device_cookie(event: RequestEvent): void {
	event.cookies.delete(COOKIE_DEVICE_TOKEN, { path: '/' })
}

const device_cache: Map<string, number> = new Map()

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
		WHERE user_id = ? AND verified_at IS NOT NULL AND token_hash = ?`

	const { rows: devices } = await query<{ id: number }>(sql, [user.id, token_hash])

	if (!devices?.length) return

	const device_id = devices[0].id

	event.locals.device_id = device_id
	device_cache.set(token_hash, device_id)
}

export function delete_device_from_cache(token_hash: string) {
	device_cache.delete(token_hash)
}

export async function create_device_verification_token(device_id: number) {
	const token_id = generate_token()

	const sql = `
		INSERT INTO device_verification_requests
			(id, device_id)
		VALUES (?,?)`

	const { err } = await query(sql, [token_id, device_id])

	if (err) return { token_id: null }

	return { token_id }
}

export async function save_login_date_for_device(event: RequestEvent) {
	const user = event.locals.user
	if (!user) return

	await check_device(event)

	const device_id = event.locals.device_id
	if (!device_id) return

	const sql = `
		UPDATE devices
		SET last_login_at = CURRENT_TIMESTAMP
		WHERE id = ? AND user_id = ?`

	await query(sql, [device_id, user.id])
}
