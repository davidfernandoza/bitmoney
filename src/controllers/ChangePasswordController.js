'use strict'

// Requiere package:
const path = require('path')
const Sequelize = require('sequelize')
const db = require(path.join(__dirname,'../models'))
const Console_Messages = require(path.join(__dirname,'../services/Console_Messages'))
const Response = require(path.join(__dirname, '../services/Response'))
const response = new Response()
const consoleMessages = new Console_Messages()
const Op = Sequelize.Op

const index = async(req, res) => {
	const idSeller = req.body.idSeller
	const idUser = req.iduser
	const token = req.token

	// Existence of the administrator
	db.Administrators.find({
		where : {[Op.and]:[{idadministrator: idUser}, {state: {[Op.ne]:'inactivo'}}]},
		include : [{
			model : db.Shops,
			as : 'Shops'
		}]
	}).then(dataAdmin => {
		if(dataAdmin == null){
			res.status(response.NFI03.status).json(response.NFI03.msg)
		}
		else{

			// Pasword change of seller:
			db.Sellers.update({state : 'definir', password: null}, {
				where: {[Op.and]: [{idseller: idSeller}, {idshop: dataAdmin.Shops[0].idshop}]}
			}).then(dataSeller => {

				if (dataSeller[0] == 1) {
					res.status(200).json({token: token})
				}
				else{
					res.status(response.NFI03.status).json(response.NFI03.msg)
				}
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
