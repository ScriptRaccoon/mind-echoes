import { DB_AUTH_TOKEN, DB_URL } from '$env/static/private'
import { createClient, type LibsqlError } from '@libsql/client'
import type { Arrayed } from './utils'

export const db = createClient({
	authToken: DB_AUTH_TOKEN,
	url: DB_URL,
})

export async function initialize_db() {
	try {
		await db.execute('PRAGMA foreign_keys = ON;')
	} catch (err) {
		console.error((err as LibsqlError).message)
	}
}

export function is_constraint_error(err: LibsqlError): boolean {
	return err.code.startsWith('SQLITE_CONSTRAINT')
}

export async function query<T = any>(sql: string, args?: any[]) {
	try {
		const res = args ? await db.execute(sql, args) : await db.execute(sql)
		return { rows: res.rows as T[], err: null, rows_affected: res.rowsAffected }
	} catch (err) {
		const libsql_error = err as LibsqlError
		console.error(libsql_error)
		return { rows: null, err: libsql_error, rows_affected: 0 }
	}
}

export async function batched_query<T extends any[]>(
	input: { sql: string; args: any[] }[],
	mode: 'read' | 'write',
) {
	try {
		const res_list = await db.batch(input, mode)
		return { rows_list: res_list.map((res) => res.rows) as Arrayed<T>, err: null }
	} catch (err) {
		const libsql_error = err as LibsqlError
		console.error(libsql_error)
		return { rows_list: null, err: libsql_error }
	}
}
