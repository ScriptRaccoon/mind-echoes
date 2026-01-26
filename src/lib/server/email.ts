import { EMAIL_ADDRESS, EMAIL_PASSWORD } from '$env/static/private'
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
	await transporter.sendMail({ from: EMAIL_ADDRESS, ...options })
}

export async function send_verification_email(
	username: string,
	to: string,
	link: string,
) {
	const subject = 'Verify your email address'
	const text =
		`Hi ${username},\n\n` +
		'Thank you for registering for the diary application.\n\n' +
		'Please follow this link to verify your email address:\n\n' +
		link +
		'\n\n' +
		'This link is only valid for one hour.'

	await send_email({ to, subject, text })
}
