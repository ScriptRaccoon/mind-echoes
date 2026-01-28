import { query } from '$lib/server/db'
import { error, fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import type { Entry, Entry_DB } from '$lib/types'
import { decrypt_entry, encrypt } from '$lib/server/encryption'
import * as v from 'valibot'
import {
	title_schema,
	content_schema,
	thanks_schema,
	is_valid_date,
	date_string_schema,
} from '$lib/server/schemas'

export const load: PageServerLoad = async (event) => {
	if (!is_valid_date(event.params.date)) error(404, 'Not Found')

	const user = event.locals.user
	if (!user) error(401, 'Unauthorized')

	const date = event.params.date

	const sql = `
		SELECT id, date, title_enc, content_enc, thanks_enc
		FROM entries
		WHERE date = ? AND user_id = ?`

	const { rows: entries, err } = await query<Entry_DB>(sql, [date, user.id])

	if (err) {
		error(500, 'Database error')
	}

	const entry_enc = entries[0]

	if (!entry_enc) {
		error(404, 'No entry found for this date')
	}

	const entry: Entry = decrypt_entry(entry_enc)

	return { entry }
}

export const actions: Actions = {
	update: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')

		const date = event.params.date
		const date_parsed = v.safeParse(date_string_schema, date)

		if (!date_parsed.success) {
			error(400, date_parsed.issues[0].message)
		}

		const form = await event.request.formData()
		const title = form.get('title') as string
		const content = form.get('content') as string
		const thanks = form.get('thanks') as string

		const title_parsed = v.safeParse(title_schema, title)

		if (!title_parsed.success) {
			return fail(400, {
				error: title_parsed.issues[0].message,
			})
		}

		const content_parsed = v.safeParse(content_schema, content)

		if (!content_parsed.success) {
			return fail(400, {
				error: content_parsed.issues[0].message,
			})
		}

		const thanks_parsed = v.safeParse(thanks_schema, thanks)

		if (!thanks_parsed.success) {
			return fail(400, {
				error: thanks_parsed.issues[0].message,
			})
		}

		const title_enc = encrypt(title)
		const content_enc = encrypt(content)
		const thanks_enc = encrypt(thanks)

		const sql = `
			UPDATE entries
			SET title_enc = ?, content_enc = ?, thanks_enc = ?
			WHERE date = ? AND user_id = ?`

		const { err } = await query(sql, [title_enc, content_enc, thanks_enc, date, user.id])

		if (err) {
			return fail(500, { error: 'Database error' })
		}

		return { message: 'Entry has been updated' }
	},

	delete: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')

		const date = event.params.date

		const sql = 'DELETE FROM entries WHERE date = ? AND user_id = ?'

		const { err } = await query(sql, [date, user.id])

		if (err) {
			return fail(500, { error: 'Database error' })
		}

		redirect(302, '/dashboard')
	},
}
