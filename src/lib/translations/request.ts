import type { Cookies } from '@sveltejs/kit'
import { SUPPORTED_LANGUAGES, type Lang } from './main'

export function get_language_from_cookie(cookies: Cookies): Lang | null {
	const lang = cookies.get('lang')
	if (lang && (SUPPORTED_LANGUAGES as readonly string[]).includes(lang)) {
		return lang as Lang
	}
	return null
}

export function set_language_cookie(cookies: Cookies, lang: Lang): void {
	cookies.set('lang', lang, { path: '/' })
}

export function get_language_from_header(headers: Headers): Lang | null {
	const lang_header = headers.get('accept-language')
	if (!lang_header) return null

	const locale = lang_header.split(',')[0]
	const lang = locale?.split('-')[0]

	if ((SUPPORTED_LANGUAGES as readonly string[]).includes(lang)) {
		return lang as Lang
	}
	return null
}
