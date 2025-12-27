import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { ts } from '$lib/translations/main'
import { query } from '$lib/server/db'
import type { Entry_DB } from '$lib/types'
import { error } from '@sveltejs/kit'
import { decrypt_entry } from '$lib/server/encryption'
import { get_language } from '$lib/translations/request'

export const GET: RequestHandler = async (event) => {
	const lang = get_language(event.cookies)
	const { rows, success } = await query<Entry_DB>(
		'SELECT id, date, title_enc, content_enc, thanks_enc FROM entries ORDER BY date',
	)

	if (!success) {
		return error(500, ts('error.database', lang))
	}

	const entries = rows.map(decrypt_entry)

	const today = new Date().toLocaleDateString('en-CA')

	return json(entries, {
		headers: {
			'Content-Disposition': `attachment; filename="export_${today}.json"`,
		},
	})
}
