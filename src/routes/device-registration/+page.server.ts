import {
	create_device_token,
	save_device_cookie,
	save_device_token_in_database,
} from '$lib/server/devices'
import { error, fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions: Actions = {
	default: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')

		const form = await event.request.formData()
		const device_label = form.get('device_label') as string

		if (!device_label) {
			return fail(400, { error: 'Device label cannot be empty' })
		}

		const device_token = create_device_token()

		const success = save_device_token_in_database(user.id, device_label, device_token)

		if (!success) {
			return fail(500, { error: 'Database error' })
		}

		save_device_cookie(event, device_token)

		redirect(303, '/dashboard')
	},
}
