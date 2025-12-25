export type Entry = {
	id: number
	date: string
	title: string
	content: string
	thanks: string
}

export type Entry_DB = Pick<Entry, 'id' | 'date'> & {
	title_enc: string
	content_enc: string
	thanks_enc: string
}

export type Entry_Summary = Pick<Entry, 'id' | 'date' | 'title'>

export type Entry_DB_Summary = Pick<Entry_DB, 'id' | 'date' | 'title_enc'>
