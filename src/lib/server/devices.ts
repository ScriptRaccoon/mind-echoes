import { query } from './db'
import crypto from 'crypto'

let cached_token_hashes: Set<string> | null = null

function hash_token(token: string): string {
	return crypto.createHash('sha256').update(token).digest('hex')
}

async function load_devices() {
	const { rows } = await query<{ token_hash: string }>('SELECT token_hash FROM devices')
	cached_token_hashes = new Set((rows ?? []).map((r) => r.token_hash))
}

export async function is_valid_device(token: string): Promise<boolean> {
	if (!cached_token_hashes) await load_devices()
	return cached_token_hashes !== null && cached_token_hashes.has(hash_token(token))
}
