import { EMAIL_ADDRESS, EMAIL_PASSWORD, ENABLE_EMAILS } from '$env/static/private'
import { APP_TITLE } from '$lib/config'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 587,
	secure: false,
	auth: {
		user: EMAIL_ADDRESS,
		pass: EMAIL_PASSWORD,
	},
})

async function send_email(options: { to: string; subject: string; text: string }) {
	if (ENABLE_EMAILS === 'true') {
		await transporter.sendMail({ from: EMAIL_ADDRESS, ...options })
	} else {
		console.info('--- Email ---')
		console.info('\nRecipient:')
		console.info(options.to)
		console.info('\nSubject:')
		console.info(options.subject)
		console.info('\nText:')
		console.info(options.text)
		console.info('\n---')
	}
}

export async function send_registration_email(
	username: string,
	to: string,
	code: number,
) {
	const subject = `${APP_TITLE} - Registration Code`
	const text =
		`Hi ${username},\n\n` +
		`Thank you for registering for ${APP_TITLE}.\n\n` +
		'Please use following code to complete the registration.\n\n' +
		code +
		'\n\n' +
		'This code is only valid for 10 minutes.'

	await send_email({ to, subject, text })
}

export async function send_device_verification_email(
	username: string,
	device_label: string,
	to: string,
	link: string,
) {
	const subject = `${APP_TITLE} - Verify your new device`
	const text =
		`Hi ${username},\n\n` +
		`There has been a login from a new device: ${device_label}\n\n` +
		'Please follow this link to verify that device:\n\n' +
		link +
		'\n\n' +
		'This link is only valid for one day.'

	await send_email({ to, subject, text })
}

export async function send_email_change_email(
	username: string,
	to: string,
	code: number,
) {
	const subject = `${APP_TITLE} - Verify your new email address`
	const text =
		`Hi ${username},\n\n` +
		`You have requested to change your email address.\n\n` +
		'Please use the following code to confirm the change:\n\n' +
		code +
		'\n\n' +
		'This code is only valid for 10 minutes.'

	await send_email({ to, subject, text })
}

export async function send_email_inform_changed_email(
	username: string,
	to: string,
	new_email: string,
) {
	const subject = `${APP_TITLE} - Your email address has been updated`
	const text = `Hi ${username},\n\nYour email address has been changed to ${new_email}.`

	await send_email({ to, subject, text })
}

export async function send_password_reset_email(
	username: string,
	to: string,
	link: string,
) {
	const subject = `${APP_TITLE} - Password reset`
	const text =
		`Hi ${username},\n\n` +
		`Use the following link to reset your password:\n\n` +
		link +
		'\n\n' +
		'This link is only valid for 10 minutes.'

	await send_email({ to, subject, text })
}
