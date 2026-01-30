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

export function shorten_date(datestring: string): string {
	return datestring.substring(0, 10)
}
