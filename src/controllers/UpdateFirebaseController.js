'use strict'

// Requiere package:
const path = require('path')
const Sequelize = require('sequelize')
const Response = require(path.join(__dirname, '../services/Response'))
const Console_Messages = require(path.join(__dirname,'../services/Console_Messages'))
const Token = require(path.join(__dirname,'../services/Token'))
const db = require(path.join(__dirname,'../models'))
const consoleMessages = new Console_Messages()
const response = new Response()
const token = new Token()
const Op = Sequelize.Op

const index = (req, res) => {

	const newFirebaseToken = req.body.tokenFirebase
	const iduser = req.iduser
	const rol = req.roluser
	const shop = req.idshop //idshop
	const oldToken = req.token

	db.sequelize.transaction(t => {

		// Firebase Token
		return db.Sessions.find({
			where: { [Op.and]:[{firebase_token: newFirebaseToken}]},
			transaction:t
		}).then(fireTokenData => fireTokenData).then( async dataTokens => {

			// Validation of rol-user
			const dataToken = {}
			let fireToken = ''
			if (rol == 'admin') {
				dataToken.idadministrator = iduser
			}
			else{
				dataToken.idseller = iduser
			}

			//  Update Firebase Token
			if (dataTokens != null) {
				fireToken = await db.Sessions.update(dataToken, {
					where: { [Op.and]:[{firebase_token: newFirebaseToken}]},
					returning: true,
					transaction: t
				}).then(fireToken => fireToken[1][0])
			}

			// Create Firebase Token
			else {
				dataToken.firebase_token = newFirebaseToken
				fireToken = await db.Sessions.create(dataToken, {
					transaction: t
				}).then(fireToken => fireToken)
			}

			// Create Token:
			const tokenUser = await token.createToken(iduser, rol, fireToken.idsession, shop)

			if (tokenUser == 500) {
				throw new Error ('Token de seguridad vacio.')
			}
			else if (tokenUser == 403) {
				throw new Error ('Token de seguridad invalido.')
			}
			else {
				return tokenUser
			}
		}).then(tokenUse => {
			return db.Invalid_Tokens.create({token: oldToken},{
				transaction: t
			}).then(() => tokenUse)
		})
	}).then(newToken => {
		res.status(200).json({token: newToken})
	}).catch(err => {


		if (err.message == 'Token de seguridad invalido.') {
			res.status(response.NVTI03.status).json(response.NVTI03.msg)
		}
		else{

			// Error handler:
			const payloadLog = {
				message: err.message,
				module: __filename,
				line: '22:24',
				type: 'error'
			}
			consoleMessages.create(payloadLog)
			res.status(response.SEE01.status).json(response.SEE01.msg)
		}
	})
}

module.exports = index
