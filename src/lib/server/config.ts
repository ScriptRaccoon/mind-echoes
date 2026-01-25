export const MINIMAL_PASSWORD_LENGTH = 8

export const COOKIE_LANG = 'lang'

export const COOKIE_DEVICE_TOKEN = 'device_token'

export const COOKIE_OPTIONS = {
	httpOnly: true,
	path: '/',
	maxAge: 60 * 60 * 24 * 7, // 1 week
	sameSite: 'strict',
	secure: true,
} as const

export const DEVICE_COOKIE_OPTIONS = {
	httpOnly: true,
	path: '/',
	maxAge: 60 * 60 * 24 * 365, // 1 year
	sameSite: 'strict',
	secure: true,
} as const
