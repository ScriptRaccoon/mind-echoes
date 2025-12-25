import { DB_AUTH_TOKEN, DB_URL } from '$env/static/private'
import { createClient, type LibsqlError } from '@libsql/client'

const db = createClient({
	authToken: DB_AUTH_TOKEN,
	url: DB_URL,
})

async function adjust_database() {
	try {
		await db.execute('PRAGMA foreign_keys = ON')
	} catch (err) {
		const libsql_error = err as LibsqlError
		console.error(libsql_error.message)
	}
}

adjust_database()

export async function query<T = any>(
	sql: string,
	args?: any[],
): Promise<
	| {
			rows: T[]
			success: true
			err: null
	  }
	| {
			rows: null
			success: false
			err: LibsqlError
	  }
> {
	try {
		const res = args ? await db.execute(sql, args) : await db.execute(sql)
		return { rows: res.rows as T[], success: true, err: null }
	} catch (err) {
		const libsql_error = err as LibsqlError
		console.error(libsql_error)
		return { rows: null, err: libsql_error, success: false }
	}
}
