'use strict'

// Requiere package:
const path = require('path')
const Sequelize = require('sequelize')
const Console_Messages = require(path.join(__dirname,'../services/Console_Messages'))
const Response = require(path.join(__dirname, '../services/Response'))
const db = require(path.join(__dirname, '../models'))
const consoleMessages = new Console_Messages()
const response = new Response()
const Op = Sequelize.Op

const index = async(req, res) => {
	const	token = req.token
	const idSeller = req.body.idSeller

	// Seller disable:
	db.Sellers.update({state:'inactivo'},{
		where:  {[Op.and]:[{idseller: idSeller}, {state: {[Op.ne]:'inactivo'}}]}
	}).then(dataSellers => {

		if(dataSellers[0] === 1)
		{
			res.status(200).json({token:token})
		}
		else
		{
			res.status(response.NFI04.status).json(response.NFI04.msg)
		}
	}).catch(err => {

		// Error handler;
		const payloadLog = {
			message: err.message,
			module: __filename,
			line: '16:18',
			type: 'error'
		}
		consoleMessages.create(payloadLog)
		res.status(response.SEE01.status).json(response.SEE01.msg)
	})
}

module.exports = index
