import { JWT_SECRET } from '$env/static/private'
import { redirect, type Handle } from '@sveltejs/kit'
import jwt from 'jsonwebtoken'

export const handle: Handle = async ({ event, resolve }) => {
	const requires_auth = event.url.pathname.startsWith('/app')
	if (!requires_auth) return await resolve(event)

	try {
		const token = event.cookies.get('jwt')
		if (!token) throw new Error('No token')
		jwt.verify(token, JWT_SECRET)
	} catch (_) {
		return redirect(307, '/login')
	}

	return await resolve(event)
}
