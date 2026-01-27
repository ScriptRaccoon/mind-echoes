import * as v from 'valibot'

export const username_schema = v.pipe(
	v.string('Username must be a string'),
	v.nonEmpty('Username is required'),
	v.maxLength(100, 'Username must be at most 100 characters long'),
	v.regex(
		/^[A-Za-z0-9_-]+$/,
		'Username may only contain letters, digits, underscores, and dashes',
	),
)

export const email_schema = v.pipe(
	v.string('Email must be a string'),
	v.email('Email must be a valid email'),
)

export const password_schema = v.pipe(
	v.string('Password must be a string'),
	v.nonEmpty('Password is required'),
	v.minLength(8, 'Password must be at least 8 characters long'),
	v.maxLength(100, 'Password must be at most 100 characters long'),
	v.regex(/\d/, 'Password must contain at least one digit'),
	v.regex(/[A-Za-z]/, 'Password must contain at least one letter'),
)

export const device_label_schema = v.pipe(
	v.string('Device label must be a string'),
	v.nonEmpty('Device label required'),
	v.maxLength(100, 'Device label must be at most 100 characters long'),
)

export const title_schema = v.pipe(
	v.string('Title must be a string'),
	v.nonEmpty('Title is required'),
	v.maxLength(100, 'Title must be at most 100 characters long'),
)

export const content_schema = v.pipe(
	v.string('Content must be a string'),
	v.maxLength(10000, 'Content must be at most 10000 characters long'),
)

export const thanks_schema = v.pipe(
	v.string('Thanks must be a string'),
	v.maxLength(1000, 'Thanks must be at most 1000 characters long'),
)
