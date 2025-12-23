import { error, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { query } from '$lib/server/db'

export const load: PageServerLoad = async () => {
	const { rows, success } = await query<{ id: number }>('SELECT id FROM users')
	if (!success) {
		return error(500, 'User cannot be retrieved from database.')
	}
	return rows.length ? redirect(303, '/app') : redirect(303, '/register')
}
