import { query } from '$lib/server/db'
import { encrypt } from '$lib/server/encryption'
import { ts } from '$lib/translations/main'
import { get_language } from '$lib/translations/request'
import { error, fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions: Actions = {
	default: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')

		const lang = get_language(event.cookies)
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
			const error =
				err.code === 'SQLITE_CONSTRAINT_UNIQUE'
					? ts('error.date_conflict', lang)
					: ts('error.database', lang)

			const code = err.code === 'SQLITE_CONSTRAINT_UNIQUE' ? 409 : 500

			return fail(code, { title, content, thanks, error })
		}

		redirect(302, '/dashboard')
	},
}
