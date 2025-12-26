import type { Lang } from '$lib/translations/main'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async (event) => {
	const lang = event.cookies.get('lang') as Lang
	return { lang }
}
