import { getContext } from 'svelte'
import type { Entry } from './types'
import type { LazyLang } from './translations/main'

export function format_date(date: string): string {
	const lang = getContext<LazyLang>('lang')()
	if (lang === 'de') return date.split('-').reverse().join('.')
	return date
}

function is_object(val: unknown): val is Record<string, unknown> {
	return typeof val === 'object' && val !== null && !Array.isArray(val)
}

function verify_entry(val: unknown): val is Entry {
	return (
		is_object(val) &&
		typeof val.id === 'number' &&
		typeof val.date === 'string' &&
		typeof val.title === 'string' &&
		typeof val.content === 'string' &&
		typeof val.thanks === 'string'
	)
}

export function verify_entries(list: unknown): list is Entry[] {
	return Array.isArray(list) && list.every((obj) => verify_entry(obj))
}
