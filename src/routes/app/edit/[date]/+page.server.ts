import { query } from '$lib/server/db'
import type { Actions } from '@sveltejs/kit'
import { error, fail, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import type { Entry } from '$lib/types'

export const load: PageServerLoad = async (event) => {
	const date = event.params.date

	const { rows: entries, success } = await query<Entry>(
		'SELECT id, date, title, content, thanks FROM entries WHERE date = ?',
		[date],
	)

	if (!success) {
		return error(500, 'Could not retrieve entry.')
	}

	const entry = entries[0]

	if (!entry) {
		return error(404, 'No entry found for this date.')
	}

	return { entry }
}

export const actions: Actions = {
	update: async (event) => {
		const date = event.params.date

		if (!date) {
			return fail(404, { error: 'Date is missing.' })
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
			return fail(500, { error: 'Update failed.' })
		}

		return { message: 'Entry has been updated.' }
	},

	delete: async (event) => {
		const date = event.params.date

		if (!date) {
			return fail(404, { error: 'Date is missing.' })
		}

		const { success } = await query('DELETE FROM entries WHERE date = ?', [date])

		if (!success) {
			return fail(500, { error: 'Entry could not be deleted.' })
		}

		return redirect(302, '/app')
	},
}
