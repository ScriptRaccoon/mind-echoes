import { createClient } from '@libsql/client'
import dotenv from 'dotenv'
import entries from './mocks/entries.json'
import crypto from 'node:crypto'
dotenv.config()

const USER_ID = 1

const DB_AUTH_TOKEN = process.env.DB_AUTH_TOKEN
const DB_URL = process.env.DB_URL
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY

if (DB_AUTH_TOKEN === undefined) {
	console.error('Missing DB_AUTH_TOKEN')
	process.exit(1)
}

if (DB_URL === undefined) {
	console.error('Missing DB_URL')
	process.exit(1)
}

if (ENCRYPTION_KEY === undefined) {
	console.error('Missing ENCRYPTION_KEY')
	process.exit(1)
}

const db = createClient({ authToken: DB_AUTH_TOKEN, url: DB_URL })

console.info('---\nStart mock script')

const key = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest()

function encrypt(plain_text: string): string {
	const iv = crypto.randomBytes(12)
	const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)

	const encrypted = Buffer.concat([cipher.update(plain_text, 'utf8'), cipher.final()])

	const tag = cipher.getAuthTag()

	return Buffer.concat([iv, tag, encrypted]).toString('base64')
}

console.info(
	`Adding ${entries.length} mock entries to the database for user ${USER_ID} ...`,
)

for (const entry of entries) {
	const { date, title, content, thanks } = entry
	const title_enc = encrypt(title)
	const content_enc = encrypt(content)
	const thanks_enc = encrypt(thanks)

	const sql = `
        INSERT INTO entries
            (date, title_enc, content_enc, thanks_enc, user_id)
        VALUES (?,?,?,?,?)
        ON CONFLICT DO NOTHING`

	try {
		const res = await db.execute(sql, [date, title_enc, content_enc, thanks_enc, USER_ID])
		if (!res.rowsAffected) console.info(`Skip ${date}`)
	} catch (err) {
		console.error(err)
		process.exit(1)
	}
}

console.info('Finish mock script\n---')
