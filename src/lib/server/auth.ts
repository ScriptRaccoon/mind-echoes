import type { RequestEvent } from '@sveltejs/kit'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '$env/static/private'

const COOKIE_JWT = 'auth_token'

const COOKIE_JWT_OPTIONS = {
	httpOnly: true,
	path: '/',
	maxAge: 60 * 60 * 24 * 7, // 1 week
	sameSite: 'strict',
	secure: true,
} as const

export type User = {
	id: number
	email: string
	username: string
}

export function authenticate(event: RequestEvent) {
	const token = event.cookies.get(COOKIE_JWT)
	if (!token) return
	try {
		const { id, email, username } = jwt.verify(token, JWT_SECRET) as User
		event.locals.user = { id, email, username }
	} catch (_) {}
}

export function set_auth_cookie(event: RequestEvent, user: User): void {
	const token = jwt.sign(user, JWT_SECRET, { expiresIn: '1w' })
	event.cookies.set(COOKIE_JWT, token, COOKIE_JWT_OPTIONS)
}

export function delete_auth_cookie(event: RequestEvent): void {
	event.cookies.delete(COOKIE_JWT, { path: '/' })
}
