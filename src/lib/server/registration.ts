export const COOKIE_REGISTRATION = 'registration_id'

export const COOKIE_REGISTRATION_OPTIONS = {
	path: '/',
	sameSite: 'strict',
	httpOnly: true,
	secure: true,
	maxAge: 60 * 60, // 1 hour
} as const
