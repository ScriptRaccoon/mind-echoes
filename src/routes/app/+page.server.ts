import { query } from '$lib/server/db'
import { type Entry_DB_Summary, type Entry_Summary } from '$lib/types'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { ts, type Lang } from '$lib/translations/main'
import { decrypt_entry_summary } from '$lib/server/encryption'

export const load: PageServerLoad = async (event) => {
	const lang = event.cookies.get('lang') as Lang
	const username = event.cookies.get('username') ?? ''

	const { rows: entries_enc, success } = await query<Entry_DB_Summary>(
		'SELECT id, date, title_enc FROM entries ORDER BY date desc',
	)

	if (!success) {
		return error(500, ts('error.database', lang))
	}

	const entries: Entry_Summary[] = entries_enc.map(decrypt_entry_summary)

	return { username, entries }
}
