import { query } from '$lib/server/db'
import { error, fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions: Actions = {
	default: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')

		const form = await event.request.formData()
		const date = form.get('date') as string

		if (!date) {
			return fail(400, { date, error: 'Date is missing' })
		}

		const { rows: entries, err } = await query<{ id: number }>(
			'SELECT id FROM entries WHERE date = ? AND user_id = ?',
			[date, user.id],
		)

		if (err) {
			return fail(500, { date, error: 'Database error' })
		}

		if (entries.length) {
			return fail(409, { date, error: 'An entry already exists for this date' })
		}

		redirect(303, `/new/${date}`)
	},
}
