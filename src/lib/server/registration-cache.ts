export const REGISTER_COOKIE_NAME = 'register_session_id'

type ResitrationState = {
	expires_at: number
	username: string
	email: string
	user_id?: number
	device_id?: string
}

export const registration_cache: Map<string, ResitrationState> = new Map()
