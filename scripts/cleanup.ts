import { createClient } from '@libsql/client'
import dotenv from 'dotenv'
dotenv.config()

const DB_AUTH_TOKEN = process.env.DB_AUTH_TOKEN
const DB_URL = process.env.DB_URL

if (DB_AUTH_TOKEN === undefined) {
	console.error('Missing DB_AUTH_TOKEN')
	process.exit(1)
}

if (DB_URL === undefined) {
	console.error('Missing DB_URL')
	process.exit(1)
}

const db = createClient({ authToken: DB_AUTH_TOKEN, url: DB_URL })

async function cleanup() {
	console.info('---\nStart cleanup script')
	await cleanup_users()
	await clean_registration_requests()
	await clean_device_verification_requests()
	await clean_email_change_requests()
	console.info('Finish cleanup script\n---')
}

cleanup()

async function cleanup_users() {
	const sql = `
		DELETE FROM users
		WHERE email_verified_at IS NULL
		AND created_at < datetime('now', '-1 month')`

	try {
		const res = await db.execute(sql)
		console.info(`Deleted ${res.rowsAffected} unverified, inactive users`)
	} catch (err) {
		console.error(err)
	}
}

async function clean_registration_requests() {
	const sql = `
		DELETE FROM registration_requests
		WHERE expires_at <= CURRENT_TIMESTAMP`

	try {
		const res = await db.execute(sql)
		console.info(`Deleted ${res.rowsAffected} expired registration requests`)
	} catch (err) {
		console.error(err)
	}
}

async function clean_device_verification_requests() {
	const sql = `
		DELETE FROM device_verification_requests
		WHERE expires_at <= CURRENT_TIMESTAMP`

	try {
		const res = await db.execute(sql)
		console.info(`Deleted ${res.rowsAffected} expired device verification requests`)
	} catch (err) {
		console.error(err)
	}
}

async function clean_email_change_requests() {
	const sql = `
		DELETE FROM email_change_requests
		WHERE expires_at <= CURRENT_TIMESTAMP`

	try {
		const res = await db.execute(sql)
		console.info(`Deleted ${res.rowsAffected} expired email change requests`)
	} catch (err) {
		console.error(err)
	}
}
