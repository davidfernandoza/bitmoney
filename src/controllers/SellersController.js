'use strict'

// Requiere package:
const path = require('path')
const Sequelize = require('sequelize')
const Response = require(path.join(__dirname, '../services/Response'))
const Console_Messages = require(path.join(__dirname,'../services/Console_Messages'))
const db = require(path.join(__dirname,'../models'))
const consoleMessages = new Console_Messages()
const response = new Response()
const Op = Sequelize.Op

const index = async(req, res) => {
	const idshop = req.idshop
	const token = req.token
	const payload = {
		token: token
	}

	// Seller list:
	db.Sellers.findAll({
		where:  {[Op.and]:[{idshop: idshop}, {state: {[Op.ne]:'inactivo'}}]},
		attributes: [['idseller','id'], ['num','number'], 'name']
	}).then(dataSellers => {
		if(dataSellers != '')
		{
			payload.sellers = dataSellers
		}
		else
		{
			payload.sellers = null
		}
		res.status(200).json(payload)
	}).catch(err => {

		// Error handler:
		const payloadLog = {
			message: err.message,
			module: __filename,
			line: '20:22',
			type: 'error'
		}
		consoleMessages.create(payloadLog)
		res.status(response.SEE01.status).json(response.SEE01.msg)
	})
}

module.exports = index
