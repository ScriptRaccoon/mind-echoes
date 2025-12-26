import { getContext } from 'svelte'
import type { Entry } from './types'
import type { LazyLang } from './translations/main'

export function format_date(date: string): string {
	const lang = getContext<LazyLang>('lang')()
	if (lang === 'de') return date.split('-').reverse().join('.')
	return date
}

function verify_entry(obj: unknown): obj is Entry {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		Object.keys(obj).sort().join(',') === 'content,date,id,thanks,title' &&
		typeof obj['id' as keyof typeof obj] === 'number' &&
		typeof obj['date' as keyof typeof obj] === 'string' &&
		typeof obj['title' as keyof typeof obj] === 'string' &&
		typeof obj['content' as keyof typeof obj] === 'string' &&
		typeof obj['thanks' as keyof typeof obj] === 'string'
	)
}

export function verify_entries(list: unknown): list is Entry[] {
	return Array.isArray(list) && list.every((obj) => verify_entry(obj))
}
