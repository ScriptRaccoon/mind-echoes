import translations_de from './de.json'
import translations_en from './en.json'

const translations = {
	de: translations_de,
	en: translations_en,
} as const

export const SUPPORTED_LANGUAGES = ['de', 'en']

export type Lang = 'de' | 'en'

export function t(
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
