import { query } from '$lib/server/db'
import { error, fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import type { Entry, Entry_DB } from '$lib/types'
import { decrypt_entry, encrypt } from '$lib/server/encryption'

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user
	if (!user) error(401, 'Unauthorized')

	const date = event.params.date

	const { rows: entries, success } = await query<Entry_DB>(
		'SELECT id, date, title_enc, content_enc, thanks_enc FROM entries WHERE date = ? AND user_id = ?',
		[date, user.id],
	)

	if (!success) {
		error(500, 'Database error.')
	}

	const entry_enc = entries[0]

	if (!entry_enc) {
		error(404, 'No entry found for this date.')
	}

	const entry: Entry = decrypt_entry(entry_enc)

	return { entry }
}

export const actions: Actions = {
	update: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')

		const date = event.params.date

		const form = await event.request.formData()
		const title = form.get('title') as string
		const content = form.get('content') as string
		const thanks = form.get('thanks') as string

		const title_enc = encrypt(title)
		const content_enc = encrypt(content)
		const thanks_enc = encrypt(thanks)

		const { success } = await query(
			'UPDATE entries SET title_enc = ?, content_enc = ?, thanks_enc = ? WHERE date = ? AND user_id = ?',
			[title_enc, content_enc, thanks_enc, date, user.id],
		)

		if (!success) {
			return fail(500, { error: 'Database error.' })
		}

		return { message: 'Entry has been updated.' }
	},

	delete: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')

		const date = event.params.date

		const { success } = await query(
			'DELETE FROM entries WHERE date = ? AND user_id = ?',
			[date, user.id],
		)

		if (!success) {
			return fail(500, { error: 'Database error.' })
		}

		redirect(302, '/dashboard')
	},
}
