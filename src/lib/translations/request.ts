import type { Cookies } from '@sveltejs/kit'
import { SUPPORTED_LANGUAGES, type Lang } from './main'
import { COOKIE_LANG } from '$lib/server/config'

export function get_language_from_cookie(cookies: Cookies): Lang | null {
	const lang = cookies.get(COOKIE_LANG)
	if (lang && (SUPPORTED_LANGUAGES as readonly string[]).includes(lang)) {
		return lang as Lang
	}
	return null
}

export function get_language(cookies: Cookies): Lang {
	return get_language_from_cookie(cookies) ?? 'en'
}

export function set_language_cookie(cookies: Cookies, lang: Lang): void {
	cookies.set(COOKIE_LANG, lang, { path: '/' })
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
