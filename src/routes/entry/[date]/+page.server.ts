import { batched_query } from '$lib/server/db'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import type { Entry, Entry_DB } from '$lib/client/types'
import { decrypt_entry } from '$lib/server/encryption'
import { is_valid_date } from '$lib/server/schemas'

export const load: PageServerLoad = async (event) => {
	if (!is_valid_date(event.params.date)) error(404, 'Not Found')

	const user = event.locals.user
	if (!user) error(401, 'Unauthorized')

	const date = event.params.date

	const sql_entry = `
		SELECT id, date, title_enc, content_enc, thanks_enc
		FROM entries
		WHERE date = ? AND user_id = ?`

	const sql_next = `
		SELECT MIN(date) as date
		FROM entries
		WHERE date > ? AND user_id = ?`

	const sql_prev = `
		SELECT MAX(date) as date
		FROM entries
		WHERE date < ? AND user_id = ?`

	const args = [date, user.id]

	type Res = [Entry_DB[], { date: string }[], { date: string }[]]

	const { rows_list, err } = await batched_query<Res>(
		[
			{ sql: sql_entry, args },
			{ sql: sql_next, args },
			{ sql: sql_prev, args },
		],
		'read',
	)

	if (err) {
		error(500, 'Database error')
	}

	const [entries, next_entries, prev_entries] = rows_list

	const entry_enc = entries[0]

	if (!entry_enc) {
		error(404, 'No echo found for this date')
	}

	const entry: Entry = decrypt_entry(entry_enc)

	const next_date = next_entries.length ? next_entries[0].date : null
	const previous_date = prev_entries.length ? prev_entries[0].date : null

	return { entry, previous_date, next_date }
}
