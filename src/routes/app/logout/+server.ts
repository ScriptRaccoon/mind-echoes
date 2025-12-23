import { redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = (event) => {
	event.cookies.delete('jwt', { path: '/' })
	event.cookies.delete('username', { path: '/' })
	return redirect(307, '/login?from=logout')
}
