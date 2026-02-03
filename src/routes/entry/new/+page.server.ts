import { query } from '$lib/server/db'
import { error, fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'
import * as v from 'valibot'
import { date_string_schema } from '$lib/server/schemas'

export const actions: Actions = {
	default: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')

		const form = await event.request.formData()
		const date = form.get('date') as string

		const date_parsed = v.safeParse(date_string_schema, date)

		if (!date_parsed.success) {
			return fail(400, { error: date_parsed.issues[0].message })
		}

		const sql = 'SELECT id FROM entries WHERE date = ? AND user_id = ?'

		const { rows: entries, err } = await query<{ id: number }>(sql, [date, user.id])

		if (err) return fail(500, { error: 'Database error' })

		if (entries.length) {
			return fail(409, { error: 'An echo already exists for this date' })
		}

		redirect(303, `/entry/new/${date}`)
	},
}
