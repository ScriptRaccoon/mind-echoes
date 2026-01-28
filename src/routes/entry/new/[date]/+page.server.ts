import { is_constraint_error, query } from '$lib/server/db'
import { encrypt } from '$lib/server/encryption'
import { error, fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import * as v from 'valibot'
import {
	title_schema,
	content_schema,
	thanks_schema,
	date_string_schema,
} from '$lib/server/schemas'
import { is_valid_date } from '$lib/server/schemas'

export const load: PageServerLoad = async (event) => {
	if (!is_valid_date(event.params.date)) error(404, 'Not Found')
}

export const actions: Actions = {
	default: async (event) => {
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
				title,
				content,
				thanks,
				error: title_parsed.issues[0].message,
			})
		}

		const content_parsed = v.safeParse(content_schema, content)

		if (!content_parsed.success) {
			return fail(400, {
				title,
				content,
				thanks,
				error: content_parsed.issues[0].message,
			})
		}

		const thanks_parsed = v.safeParse(thanks_schema, thanks)

		if (!thanks_parsed.success) {
			return fail(400, {
				title,
				content,
				thanks,
				error: thanks_parsed.issues[0].message,
			})
		}

		const title_enc = encrypt(title)
		const content_enc = encrypt(content)
		const thanks_enc = encrypt(thanks)

		const sql = `
			INSERT INTO entries
				(date, title_enc, content_enc, thanks_enc, user_id)
			VALUES (?,?,?,?,?)`

		const { err } = await query(sql, [date, title_enc, content_enc, thanks_enc, user.id])

		if (err) {
			if (is_constraint_error(err)) {
				const msg = 'An echo already exists for this date'
				return fail(409, { title, content, thanks, error: msg })
			}
			return fail(500, { title, content, thanks, error: 'Database error' })
		}

		redirect(302, `/entry/${date}`)
	},
}
