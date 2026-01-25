import { ENABLE_DEVICE_REGISTRATION } from '$env/static/private'
import { authenticate } from '$lib/server/auth'
import { COOKIE_DEVICE_TOKEN } from '$lib/server/config'
import { is_valid_device } from '$lib/server/devices'
import {
	get_language_from_cookie,
	get_language_from_header,
	set_language_cookie,
} from '$lib/translations/request'
import { redirect, type Handle } from '@sveltejs/kit'

const auth_routes = ['/account', '/api', '/dashboard', '/edit', '/new']

export const handle: Handle = async ({ event, resolve }) => {
	const device_token = event.cookies.get(COOKIE_DEVICE_TOKEN)
	const device_is_valid = !!device_token && (await is_valid_device(device_token))

	authenticate(event)

	const requires_auth = auth_routes.some((route) => event.url.pathname.startsWith(route))

	if (requires_auth && !event.locals.user) {
		return redirect(307, '/login')
	}

	if (ENABLE_DEVICE_REGISTRATION === 'true' && requires_auth && !device_is_valid) {
		return redirect(307, '/device-registration')
	}

	const language_in_cookie = get_language_from_cookie(event.cookies)
	const language_in_header = get_language_from_header(event.request.headers)
	const lang = language_in_cookie ?? language_in_header ?? 'en'

	set_language_cookie(event.cookies, lang)

	return await resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', lang),
	})
}
