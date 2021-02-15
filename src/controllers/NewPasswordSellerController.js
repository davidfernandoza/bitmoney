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


const index = async(req, res) => {
	const password = req.body.password
	const idSeller = req.body.idSeller

	// Password Encryption and required Token:
	const salt = await bcrypt.genSaltSync(10)
	const hash = await bcrypt.hashSync(password, salt)

	// Update password seller:
	db.Sellers.update({password : hash, state:'activo'}, {
		where: {[Op.and]: [{idseller: idSeller}]},
		returning: true
	}).then(dataSeller => {

		if (dataSeller[0] == 1) res.status(200).json({succes: true})
		else res.status(response.NFI03.status).json(response.NFI03.msg)

	}).catch(err => {

		// Error handler;
		const payloadLog = {
			message: err.message,
			module: __filename,
			line: '23:25',
			type: 'error'
		}
		consoleMessages.create(payloadLog)
		res.status(response.SEE01.status).json(response.SEE01.msg)
	})
}

module.exports = index
