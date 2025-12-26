import { ENABLE_DEVICE_REGISTRATION } from '$env/static/private'
import { DEVICE_COOKIE_OPTIONS } from '$lib/server/config'
import { query } from '$lib/server/db'
import { error, fail, type Actions } from '@sveltejs/kit'
import crypto from 'crypto'

export const load = async () => {
	if (ENABLE_DEVICE_REGISTRATION !== 'true') {
		error(404, 'Not Found')
	}
}

export const actions: Actions = {
	default: async (event) => {
		if (!ENABLE_DEVICE_REGISTRATION) {
			return fail(405, 'Registration not allowed')
		}

		const form = await event.request.formData()
		const device_label = form.get('device') as string

		const raw_token = crypto.randomBytes(32).toString('hex')
		const token_hash = crypto.createHash('sha256').update(raw_token).digest('hex')

		event.cookies.set('device_token', raw_token, DEVICE_COOKIE_OPTIONS)

		const { success } = await query(
			'INSERT INTO devices (label, token_hash) VALUES (?,?)',
			[device_label, token_hash],
		)

		if (!success) {
			return fail(500, { error: 'Internal Server Error' })
		}

		return { message: 'Device has been registered.' }
	},
}
