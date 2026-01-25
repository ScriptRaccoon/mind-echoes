import { get_language } from '$lib/translations/request'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async (event) => {
	const user = event.locals.user
	const lang = get_language(event.cookies)
	return { lang, user }
}
