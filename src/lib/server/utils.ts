import crypto from 'node:crypto'
import parser from 'my-ua-parser'

export function generate_code(): number {
	return crypto.randomInt(100_000, 1_000_000)
}

export function generate_token(): string {
	return crypto.randomBytes(32).toString('hex')
}

export function hash_token(token: string): string {
	return crypto.createHash('sha256').update(token).digest('hex')
}

export function get_device_label(headers: Headers) {
	const ua = headers.get('user-agent') ?? ''
	const { browser, os, device } = parser(ua)
	return `${browser.name} on ${os.name} (${device.vendor})`
}
