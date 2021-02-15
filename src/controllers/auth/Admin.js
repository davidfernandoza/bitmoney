'use strict'

// Requiere package:
const path = require('path')
const Sequelize = require('sequelize')
const db = require(path.join(__dirname, '../../models/'))
const Query = require(path.join(__dirname, '../../services/Queris'))
const Token = require(path.join(__dirname, '../../services/Token'))
const fiterDelete = require(path.join(__dirname, './FilterDelete'))
const Console_Messages = require(path.join(__dirname,'../../services/Console_Messages'))
const token = new Token()
const consoleMessages = new Console_Messages()
const Op = Sequelize.Op

const index = async(username, firebaseToken, data, emailConfirm) => {

	// Sequelize Transaction:
	const login = await db.sequelize.transaction( t => {

		return db.Sessions.find({
			where: { [Op.and]:[{firebase_token: firebaseToken}]},
			transaction: t
		}).then(fireTokenData => {

			return db.sequelize.query(Query.DataAdmin, {
				bind: {idshop: null, idadmin: data.idadministrator, state : 'inactivo'},
				type: db.sequelize.QueryTypes.SELECT,
				transaction: t
			}).then(dataQuery => {

				if(dataQuery == ''){
					throw new Error ('Query vacío.')
				}

				return [dataQuery[0], fireTokenData]
			})
		}).then(newData => {

			const dataToken = {
				idadministrator: newData[0].iduser
			}

			// Delete code for verify email
			if (emailConfirm == true){
				db.Codes.destroy({
					where: {idadministrator: newData[0].iduser},
					transaction:t
				})
			}

			//  Update Firebase Token
			if (newData[1] != null) {

				dataToken.idseller = null

				return db.Sessions.update(dataToken, {
					where: { [Op.and]:[{firebase_token: firebaseToken}]},
					returning: true,
					transaction: t
				}).then(async fireToken => {

					const tokenUser = await token.createToken(newData[0].iduser, 'admin', fireToken[1][0].idsession, newData[0].id)

					if (tokenUser === 500) {
						throw new Error ('Token de seguridad vacío.')
					}
					else {
						return [newData[0], tokenUser]
					}
				})
			}

			// Create Firebase Token
			else {

				dataToken.firebase_token = firebaseToken
				return db.Sessions.create(dataToken, {
					transaction:  t
				}).then(async fireToken => {

					const tokenUser = await token.createToken(newData[0].iduser, 'admin', fireToken.idsession, newData[0].id)

					if (tokenUser === 500) {
						throw new Error ('Token de seguridad vacío.')
					}
					else {
						return [newData[0], tokenUser]
					}
				})
			}
		})
	}).then(async dataResult => {

		// Filter and delete unusable data for the request:
		const result = await fiterDelete(dataResult, username)
		result.userType = 'establecimiento'
		return result
	}).catch(err => {

		// Error handler:
		const payloadLog = {
			message: err.message,
			module: __filename,
			line:	'17:19',
			type:	'error'
		}
		consoleMessages.create(payloadLog)
		return 500
	})
	return login
}

module.exports = index
