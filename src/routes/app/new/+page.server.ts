import { query } from '$lib/server/db'
import { fail, redirect, type Actions } from '@sveltejs/kit'

export const actions: Actions = {
	default: async (event) => {
		const form = await event.request.formData()
		const date = form.get('date') as string

		if (!date) {
			return fail(400, {
				date,
				error: 'Date is missing.',
			})
		}

		const { rows: entries, success } = await query<{ id: number }>(
			'SELECT id FROM entries WHERE date = ?',
			[date],
		)
		if (!success) {
			return fail(500, {
				date,
				error: 'Cannot retrieve entry.',
			})
		}

		if (entries.length) {
			return fail(409, {
				date,
				error: 'This date already has an entry.',
			})
		}

		return redirect(303, `/app/new/${date}`)
	},
}
