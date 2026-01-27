import { createClient } from '@libsql/client'
import dotenv from 'dotenv'
dotenv.config()

const db = createClient({
	authToken: process.env.DB_AUTH_TOKEN ?? '',
	url: process.env.DB_URL ?? '',
})

async function cleanup() {
	console.info('---\nStart cleanup script')
	await clean_email_verification_tokens()
	await clean_device_verification_tokens()
	console.info('Finish cleanup script\n---')
}

cleanup()

async function clean_email_verification_tokens() {
	const sql =
		'DELETE FROM email_verification_tokens WHERE expires_at <= CURRENT_TIMESTAMP'
	try {
		const res = await db.execute(sql)
		console.info(`Deleted ${res.rowsAffected} email verification tokens`)
	} catch (err) {
		console.error(err)
	}
}

async function clean_device_verification_tokens() {
	const sql =
		'DELETE FROM device_verification_tokens WHERE expires_at <= CURRENT_TIMESTAMP'
	try {
		const res = await db.execute(sql)
		console.info(`Deleted ${res.rowsAffected} device verification tokens`)
	} catch (err) {
		console.error(err)
	}
}
