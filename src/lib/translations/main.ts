import { getContext } from 'svelte'
import translations_de from './de.json'
import translations_en from './en.json'

const translations = {
	de: translations_de,
	en: translations_en,
} as const

export const SUPPORTED_LANGUAGES = ['de', 'en'] as const

export type Lang = (typeof SUPPORTED_LANGUAGES)[number]

export type LazyLang = () => Lang

/**
 * Translation function to be used on the server.
 */
export function ts(
	key: keyof typeof translations.en,
	lang: Lang,
	replacer?: string,
): string {
	const obj = translations[lang]
	if (key in obj) {
		const txt = obj[key as keyof typeof obj]
		return replacer ? txt.replace('{{}}', replacer) : txt
	}
	return key
}

/**
 * Translation function to be used on the client.
 */
export function t(key: keyof typeof translations.en, replacer?: string): string {
	const lang = getContext<LazyLang>('lang')()
	return ts(key, lang, replacer)
}
