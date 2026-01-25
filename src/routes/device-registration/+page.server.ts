import {
	create_device_token,
	save_device_cookie,
	save_device_token_in_database,
} from '$lib/server/devices'
import { ts } from '$lib/translations/main'
import { get_language } from '$lib/translations/request'
import { error, fail } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions: Actions = {
	default: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')

		const lang = get_language(event.cookies)

		const form = await event.request.formData()
		const device_label = form.get('device_label') as string

		if (!device_label) {
			return fail(400, { error: ts('error.device.label', lang) })
		}

		const device_token = create_device_token()

		const success = save_device_token_in_database(user.id, device_label, device_token)

		if (!success) {
			return fail(500, { error: ts('error.database', lang) })
		}

		save_device_cookie(event, device_token)

		return { message: ts('device.registered', lang) }
	},
}
