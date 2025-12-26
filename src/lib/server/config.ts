export const MINIMAL_PASSWORD_LENGTH = 8

export const COOKIE_OPTIONS = {
	httpOnly: true,
	path: '/',
	maxAge: 60 * 60 * 24 * 7,
	sameSite: 'strict',
	secure: true,
} as const
