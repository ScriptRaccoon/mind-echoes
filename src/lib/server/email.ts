import { EMAIL_ADDRESS, EMAIL_PASSWORD, ENABLE_EMAILS } from '$env/static/private'
import { APP_TITLE } from '$lib/client/config'
import nodemailer from 'nodemailer'
import { combine_paragraphs, log_bold } from './utils'

type Email = {
	to: string
	subject: string
	text: string
}

const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 587,
	secure: false,
	auth: {
		user: EMAIL_ADDRESS,
		pass: EMAIL_PASSWORD,
	},
})

async function send_email(email: Email) {
	if (ENABLE_EMAILS === 'true') {
		await transporter.sendMail({ from: EMAIL_ADDRESS, ...email })
	} else {
		log_email(email)
	}
}

function log_email(email: Email) {
	console.info('--- Email ---')
	log_bold('\nRecipient')
	console.info(email.to)
	log_bold('\nSubject:')
	console.info(email.subject)
	log_bold('\nText:')
	console.info(email.text)
}

export async function send_registration_email(
	username: string,
	to: string,
	code: number,
) {
	const subject = `${APP_TITLE} - Registration Code`

	const text = combine_paragraphs([
		`Hi ${username},`,
		`Thank you for registering with ${APP_TITLE}.`,
		'Please use the following code to complete your registration:',
		String(code),
		'This code is valid for 10 minutes.',
	])

	await send_email({ to, subject, text })
}

export async function send_device_verification_email(
	username: string,
	to: string,
	device_label: string,
	link: string,
) {
	const subject = `${APP_TITLE} - Verify your new device`

	const text = combine_paragraphs([
		`Hi ${username},`,
		`A login was detected from a new device: ${device_label}`,
		'Please verify this device by following the link below:',
		link,
		'If you do not recognize this login, your account may be compromised. Please log in and change your password.',
	])

	await send_email({ to, subject, text })
}

export async function send_email_change_email(
	username: string,
	to: string,
	link: string,
) {
	const subject = `${APP_TITLE} - Verify your new email address`

	const text = combine_paragraphs([
		`Hi ${username},`,
		'You requested to change your email address.',
		'Please confirm this change by following the link below:',
		link,
		'This link is valid for 10 minutes.',
	])

	await send_email({ to, subject, text })
}

export async function send_email_inform_changed_email(
	username: string,
	to: string,
	new_email: string,
) {
	const subject = `${APP_TITLE} - Your email address has been updated`

	const text = combine_paragraphs([
		`Hi ${username},`,
		`Your email address has been changed to ${new_email}.`,
		'If you did not make this change, please secure your account immediately.',
	])

	await send_email({ to, subject, text })
}

export async function send_password_reset_email(
	username: string,
	to: string,
	link: string,
) {
	const subject = `${APP_TITLE} - Password reset`

	const text = combine_paragraphs([
		`Hi ${username},`,
		`Use the link below to reset your password:`,
		link,
		'This link is valid for 10 minutes.',
	])

	await send_email({ to, subject, text })
}
