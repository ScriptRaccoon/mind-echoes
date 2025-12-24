import { query } from '$lib/server/db'
import type { Actions } from '@sveltejs/kit'
import { error, fail, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import type { Entry } from '$lib/types'
import { t, type Lang } from '$lib/translations/main'

export const load: PageServerLoad = async (event) => {
	const lang = event.cookies.get('lang') as Lang
	const date = event.params.date

	const { rows: entries, success } = await query<Entry>(
		'SELECT id, date, title, content, thanks FROM entries WHERE date = ?',
		[date],
	)

	if (!success) {
		return error(500, t('error.database', lang))
	}

	const entry = entries[0]

	if (!entry) {
		return error(404, t('error.no_entry_found', lang))
	}

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

		const { success } = await query(
			'UPDATE entries SET title = ?, content = ?, thanks = ? WHERE date = ?',
			[title, content, thanks, date],
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
