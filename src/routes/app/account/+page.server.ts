import { fail, redirect, type Actions } from '@sveltejs/kit'
import bcrypt from 'bcrypt'
import { query } from '$lib/server/db'
import type { PageServerLoad } from '../$types'
import { MINIMAL_PASSWORD_LENGTH } from '$lib/server/config'
import { SUPPORTED_LANGUAGES, t, type Lang } from '$lib/translations/main'

export const load: PageServerLoad = async (event) => {
	const username = event.cookies.get('username') ?? ''
	return { username }
}

export const actions: Actions = {
	lang: async (event) => {
		const form = await event.request.formData()
		const lang_option = form.get('lang') as string
		if (SUPPORTED_LANGUAGES.includes(lang_option)) {
			event.cookies.set('lang', lang_option, { path: '/' })
		}
	},

	password: async (event) => {
		const lang = event.cookies.get('lang') as Lang
		const form = await event.request.formData()
		const current_password = form.get('current_password') as string
		const new_password = form.get('new_password') as string

		const { rows, success } = await query<{ password_hash: string }>(
			'SELECT password_hash FROM users WHERE id = 1',
		)

		if (!success || !rows.length) {
			return fail(500, {
				type: 'password',
				error: t('error.database', lang),
			})
		}

		const user = rows[0]

		const current_is_correct = await bcrypt.compare(current_password, user.password_hash)
		if (!current_is_correct) {
			return fail(401, {
				type: 'password',
				error: t('error.current_password_incorrect', lang),
			})
		}

		if (new_password.length < MINIMAL_PASSWORD_LENGTH) {
			return fail(400, {
				type: 'password',
				error: t('error.password_min', lang),
			})
		}

		const password_hash = await bcrypt.hash(new_password, 10)

		const { success: update_success } = await query(
			'UPDATE users SET password_hash = ? WHERE id = 1',
			[password_hash],
		)

		if (!update_success) {
			return fail(500, {
				type: 'password',
				error: t('error.database', lang),
			})
		}

		return {
			type: 'password',
			message: t('password.updated', lang),
		}
	},

	username: async (event) => {
		const lang = event.cookies.get('lang') as Lang
		const form = await event.request.formData()
		const username = form.get('username') as string

		if (!username.length) {
			return fail(400, {
				type: 'username',
				error: t('error.username_empty', lang),
			})
		}

		const { success } = await query('UPDATE users SET username = ? WHERE id = 1', [
			username,
		])

		if (!success) {
			return fail(500, {
				type: 'username',
				error: t('error.database', lang),
			})
		}

		event.cookies.set('username', username, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: true,
		})

		return {
			type: 'username',
			message: t('username.updated', lang),
		}
	},

	delete: async (event) => {
		const lang = event.cookies.get('lang') as Lang
		const form = await event.request.formData()
		const user_yes = form.get('yes') as string
		const actual_yes = t('yes', lang)

		if (user_yes.toLowerCase() !== actual_yes.toLowerCase()) {
			return fail(400, {
				type: 'delete',
				error: t('error.confirm_yes', lang),
			})
		}

		const { success } = await query('DELETE from users')
		if (!success) {
			return fail(500, {
				type: 'delete',
				error: t('error.database', lang),
			})
		}

		event.cookies.delete('jwt', { path: '/' })
		event.cookies.delete('username', { path: '/' })

		return redirect(302, '/')
	},
}
