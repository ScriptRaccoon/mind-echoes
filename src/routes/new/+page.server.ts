import { query } from '$lib/server/db'
import { ts } from '$lib/translations/main'
import { get_language } from '$lib/translations/request'
import { fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions: Actions = {
	default: async (event) => {
		const lang = get_language(event.cookies)
		const form = await event.request.formData()
		const date = form.get('date') as string

		if (!date) {
			return fail(400, { date, error: ts('error.date_missing', lang) })
		}

		const { rows: entries, success } = await query<{ id: number }>(
			'SELECT id FROM entries WHERE date = ?',
			[date],
		)

		if (!success) {
			return fail(500, { date, error: ts('error.database', lang) })
		}

		if (entries.length) {
			return fail(409, { date, error: ts('error.date_conflict', lang) })
		}

		return redirect(303, `/new/${date}`)
	},
}
