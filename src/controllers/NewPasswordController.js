'use strict'

// Requiere package:
const path = require('path')
const bcrypt = require('bcrypt')
const Sequelize = require('sequelize')
const Response = require(path.join(__dirname, '../services/Response'))
const Console_Messages = require(path.join(__dirname,'../services/Console_Messages'))
const db = require(path.join(__dirname,'../models'))
const consoleMessages = new Console_Messages()
const response = new Response()
const Op = Sequelize.Op

// Change password administrator:
const index = (req, res) => {
	const password = req.body.password
	const idshop = req.body.idStore

	// Shop validation:
	db.Shops.find({
		where: {[Op.and]: [{idshop: idshop}, {state: {[Op.ne]:false}}]}
	}).then(dataShops => {
		if(dataShops == null)
		{
			res.status(response.NFI03.status).json(response.NFI03.msg)
		}
		else
		{

			// Password Encryption:
			const salt = bcrypt.genSaltSync(10)
			const hash = bcrypt.hashSync(password, salt)

			db.Administrators.update({password : hash}, {
				where: {[Op.and]: [{idadministrator: dataShops.idadministrator}]}
			}).then(dataAdmin => {

				if (dataAdmin[0] == 1) res.status(200).json({succes: true})
				else res.status(403).json({succes: false})

			}).catch(err => {

				// Error handler;
				const payloadLog = {
					message: err.message,
					module: __filename,
					line: '33:35',
					type: 'error'
				}
				consoleMessages.create(payloadLog)
				res.status(response.SEE01.status).json(response.SEE01.msg)
			})
		}
	})
}

module.exports = index
