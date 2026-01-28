import { create_device_verification_token, save_device } from '$lib/server/devices'
import { error, fail } from '@sveltejs/kit'
import type { Actions } from './$types'
import { RateLimiter } from '$lib/server/ratelimit'
import type { PageServerLoad } from './$types'
import * as v from 'valibot'
import { device_label_schema } from '$lib/server/schemas'
import { send_device_verification_email } from '$lib/server/email'
import { get_os_and_browser } from '$lib/utils'

export const load: PageServerLoad = async (event) => {
	const os = get_os_and_browser(event)
	return { os }
}

const limiter = new RateLimiter({ limit: 1, window_ms: 60_000 })

export const actions: Actions = {
	default: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')

		const ip = event.getClientAddress()

		if (!limiter.is_allowed(ip)) {
			return fail(429, {
				device_label: '',
				error: 'Too many registrations. Try again later.',
			})
		}

		const form = await event.request.formData()
		const device_label = form.get('device_label') as string

		const device_label_parsed = v.safeParse(device_label_schema, device_label)

		if (!device_label_parsed.success) {
			return fail(400, {
				device_label,
				error: device_label_parsed.issues[0].message,
			})
		}

		const { device_id } = await save_device(event, user.id, device_label, {
			verify: false,
		})

		if (!device_id) {
			return fail(500, { device_label, error: 'Database error' })
		}

		const { token_id } = await create_device_verification_token(device_id)

		if (!token_id) {
			return fail(500, { device_label, error: 'Database error' })
		}

		const link = `${event.url.origin}/device-verification?token=${token_id}`

		try {
			await send_device_verification_email(user.username, device_label, user.email, link)
		} catch (err) {
			console.error(err)

			return fail(500, { device_label, error: 'Failed to send verification email' })
		}

		limiter.record(ip)

		return {
			message:
				'Your device has been added and marked for verification. To proceed, check your email inbox and verify the new device.',
		}
	},
}
