import { fail, error, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import * as v from 'valibot'
import { device_label_schema } from '$lib/server/schemas'
import { save_device } from '$lib/server/devices'
import { get_os_and_browser } from '$lib/utils'
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

		const { user_id } = progress

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

		registration_cache.set(register_id, { ...progress, device_id })

		redirect(303, '/register/step-4')
	},
}
