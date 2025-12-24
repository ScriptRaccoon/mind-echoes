import type { Cookies } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'
import { SUPPORTED_LANGUAGES, type Lang } from '$lib/translations/main'

export const load: LayoutServerLoad = (event) => {
	const language_in_cookie = get_language_from_cookie(event.cookies)
	const language_in_header = get_language_from_header(event.request.headers)
	const lang: Lang = language_in_cookie ?? language_in_header ?? 'en'

	event.cookies.set('lang', lang, { path: '/' })

	return { lang }
}

function get_language_from_cookie(cookies: Cookies): Lang | null {
	const lang = cookies.get('lang')
	if (lang && SUPPORTED_LANGUAGES.includes(lang)) return lang as Lang
	return null
}

function get_language_from_header(headers: Headers): Lang | null {
	const lang_header = headers.get('accept-language')
	if (!lang_header) return null

	const locale = lang_header.split(',')[0]
	const lang = locale?.split('-')[0]

	if (SUPPORTED_LANGUAGES.includes(lang)) return lang as Lang
	return null
}
