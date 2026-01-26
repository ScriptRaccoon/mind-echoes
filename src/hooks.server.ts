import { authenticate } from '$lib/server/auth'
import { initialize_db } from '$lib/server/db'
import { check_device } from '$lib/server/devices'

import { redirect, type Handle, type ServerInit } from '@sveltejs/kit'

const auth_routes = ['/account', '/api', '/dashboard', '/edit', '/new']

export const handle: Handle = async ({ event, resolve }) => {
	authenticate(event)

	const requires_auth = auth_routes.some((route) => event.url.pathname.startsWith(route))

	if (requires_auth && !event.locals.user) {
		redirect(307, '/login')
	}

	await check_device(event)

	if (requires_auth && !event.locals.device_id) {
		redirect(307, '/device-registration')
	}

	return await resolve(event)
}

export const init: ServerInit = async () => {
	await initialize_db()
}
