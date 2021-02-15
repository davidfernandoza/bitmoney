'use strict'

// Requiere package:
const path = require('path')
const Sequelize = require('sequelize')
const db = require(path.join(__dirname, '../models'))
const Response = require(path.join(__dirname, '../services/Response'))
const response = new Response()
const Op = Sequelize.Op

const index = (req, res) => {
	const token = req.token
	const idSale = req.body.idTransaction

	// Cancel sale:
	db.Sales.update({state: 'cancelado'},{
		where: {[Op.and]:[{idsale: idSale}]}
	}).then(async sale => {
		if (sale[0] === 1) {
			res.status(200).json({token:token})
		}
		else{
			res.status(response.NFI04.status).json(response.NFI04.msg)
		}
	})
}

module.exports = index
