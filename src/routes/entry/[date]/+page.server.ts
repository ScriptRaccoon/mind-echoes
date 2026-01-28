import { query } from '$lib/server/db'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import type { Entry, Entry_DB } from '$lib/types'
import { decrypt_entry } from '$lib/server/encryption'
import { is_valid_date } from '$lib/server/schemas'

export const load: PageServerLoad = async (event) => {
	if (!is_valid_date(event.params.date)) error(404, 'Not Found')

	const user = event.locals.user
	if (!user) error(401, 'Unauthorized')

	const date = event.params.date

	const sql = `
		SELECT id, date, title_enc, content_enc, thanks_enc
		FROM entries
		WHERE date = ? AND user_id = ?`

	const { rows: entries, err } = await query<Entry_DB>(sql, [date, user.id])

	if (err) {
		error(500, 'Database error')
	}

	const entry_enc = entries[0]

	if (!entry_enc) {
		error(404, 'No echo found for this date')
	}

	const entry: Entry = decrypt_entry(entry_enc)

	return { entry }
}
