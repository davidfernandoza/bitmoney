'use strict'

// Requiere package:
const path = require('path')
const twilio = require('twilio')
const env = require(path.join(__dirname, '../../config/env'))
const Console_Messages = require(path.join(__dirname,'/Console_Messages'))
const consoleMessages = new Console_Messages()
const client = new twilio(env.twilioId, env.twilioToken)

class SMS {

	// Messeges:
	// constructor(resultAvailable, criptoName, accumulateValue, limitValue) {
	// 	this.smsPayloadAccumulate = `AVISO! Se necesita aumentar la base en BITTREX, ya que el monto actual disponible es de ${resultAvailable} ${criptoName} y se requiere un mínimo de ${(Math.ceil((accumulateValue + limitValue ) + 'e+8') + 'e-8')} ${criptoName}. NOTA: Este valor mínimo es la sumatoria de la base preestablecida con lo que se acúmulo de transacciones sin cambiar, no se tiene en cuenta la comisión del exchange en este valor.`

	// 	this.smsPayload = `AVISO! Se necesita aumentar la base en BITTREX, ya que el monto actual disponible es de ${resultAvailable} ${criptoName} y se requiere un minimo de ${limitValue} ${criptoName}. NOTA: no se tiene en cuenta la comisión del exchange en este valor.`
	// }

	// Send of SMS and promise for respons:
	send(payload){
		client.messages.create(payload).then(message => {

			// Alert handler:
			const payloadLog = {
				message: message.sid,
				module: __filename,
				line:	'13:15',
				type:	'alerta'
			}
			consoleMessages.create(payloadLog)
		}).catch(err => {

			// Error handler:
			const payloadLog = {
				message: err.message,
				module: __filename,
				line:	'13:15',
				type:	'error'
			}
			consoleMessages.create(payloadLog)
		})
	}
}

module.exports = SMS

