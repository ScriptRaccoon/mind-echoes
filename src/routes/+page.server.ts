import { error, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { query } from '$lib/server/db'
import { t, type Lang } from '$lib/translations/main'

export const load: PageServerLoad = async (event) => {
	const lang = event.cookies.get('lang') as Lang
	const { rows, success } = await query<{ id: number }>('SELECT id FROM users')
	if (!success) {
		return error(500, t('error.database', lang))
	}
	return rows.length ? redirect(303, '/app') : redirect(303, '/register')
}
