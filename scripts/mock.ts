import { createClient } from '@libsql/client'
import dotenv from 'dotenv'
import entries from './mocks/entries.json'
import crypto from 'node:crypto'
dotenv.config()

console.info('---\nStart mock script')

const key = crypto
	.createHash('sha256')
	.update(process.env.ENCRYPTION_KEY ?? '')
	.digest()

function encrypt(plain_text: string): string {
	const iv = crypto.randomBytes(12)
	const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)

	const encrypted = Buffer.concat([cipher.update(plain_text, 'utf8'), cipher.final()])

	const tag = cipher.getAuthTag()

	return Buffer.concat([iv, tag, encrypted]).toString('base64')
}

const db = createClient({
	authToken: process.env.DB_AUTH_TOKEN ?? '',
	url: process.env.DB_URL ?? '',
})

const user_id = 1

console.info(`Adding ${entries.length} mock entries to the database ...`)

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
		db.execute(sql, [date, title_enc, content_enc, thanks_enc, user_id])
	} catch (err) {
		console.error(err)
		process.exit(1)
	}
}

console.info('Finish mock script\n---')
