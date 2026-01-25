import { error, fail, redirect, type Actions } from '@sveltejs/kit'
import bcrypt from 'bcrypt'
import { db, query } from '$lib/server/db'
import { MINIMAL_PASSWORD_LENGTH } from '$lib/server/config'
import { SUPPORTED_LANGUAGES, ts, type Lang } from '$lib/translations/main'
import { verify_entries } from '$lib/utils'
import { encrypt_entry } from '$lib/server/encryption'
import { get_language, set_language_cookie } from '$lib/translations/request'
import { delete_auth_cookie, set_auth_cookie } from '$lib/server/auth'

export const actions: Actions = {
	lang: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')
		const form = await event.request.formData()
		const lang_option = form.get('lang') as string
		if ((SUPPORTED_LANGUAGES as readonly string[]).includes(lang_option)) {
			set_language_cookie(event.cookies, lang_option as Lang)
		}
	},

	password: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')

		const lang = get_language(event.cookies)
		const form = await event.request.formData()
		const current_password = form.get('current_password') as string
		const new_password = form.get('new_password') as string

		const { rows, success } = await query<{ password_hash: string }>(
			'SELECT password_hash FROM users WHERE id = ?',
			[user.id],
		)

		if (!success || !rows.length) {
			return fail(500, {
				type: 'password',
				error: ts('error.database', lang),
			})
		}

		const { password_hash } = rows[0]

		const current_is_correct = await bcrypt.compare(current_password, password_hash)
		if (!current_is_correct) {
			return fail(401, {
				type: 'password',
				error: ts('error.current_password_incorrect', lang),
			})
		}

		if (new_password.length < MINIMAL_PASSWORD_LENGTH) {
			return fail(400, {
				type: 'password',
				error: ts('error.password_min', lang),
			})
		}

		const new_password_hash = await bcrypt.hash(new_password, 10)

		const { success: update_success } = await query(
			'UPDATE users SET password_hash = ? WHERE id = ?',
			[new_password_hash, user.id],
		)

		if (!update_success) {
			return fail(500, {
				type: 'password',
				error: ts('error.database', lang),
			})
		}

		return {
			type: 'password',
			message: ts('password.updated', lang),
		}
	},

	username: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')

		const lang = get_language(event.cookies)
		const form = await event.request.formData()
		const username = form.get('username') as string

		if (!username.length) {
			return fail(400, {
				type: 'username',
				error: ts('error.username_empty', lang),
			})
		}

		const { success } = await query('UPDATE users SET username = ? WHERE id = ?', [
			username,
			user.id,
		])

		if (!success) {
			return fail(500, {
				type: 'username',
				error: ts('error.database', lang),
			})
		}

		user.username = username

		set_auth_cookie(event, user)

		return {
			type: 'username',
			message: ts('username.updated', lang),
		}
	},

	backup: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')

		const lang = get_language(event.cookies)
		const form = await event.request.formData()
		const file = form.get('file')

		const is_valid_file =
			file instanceof File &&
			file.type === 'application/json' &&
			file.name.endsWith('.json')

		if (!is_valid_file) {
			return fail(400, {
				type: 'backup',
				error: ts('error.file_json', lang),
			})
		}

		const file_content = await file.text()

		let entries: unknown = null

		try {
			entries = JSON.parse(file_content)
		} catch (_) {
			return fail(400, {
				type: 'backup',
				error: ts('error.file_valid_json', lang),
			})
		}

		if (!verify_entries(entries)) {
			return fail(400, {
				type: 'backup',
				error: ts('error.invalid_entries', lang),
			})
		}

		const encoded_entries = entries.map(encrypt_entry)

		const tx = await db.transaction('write')

		try {
			await tx.execute('DELETE FROM entries')

			for (const entry of encoded_entries) {
				await tx.execute({
					sql: 'INSERT INTO entries (id, date, title_enc, content_enc, thanks_enc, user_id) VALUES (?,?,?,?,?,?)',
					args: [
						entry.id,
						entry.date,
						entry.title_enc,
						entry.content_enc,
						entry.thanks_enc,
						user.id,
					],
				})
			}

			await tx.commit()
		} catch (err) {
			console.error(err)
			return fail(500, { type: 'backup', error: ts('error.database', lang) })
		}

		return {
			type: 'backup',
			message: ts('backup.success', lang, encoded_entries.length.toString()),
		}
	},

	delete: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')

		const lang = get_language(event.cookies)
		const form = await event.request.formData()
		const user_yes = form.get('yes') as string
		const actual_yes = ts('yes', lang)

		if (user_yes.toLowerCase() !== actual_yes.toLowerCase()) {
			return fail(400, {
				type: 'delete',
				error: ts('error.confirm_yes', lang),
			})
		}

		const { success } = await query('DELETE FROM users WHERE id = ?', [user.id])

		if (!success) {
			return fail(500, {
				type: 'delete',
				error: ts('error.database', lang),
			})
		}

		delete_auth_cookie(event)

		redirect(302, '/')
	},
}
