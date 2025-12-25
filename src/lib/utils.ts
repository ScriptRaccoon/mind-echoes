import type { Lang } from './translations/main'

export function format_date(date: string, lang: Lang): string {
	if (lang === 'de') return date.split('-').reverse().join('.')
	return date
}
