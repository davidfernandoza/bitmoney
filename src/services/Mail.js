'use strict'

// Requiere package:;
const path = require('path')
const nodemailer = require('nodemailer')
const env = require(path.join(__dirname, '../../config/env'))
const Console_Messages = require(path.join(__dirname,'./Console_Messages'))
const consoleMessages = new Console_Messages()

// Send messages to mail:
const Mail = (to, subject, text) => {
	const options = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: env.email,
			pass: env.passMail
		},
		tls: {
			rejectUnauthorized: false
		}
	})

	const payload = {
		from: env.company,
		to: to,
		subject: subject,
		html: text
	}

	// Send of mail.
	options.sendMail(payload, err => {
		if(err) {

			// Error handler:
			const payloadLog = {
				message: err.message, /* TODO: test message */
				module: __filename,
				line:	'27:29',
				type:	'error'
			}
			consoleMessages.create(payloadLog)
			return 500
		}
	})
}

module.exports = Mail


