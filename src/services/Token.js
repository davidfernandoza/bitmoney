'use strict'

// Requiere package:
const path = require('path')
const jwt = require('jwt-simple')
const moment = require('moment')
const Sequelize = require('sequelize')
const env = require(path.join(__dirname, '../../config/env'))
const db = require(path.join(__dirname, '../models/'))
const Console_Messages = require(path.join(__dirname,'/Console_Messages'))
const consoleMessages = new Console_Messages()
const Op = Sequelize.Op


class Token {

	//  Function for make tokens:
	createToken (idUser, rolUser, idfirebase, idShop) {

		// Inputs validate:
		let errReq = 0
		if (idUser == null || rolUser == null || idfirebase == null || idShop == null) {
			errReq += 1
		}
		if (idUser == '' || rolUser == '' || idfirebase == '' || idShop == '') {
			errReq += 1
		}
		if (idUser == undefined || rolUser == undefined || idfirebase == undefined || idShop == undefined) {
			errReq += 1
		}

		if (errReq > 0) {
			return 403
		}
		else {

			const payload = {
				sub:        idUser,
				rol:        rolUser,
				firebase:   idfirebase,
				shop:       idShop,     //TODO: shop field is temporal
				iat: moment().unix(),
				exp: moment().add(1, 'minutes').unix()
				// moment().add(1, 'days').unix()
			}
			return jwt.encode(payload, env.key)
		}
	}

	// Function for decode token:
	decodeToken (token, status) {
		try {
			const payload = jwt.decode(token, env.key, status)


			return[
				payload.sub,
				payload.rol,
				payload.firebase,
				payload.shop      //TODO: temporal idShop
			]
		} catch (err) {
			if (err.message == 'Token expired') {
				return 401
			}
			return 403
		}

	}

	// Function for refresh expired tokens:
	async refreshToken (Token) {

		const payload = await this.decodeToken(Token, true)
		let token = ''

		// Validate user rol
		if (payload[1] == 'admin' ) {

			token = db.Shops.find({
				where:{[Op.and]:[{idadministrator: payload[0]}, {idshop: payload[3]}]} //TODO: temporal idShop
			}).then(async dataShop => {

				if (dataShop != null) {
					const newToken = await this.createToken(payload[0], payload[1], payload[2], payload[3]) //TODO: temporal idShop
					return newToken
				}
				else{
					return 403
				}
			}).catch(err => {

				// Error handler;
				const payloadLog = {
					message: err.message,
					module: __filename,
					line: '93:95',
					type: 'error'
				}
				consoleMessages.create(payloadLog)
				return 500
			})
		}
		else{

			token = db.Sellers.find({
				where:{[Op.and]:[{idseller: payload[0]}, {idshop: payload[3]}]} //TODO: temporal idShop
			}).then(async dataUser => {

				if (dataUser != null) {
					const newToken = await this.createToken(payload[0], payload[1], payload[2], payload[3]) //TODO: temporal idShop
					return newToken
				}
				else{
					return 403
				}
			}).catch(err => {

				// Error handler;
				const payloadLog = {
					message: err.message,
					module: __filename,
					line: '124:127',
					type: 'error'
				}
				consoleMessages.create(payloadLog)
				return 500
			})
		}
		return token
	}
}

module.exports = Token
