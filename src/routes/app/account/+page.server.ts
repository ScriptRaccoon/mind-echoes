import { fail, redirect, type Actions } from '@sveltejs/kit'
import bcrypt from 'bcrypt'
import { query } from '$lib/server/db'
import type { PageServerLoad } from '../$types'
import { MINIMAL_PASSWORD_LENGTH } from '$lib/server/config'

export const load: PageServerLoad = async (event) => {
	const username = event.cookies.get('username') ?? ''
	return { username }
}

export const actions: Actions = {
	password: async (event) => {
		const form = await event.request.formData()
		const current_password = form.get('current_password') as string
		const new_password = form.get('new_password') as string

		const { rows, success } = await query<{ password_hash: string }>(
			'SELECT password_hash FROM users WHERE id = 1',
		)

		if (!success || !rows.length) {
			return fail(500, { type: 'password', error: 'Could not retrieve user.' })
		}

		const user = rows[0]

		const current_is_correct = await bcrypt.compare(current_password, user.password_hash)
		if (!current_is_correct) {
			return fail(401, { type: 'password', error: 'Current password is incorrect.' })
		}

		if (new_password.length < MINIMAL_PASSWORD_LENGTH) {
			return fail(404, {
				type: 'password',
				error: 'New password must be at least 8 characters.',
			})
		}

		const password_hash = await bcrypt.hash(new_password, 10)

		const { success: update_success } = await query(
			'UPDATE users SET password_hash = ? WHERE id = 1',
			[password_hash],
		)

		if (!update_success) {
			return fail(500, { type: 'password', error: 'Could not update password.' })
		}

		return { type: 'password', message: 'Password has been updated successfully.' }
	},

	username: async (event) => {
		const form = await event.request.formData()
		const username = form.get('username') as string

		if (!username.length) {
			return fail(404, { type: 'username', error: 'Username cannot be empty.' })
		}

		const { success } = await query('UPDATE users SET username = ? WHERE id = 1', [
			username,
		])

		if (!success) {
			return fail(500, { type: 'username', error: 'Username could not be updated.' })
		}

		event.cookies.set('username', username, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: true,
		})

		return {
			type: 'username',
			message: 'Username has been updated successfully.',
		}
	},

	delete: async (event) => {
		const form = await event.request.formData()
		const yes = form.get('yes') as string

		if (yes.toLowerCase() !== 'yes') {
			return fail(404, {
				type: 'delete',
				error: "Type 'Yes' (3 letters) to confirm this action.",
			})
		}

		const { success } = await query('DELETE from users')
		if (!success) {
			return fail(500, { type: 'delete', error: 'Data could not be deleted' })
		}

		event.cookies.delete('jwt', { path: '/' })
		event.cookies.delete('username', { path: '/' })

		return redirect(302, '/')
	},
}
