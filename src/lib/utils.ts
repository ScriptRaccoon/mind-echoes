import type { RequestEvent } from '@sveltejs/kit'
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

export function get_os_and_browser(event: RequestEvent): string {
	const user_agent = event.request.headers.get('user-agent')

	if (!user_agent) return ''

	let os = ''
	if (user_agent.includes('Mac OS X')) os = 'macOS'
	else if (user_agent.includes('Windows NT')) os = 'Windows'
	else if (user_agent.includes('Android')) os = 'Android'
	else if (user_agent.includes('iPhone') || user_agent.includes('iPad')) os = 'iOS'
	else if (user_agent.includes('Linux')) os = 'Linux'

	let browser = ''
	if (user_agent.includes('Chrome') && !user_agent.includes('Edg/')) browser = 'Chrome'
	else if (user_agent.includes('Edg/')) browser = 'Edge'
	else if (user_agent.includes('Firefox')) browser = 'Firefox'
	else if (user_agent.includes('Safari') && !user_agent.includes('Chrome'))
		browser = 'Safari'
	else if (user_agent.includes('OPR') || user_agent.includes('Opera')) browser = 'Opera'

	if (os && browser) return `${os} / ${browser}`
	if (os) return os
	if (browser) return browser

	return ''
}
