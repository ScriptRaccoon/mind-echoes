import type { Attachment } from 'svelte/attachments'

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

export function localize_date(datestring: string): string {
	const date = new Date(datestring.substring(0, 10))
	return date.toLocaleDateString()
}

export function sleep(delay: number) {
	return new Promise<void>((res) => setTimeout(res, delay))
}

export function format_date_short(datestring: string): string {
	return new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: '2-digit',
		year: 'numeric',
	}).format(new Date(datestring))
}

export function format_date(datestring: string): string {
	return new Intl.DateTimeFormat('en-US', {
		weekday: 'short',
		month: 'short',
		day: '2-digit',
		year: 'numeric',
	}).format(new Date(datestring))
}
