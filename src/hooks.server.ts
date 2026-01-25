import { authenticate } from '$lib/server/auth'
import { is_known_device } from '$lib/server/devices'
import {
	get_language_from_cookie,
	get_language_from_header,
	set_language_cookie,
} from '$lib/translations/request'
import { redirect, type Handle } from '@sveltejs/kit'

const auth_routes = ['/account', '/api', '/dashboard', '/edit', '/new']

export const handle: Handle = async ({ event, resolve }) => {
	authenticate(event)

	const requires_auth = auth_routes.some((route) => event.url.pathname.startsWith(route))

	if (requires_auth && !event.locals.user) {
		redirect(307, '/login')
	}

	const known = await is_known_device(event)

	if (requires_auth && !known) {
		redirect(307, '/device-registration')
	}

	const language_in_cookie = get_language_from_cookie(event.cookies)
	const language_in_header = get_language_from_header(event.request.headers)
	const lang = language_in_cookie ?? language_in_header ?? 'en'

	set_language_cookie(event.cookies, lang)

	return await resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', lang),
	})
}
