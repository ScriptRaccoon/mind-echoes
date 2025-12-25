import { query } from '$lib/server/db'
import type { Actions } from '@sveltejs/kit'
import { error, fail, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import type { Entry, Entry_DB } from '$lib/types'
import { t, type Lang } from '$lib/translations/main'
import { decrypt_entry, encrypt } from '$lib/server/encryption'

export const load: PageServerLoad = async (event) => {
	const lang = event.cookies.get('lang') as Lang
	const date = event.params.date

	const { rows: entries, success } = await query<Entry_DB>(
		'SELECT id, date, title_enc, content_enc, thanks_enc FROM entries WHERE date = ?',
		[date],
	)

	if (!success) {
		return error(500, t('error.database', lang))
	}

	const entry_enc = entries[0]

	if (!entry_enc) {
		return error(404, t('error.no_entry_found', lang))
	}

	const entry: Entry = decrypt_entry(entry_enc)

	return { entry }
}

export const actions: Actions = {
	update: async (event) => {
		const lang = event.cookies.get('lang') as Lang
		const date = event.params.date

		if (!date) {
			return fail(400, { error: t('error.date_missing', lang) })
		}

		const form = await event.request.formData()
		const title = form.get('title') as string
		const content = form.get('content') as string
		const thanks = form.get('thanks') as string

		const title_enc = encrypt(title)
		const content_enc = encrypt(content)
		const thanks_enc = encrypt(thanks)

		const { success } = await query(
			'UPDATE entries SET title_enc = ?, content_enc = ?, thanks_enc = ? WHERE date = ?',
			[title_enc, content_enc, thanks_enc, date],
		)

		if (!success) {
			return fail(500, { error: t('error.database', lang) })
		}

		return { message: t('entry.updated', lang) }
	},

	delete: async (event) => {
		const lang = event.cookies.get('lang') as Lang
		const date = event.params.date

		if (!date) {
			return fail(400, { error: t('error.date_missing', lang) })
		}

		const { success } = await query('DELETE FROM entries WHERE date = ?', [date])

		if (!success) {
			return fail(500, { error: t('error.database', lang) })
		}

		return redirect(302, '/app')
	},
}
