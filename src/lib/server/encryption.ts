import crypto from 'node:crypto'
import { ENCRYPTION_KEY } from '$env/static/private'

import type { Entry, Entry_DB, Entry_DB_Summary, Entry_Summary } from '$lib/client/types'

if (!ENCRYPTION_KEY) throw new Error('ENCRYPTION_KEY not set')

const key = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest()

export function encrypt(plain_text: string): string {
	const iv = crypto.randomBytes(12)
	const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)

	const encrypted = Buffer.concat([cipher.update(plain_text, 'utf8'), cipher.final()])

	const tag = cipher.getAuthTag()

	return Buffer.concat([iv, tag, encrypted]).toString('base64')
}

export function decrypt(cipher_text: string): string {
	const data = Buffer.from(cipher_text, 'base64')

	const iv = data.subarray(0, 12)
	const tag = data.subarray(12, 28)
	const encrypted = data.subarray(28)

	const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
	decipher.setAuthTag(tag)

	const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])

	return decrypted.toString('utf8')
}

export function decrypt_entry(e: Entry_DB): Entry {
	return {
		id: e.id,
		date: e.date,
		title: decrypt(e.title_enc),
		content: decrypt(e.content_enc),
		thanks: decrypt(e.thanks_enc),
	}
}

export function decrypt_entry_summary(e: Entry_DB_Summary): Entry_Summary {
	return {
		id: e.id,
		date: e.date,
		title: decrypt(e.title_enc),
	}
}
