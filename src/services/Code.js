'use strict'

// Requiere package:
const path = require('path')
const env = require(path.join(__dirname,'../../config/env'))
const Console_Messages = require(path.join(__dirname,'/Console_Messages'))
const consoleMessages = new Console_Messages()

// Function for randon code of characters:
const verificationCode = () => {
	const code = new Promise((resolve, reject)=>{
		try{
			let randomCode = ''
			const characters = new Array('A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','1','2','3','4','5','6','7','8','9','0')

			for (let i = 0; i < env.numberCode; i++) {
				randomCode += characters[Math.floor(Math.random() * characters.length)]
			}

			// Character cutter:
			randomCode = randomCode.substring(0, env.numberCode)
			resolve(randomCode)
		}
		catch(err){

			// Error handler:
			const payloadLog = {
				message: err.message,
				module: __filename,
				line:	'12:14',
				type:	'error'
			}
			consoleMessages.create(payloadLog)
			reject(500)
		}
	})
	return code
}

module.exports = verificationCode


