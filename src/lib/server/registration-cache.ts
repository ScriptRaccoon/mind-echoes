export const REGISTER_COOKIE_NAME = 'register_session_id'

export const registration_cache: Map<
	string,
	{
		expires_at: number
		username: string
		email: string
		user_id?: number
	}
> = new Map()
