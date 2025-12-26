import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { t, type Lang } from '$lib/translations/main'
import { query } from '$lib/server/db'
import type { Entry_DB } from '$lib/types'
import { error } from '@sveltejs/kit'
import { decrypt_entry } from '$lib/server/encryption'

export const GET: RequestHandler = async (event) => {
	const lang = event.cookies.get('lang') as Lang
	const { rows, success } = await query<Entry_DB>(
		'SELECT id, date, title_enc, content_enc, thanks_enc FROM entries ORDER BY date',
	)

	if (!success) {
		return error(500, t('error.database', lang))
	}

	const entries = rows.map(decrypt_entry)

	const today = new Date().toLocaleDateString('en-CA')

	return json(entries, {
		headers: {
			'Content-Disposition': `attachment; filename="export_${today}.json"`,
		},
	})
}
