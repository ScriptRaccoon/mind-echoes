import crypto from 'node:crypto'

export function generate_code(): number {
	return crypto.randomInt(100_000, 1_000_000)
}

export function generate_token(): string {
	return crypto.randomBytes(32).toString('hex')
}

export function hash_token(token: string): string {
	return crypto.createHash('sha256').update(token).digest('hex')
}
