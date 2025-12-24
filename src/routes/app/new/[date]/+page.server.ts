import { query } from '$lib/server/db'
import type { Actions } from '@sveltejs/kit'
import { fail, redirect } from '@sveltejs/kit'

export const actions: Actions = {
	default: async (event) => {
		const date = event.params.date

		if (!date) {
			return fail(400, { error: 'Date is missing.' })
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
					? 'This date already has an entry.'
					: 'Entry could not be created.'

			const code = err.code === 'SQLITE_CONSTRAINT_UNIQUE' ? 409 : 500

			return fail(code, { title, content, thanks, error })
		}

		return redirect(302, '/app')
	},
}
