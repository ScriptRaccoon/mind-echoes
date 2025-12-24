import { query } from '$lib/server/db'
import { t, type Lang } from '$lib/translations/main'
import { fail, redirect, type Actions } from '@sveltejs/kit'

export const actions: Actions = {
	default: async (event) => {
		const lang = event.cookies.get('lang') as Lang
		const form = await event.request.formData()
		const date = form.get('date') as string

		if (!date) {
			return fail(400, { date, error: t('error.date_missing', lang) })
		}

		const { rows: entries, success } = await query<{ id: number }>(
			'SELECT id FROM entries WHERE date = ?',
			[date],
		)

		if (!success) {
			return fail(500, { date, error: t('error.database', lang) })
		}

		if (entries.length) {
			return fail(409, { date, error: t('error.date_conflict', lang) })
		}

		return redirect(303, `/app/new/${date}`)
	},
}
