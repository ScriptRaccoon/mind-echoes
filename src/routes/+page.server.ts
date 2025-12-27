import { error, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { query } from '$lib/server/db'
import { ts } from '$lib/translations/main'
import { get_language } from '$lib/translations/request'

export const load: PageServerLoad = async (event) => {
	const lang = get_language(event.cookies)
	const { rows, success } = await query<{ id: number }>('SELECT id FROM users')
	if (!success) {
		return error(500, ts('error.database', lang))
	}
	return rows.length ? redirect(303, '/app') : redirect(303, '/register')
}
