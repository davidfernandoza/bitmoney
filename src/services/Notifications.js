'use strict'

// Requiere package:
const path = require('path')
const firebase = require('firebase-admin')
const serviceAccount = require(path.join(__dirname, '../../config/firebase/bitmoney-702e6-firebase-adminsdk-io559-56eb3d1165.json'))
const env = require(path.join(__dirname, '../../config/env'))
const Console_Messages = require(path.join(__dirname,'/Console_Messages'))
const consoleMessages = new Console_Messages()

// Connection with firebase:
firebase.initializeApp({
	credential: firebase.credential.cert(serviceAccount),
	databaseURL: env.urlFirebase
})

const index = (fireToken, payload) => {
	const options = {
		priority: 'high',
		timeToLive: 60 * 60 * 24
	}

	// Send message to aplication through token:
	firebase.messaging().sendToDevice(fireToken, payload, options).then(response => {
		if(response.results[0].error != undefined){
			const payloadLog = {
				message: response.results[0].error,
				module: __filename,
				line:	'23:25',
				type:	'error'
			}
			consoleMessages.create(payloadLog)
		}

	}).catch(err => {

		// Error handler:
		const payloadLog = {
			message: err.message,
			module: __filename,
			line:	'23:25',
			type:	'error'
		}
		consoleMessages.create(payloadLog)
	})
}

module.exports = index
