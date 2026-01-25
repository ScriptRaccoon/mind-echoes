// See https://svelte.dev/docs/kit/types#app.d.ts

import type { User } from '$lib/server/auth'

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: User
		}
		interface PageData {
			user?: User
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {}
