import crypto from 'node:crypto'
import parser from 'my-ua-parser'

export function generate_code(): number {
	return crypto.randomInt(100_000, 1_000_000)
}

export function generate_token(): string {
	return crypto.randomBytes(32).toString('hex')
}

export function generate_id(): string {
	return crypto.randomUUID()
}

export function hash_token(token: string): string {
	return crypto.createHash('sha256').update(token).digest('hex')
}

export function get_device_label(headers: Headers) {
	const ua = headers.get('user-agent') ?? ''
	const { browser, os } = parser(ua)
	return `${browser.name} on ${os.name}`
}

export function log_bold(text: string) {
	const bold = '\x1b[1m'
	const reset = '\x1b[0m'
	console.info(bold + text + reset)
}

export function combine_paragraphs(texts: string[]): string {
	return texts.join('\n\n')
}
