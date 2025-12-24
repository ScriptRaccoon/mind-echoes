import { query } from '$lib/server/db'
import { t, type Lang } from '$lib/translations/main'
import type { Actions } from '@sveltejs/kit'
import { fail, redirect } from '@sveltejs/kit'

export const actions: Actions = {
	default: async (event) => {
		const lang = event.cookies.get('lang') as Lang
		const date = event.params.date

		if (!date) {
			return fail(400, { error: t('error.date_missing', lang) })
		}

		const form = await event.request.formData()
		const title = form.get('title') as string
		const content = form.get('content') as string
		const thanks = form.get('thanks') as string

		const { err } = await query(
			'INSERT INTO entries (date, title, content, thanks) VALUES (?,?,?,?)',
			[date, title, content, thanks],
		)

		if (err) {
			const error =
				err.code === 'SQLITE_CONSTRAINT_UNIQUE'
					? t('error.date_conflict', lang)
					: t('error.database', lang)

			const code = err.code === 'SQLITE_CONSTRAINT_UNIQUE' ? 409 : 500

			return fail(code, { title, content, thanks, error })
		}

		return redirect(302, '/app')
	},
}
