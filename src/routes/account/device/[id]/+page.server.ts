import { error, fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { query } from '$lib/server/db'
import { delete_device_from_cache } from '$lib/server/devices'
import { device_label_schema } from '$lib/server/schemas'
import * as v from 'valibot'
import type { Device } from '$lib/client/types'

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user
	if (!user) error(401, 'Unauthorized')

	const sql = `
        SELECT id, label, created_at, last_login_at
        FROM devices
        WHERE id = ? AND user_id = ? AND verified_at IS NOT NULL`

	const { rows: devices, err } = await query<Device>(sql, [event.params.id, user.id])

	if (err) error(500, 'Database error')

	if (!devices.length) error(404, 'Not Found')

	const { id, label, created_at, last_login_at } = devices[0]

	const is_current_device = id === event.locals.device_id

	return { id, label, created_at, last_login_at, is_current_device }
}

export const actions: Actions = {
	rename_device: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')

		const form = await event.request.formData()
		const device_label = form.get('label') as string
		const device_id = event.params.id

		const device_label_parsed = v.safeParse(device_label_schema, device_label)

		if (!device_label_parsed.success) {
			return fail(400, {
				error: device_label_parsed.issues[0].message,
			})
		}

		const sql = `
			UPDATE devices
			SET label = ?
			WHERE user_id = ? AND id = ?`

		const { err } = await query(sql, [device_label, user.id, device_id])

		if (err) return fail(400, { error: 'Database error' })

		return { message: 'Device has been renamed' }
	},

	remove_device: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')

		const device_id = event.params.id

		if (device_id === event.locals.device_id) {
			return fail(403, { error: 'You cannot remove the current device' })
		}

		const sql = `
			DELETE FROM devices
			WHERE user_id = ? AND id = ?
			RETURNING token_hash`

		const { rows, err } = await query<{ token_hash: string }>(sql, [user.id, device_id])

		if (err || !rows.length) {
			return fail(400, { error: 'Database error' })
		}

		const { token_hash } = rows[0]

		delete_device_from_cache(token_hash)

		redirect(303, '/account?from=remove_device')
	},
}
