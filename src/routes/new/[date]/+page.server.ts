import { is_constraint_error, query } from '$lib/server/db'
import { encrypt } from '$lib/server/encryption'
import { error, fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions: Actions = {
	default: async (event) => {
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

		const { err } = await query(
			'INSERT INTO entries (date, title_enc, content_enc, thanks_enc, user_id) VALUES (?,?,?,?,?)',
			[date, title_enc, content_enc, thanks_enc, user.id],
		)

		if (err) {
			if (is_constraint_error(err)) {
				const msg = 'An entry already exists for this date.'
				return fail(409, { title, content, thanks, error: msg })
			}
			return fail(500, { title, content, thanks, error: 'Database error.' })
		}

		redirect(302, '/dashboard')
	},
}
