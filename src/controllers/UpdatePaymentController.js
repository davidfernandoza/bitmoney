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

const index = (req, res) => {
	const payment = req.body.idPayment
	const idshop = req.idshop
	const token = req.token

	// Programs
	db.Programs.find({
		where : {[Op.and]:[{idprogram: payment}, {state: true}]}
	}).then(dataProgram => {
		if(dataProgram == null){
			res.status(response.NFI04.status).json(response.NFI04.msg)
		}
		else{

			// Shop
			db.Shops.update({idprogram : payment}, {
				where: {[Op.and]: [{idshop: idshop}]}
			}).then(() => {
				res.status(200).json({token:token})
			}).catch(err => {

				// Error handler:
				const payloadLog = {
					message: err.message,
					module: __filename,
					line: '31:33',
					type: 'error'
				}
				consoleMessages.create(payloadLog)
				res.status(response.SEE01.status).json(response.SEE01.msg)
			})
		}
	})
}

module.exports = index
