import { query } from '$lib/server/db'
import { encrypt } from '$lib/server/encryption'
import { ts, type Lang } from '$lib/translations/main'
import type { Actions } from '@sveltejs/kit'
import { fail, redirect } from '@sveltejs/kit'

export const actions: Actions = {
	default: async (event) => {
		const lang = event.cookies.get('lang') as Lang
		const date = event.params.date

		if (!date) {
			return fail(400, { error: ts('error.date_missing', lang) })
		}

		const form = await event.request.formData()
		const title = form.get('title') as string
		const content = form.get('content') as string
		const thanks = form.get('thanks') as string

		const title_enc = encrypt(title)
		const content_enc = encrypt(content)
		const thanks_enc = encrypt(thanks)

		const { err } = await query(
			'INSERT INTO entries (date, title_enc, content_enc, thanks_enc) VALUES (?,?,?,?)',
			[date, title_enc, content_enc, thanks_enc],
		)

		if (err) {
			const error =
				err.code === 'SQLITE_CONSTRAINT_UNIQUE'
					? ts('error.date_conflict', lang)
					: ts('error.database', lang)

			const code = err.code === 'SQLITE_CONSTRAINT_UNIQUE' ? 409 : 500

			return fail(code, { title, content, thanks, error })
		}

		return redirect(302, '/app')
	},
}
