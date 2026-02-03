import { batched_query } from '$lib/server/db'
import { type Entry_DB_Summary, type Entry_Summary } from '$lib/shared/types'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { decrypt_entry_summary } from '$lib/server/encryption'

const sql_range = `
	SELECT MIN(date) as min_date, MAX(date) as max_date
	FROM entries
	WHERE user_id = ?`

const sql_entries = `
	SELECT id, date, title_enc
	FROM entries
	WHERE user_id = ? AND date >= ? AND date < ?
	ORDER BY date DESC`

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user
	if (!user) error(401, 'Unauthorized')

	const current_year = new Date().getFullYear()

	let year = current_year

	const year_query = parseInt(event.url.searchParams.get('year') ?? '')
	if (Number.isInteger(year_query)) {
		year = year_query
	}

	const year_str = `${year.toString().padStart(4, '0')}-01-01`
	const next_year_str = `${(year + 1).toString().padStart(4, '0')}-01-01`

	type T = [{ min_date: string | null; max_date: string | null }, Entry_DB_Summary]
	const { rows_list, err } = await batched_query<T>(
		[
			{ sql: sql_range, args: [user.id] },
			{ sql: sql_entries, args: [user.id, year_str, next_year_str] },
		],
		'read',
	)

	if (err) error(500, 'Database error')

	const [[{ min_date, max_date }], entries_enc] = rows_list

	const min_year = min_date ? new Date(min_date).getFullYear() : null
	const max_year = max_date ? new Date(max_date).getFullYear() : null

	if (min_year !== null && year < min_year) error(404, 'Not Found')
	if (max_year !== null && year > max_year) error(404, 'Not Found')

	const entries: Entry_Summary[] = entries_enc.map(decrypt_entry_summary)

	return { entries, current_year, year, min_year, max_year }
}
