import { is_constraint_error, query } from '$lib/server/db'
import { fail, error } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import * as v from 'valibot'
import { device_label_schema } from '$lib/server/schemas'
import { send_email_verification_email } from '$lib/server/email'
import { save_device } from '$lib/server/devices'
import { get_os_and_browser } from '$lib/utils'
import crypto from 'node:crypto'
import { REGISTER_COOKIE_NAME } from '$lib/server/registration-cache'
import { registration_cache } from '$lib/server/registration-cache'

export const load: PageServerLoad = async (event) => {
	const register_id = event.cookies.get(REGISTER_COOKIE_NAME)
	if (!register_id) error(403, 'Forbidden')

	const progress = registration_cache.get(register_id)
	if (!progress || !progress.user_id) error(403, 'Forbidden')

	if (progress.expires_at <= Date.now()) {
		error(403, 'Session expired')
	}

	const os = get_os_and_browser(event)
	return { os }
}

export const actions: Actions = {
	default: async (event) => {
		const register_id = event.cookies.get(REGISTER_COOKIE_NAME)
		if (!register_id) error(403, 'Forbidden')

		const progress = registration_cache.get(register_id)
		if (!progress || !progress.user_id) error(403, 'Forbidden')

		if (progress.expires_at <= Date.now()) {
			error(403, 'Session expired')
		}

		const { username, email, user_id } = progress

		// --- Device registration ---

		const form = await event.request.formData()

		const device_label = form.get('device_label') as string

		const device_label_parsed = v.safeParse(device_label_schema, device_label)

		if (!device_label_parsed.success) {
			return fail(400, { device_label, error: device_label_parsed.issues[0].message })
		}

		const { device_id } = await save_device(event, user_id, device_label, {
			verify: true,
		})

		if (!device_id) {
			return fail(500, { device_label, error: 'Database error' })
		}

		// --- Email verification ---

		const token_id = crypto.randomUUID()

		const sql_token = 'INSERT INTO email_verification_tokens (id, user_id) VALUES (?,?)'

		const { err: err_token } = await query(sql_token, [token_id, user_id])

		if (err_token) {
			return fail(500, { device_label, error: 'Database error' })
		}

		const link = `${event.url.origin}/email-verification?token=${token_id}`

		try {
			await send_email_verification_email(username, email, link)
		} catch (err) {
			console.error(err)
			return fail(500, {
				device_label,
				error: 'Failed to send verification email',
			})
		}

		const message =
			`Your account has been created. ` +
			`Check your email inbox to complete the registration.`

		return { device_label, message }
	},
}
