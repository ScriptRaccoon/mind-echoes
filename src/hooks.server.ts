import { JWT_SECRET } from '$env/static/private'
import {
	get_language_from_cookie,
	get_language_from_header,
	set_language_cookie,
} from '$lib/translations/request'
import { redirect, type Handle } from '@sveltejs/kit'
import jwt from 'jsonwebtoken'

export const handle: Handle = async ({ event, resolve }) => {
	const requires_auth = event.url.pathname.startsWith('/app')
	if (requires_auth) {
		try {
			const token = event.cookies.get('jwt')
			if (!token) throw new Error('No token')
			jwt.verify(token, JWT_SECRET)
		} catch (_) {
			return redirect(307, '/login')
		}
	}

	const language_in_cookie = get_language_from_cookie(event.cookies)
	const language_in_header = get_language_from_header(event.request.headers)
	const lang = language_in_cookie ?? language_in_header ?? 'en'

	set_language_cookie(event.cookies, lang)

	return await resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', lang),
	})
}
