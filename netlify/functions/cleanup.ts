import { type Client, createClient } from '@libsql/client/web'
import type { Config } from '@netlify/functions'

export const config: Config = {
	schedule: '@weekly',
}

export default async () => {
	if (!process.env.DB_URL) {
		console.error('Missing DB_URL')
		return
	}

	if (!process.env.DB_AUTH_TOKEN) {
		console.error('Missing DB_AUTH_TOKEN')
		return
	}

	const db = createClient({
		authToken: process.env.DB_AUTH_TOKEN,
		url: process.env.DB_URL,
	})

	try {
		console.info('---\nStart cleanup function')

		await cleanup_users(db)
		await clean_registration_requests(db)
		await clean_device_verification_requests(db)
		await clean_email_change_requests(db)

		console.info('Finish cleanup function\n---')
	} catch (err) {
		console.error(err)
	}
}

async function cleanup_users(db: Client) {
	const sql = `
        DELETE FROM users
        WHERE email_verified_at IS NULL
        AND created_at < datetime('now', '-1 month')`

	const res = await db.execute(sql)
	console.info(`Deleted ${res.rowsAffected} unverified, inactive users`)
}

async function clean_registration_requests(db: Client) {
	const sql = `
        DELETE FROM registration_requests
        WHERE expires_at <= CURRENT_TIMESTAMP`

	const res = await db.execute(sql)
	console.info(`Deleted ${res.rowsAffected} expired registration requests`)
}

async function clean_device_verification_requests(db: Client) {
	const sql = `
        DELETE FROM device_verification_requests
        WHERE expires_at <= CURRENT_TIMESTAMP`

	const res = await db.execute(sql)
	console.info(`Deleted ${res.rowsAffected} expired device verification requests`)
}

async function clean_email_change_requests(db: Client) {
	const sql = `
        DELETE FROM email_change_requests
        WHERE expires_at <= CURRENT_TIMESTAMP`

	const res = await db.execute(sql)
	console.info(`Deleted ${res.rowsAffected} expired email change requests`)
}
