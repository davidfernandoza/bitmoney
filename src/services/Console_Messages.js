'use strict'

// Requiere package:
const path = require('path')
const db = require(path.join(__dirname, '../models'))

class Console_Messages {

	// Create message in console_messages table:
	create(payloadLog) {
		db.Console_Messages.create(payloadLog).then().catch(err=>{

			// Error handler;
			const payloadLog = {
				message: err.message,
				module: __filename,
				line: '10:12',
				type: 'error'
			}
			this.create(payloadLog)
		})
	}
}

module.exports = Console_Messages
