import { query } from '$lib/server/db'
import { type Entry } from '$lib/types'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async (event) => {
	const username = event.cookies.get('username') ?? ''

	const { rows: entries, success } = await query<Entry>(
		'SELECT id, date, title, content, thanks FROM entries ORDER BY date desc',
	)

	if (!success) {
		return error(500, 'Could not load entries.')
	}

	return { username, entries }
}
