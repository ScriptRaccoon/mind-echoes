import { query } from '$lib/server/db'
import { type Entry_DB_Summary, type Entry_Summary } from '$lib/types'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { decrypt_entry_summary } from '$lib/server/encryption'

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user
	if (!user) error(401, 'Unauthorized')

	const sql = `
		SELECT id, date, title_enc
		FROM entries
		WHERE user_id = ?
		ORDER BY date DESC`

	const { rows: entries_enc, err } = await query<Entry_DB_Summary>(sql, [user.id])

	if (err) {
		error(500, 'Database error')
	}

	const entries: Entry_Summary[] = entries_enc.map(decrypt_entry_summary)

	return { entries }
}
