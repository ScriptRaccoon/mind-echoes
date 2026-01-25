import { getContext } from 'svelte'
import type { LazyLang } from './translations/main'
import type { Attachment } from 'svelte/attachments'

export function format_date(date: string): string {
	const lang = getContext<LazyLang>('lang')()
	if (lang === 'de') return date.split('-').reverse().join('.')
	return date
}

export const resize_textarea: Attachment = (textarea) => {
	if (!(textarea instanceof HTMLTextAreaElement)) return

	textarea.style.height = `${textarea.scrollHeight}px`
	textarea.style.overflowY = 'hidden'

	const adjust = () => {
		textarea.style.height = 'auto'
		textarea.style.height = `${textarea.scrollHeight}px`
	}

	textarea.addEventListener('input', adjust)

	return () => {
		textarea.removeEventListener('input', adjust)
	}
}
