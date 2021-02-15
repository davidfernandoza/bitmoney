'use strict'

// Requiere package:
const path = require('path')
const Sequelize = require('sequelize')
const Token = require(path.join(__dirname, '../services/Token'))
const db = require(path.join(__dirname, '../models'))
const token = new Token()
const Response = require(path.join(__dirname, '../services/Response'))
const response = new Response()
const Op = Sequelize.Op

const index = async(req, res, next) => {

	// Verify user token:
	if (!req.headers.http_wlv_identifier) {
		res.status(response.NVTI03.status).json(response.NVTI03.msg)
	}

	const identifierToken = req.headers.http_wlv_identifier

	// Find tokens black list:
	const invalidToken = await db.Invalid_Tokens.find({
		where: {[Op.and]:[{token: identifierToken}]}
	}).then(tokenInvalid => tokenInvalid)

	if (invalidToken != null) {
		res.status(response.NVTI03.status).json(response.NVTI03.msg)
	}
	else {

		let responseToken = await token.decodeToken(identifierToken, false)

		// Refresh token:
		if (responseToken === 401) {
			const newRefreshToken = await token.refreshToken(identifierToken)

			if (newRefreshToken === 403) {
				responseToken = 403
			}
			else {
				responseToken = await token.decodeToken(newRefreshToken, false)
			}
		}
		if (responseToken === 500 ) {
			res.status(response.SEE01.status).json(response.SEE01.msg)
		}
		else if(responseToken === 403){
			res.status(response.NVTI03.status).json(response.NVTI03.msg)
		}
		else{
			req.token =       identifierToken
			req.iduser =      responseToken[0]
			req.roluser =     responseToken[1]
			req.idfirebase =  responseToken[2]
			req.idshop =      responseToken[3] //temporal
			next()
		}
	}
}

module.exports = index
