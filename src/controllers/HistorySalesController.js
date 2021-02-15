'use strict'

// Requiere package:
const path = require('path')
const Sequelize = require('sequelize')
const moment = require('moment')
const db = require(path.join(__dirname,'../models'))
const Op = Sequelize.Op

// History sales of shop:
const index = async(req, res) => {
	const idshop = req.idshop
	const token = req.token
	const payload = {
		token:token
	}

	// Query sales and coins:
	db.Sales.findAll({
		where : {[Op.and]:[{idshop: idshop}]},
		attributes: [['created_at','date'],'value','state','img'],
		include : [{
			model : db.Coins,
			as : 'Coins'
		}],
	}).then(dataSales => {
		if (dataSales == '') {
			payload.sales = null
			res.status(200).json(payload)
		}
		else{

			// Format the query to send to the client:
			const reformattedDataSales = dataSales.map(item =>{
				const newDataSales = {}
				newDataSales.date = moment(item.dataValues.date).locale('es').format('ddd MMM D YYYY')
				newDataSales.amount = item.dataValues.value
				newDataSales.state = item.dataValues.state
				newDataSales.img = item.dataValues.img
				newDataSales.coin = item.Coins.alias
				return newDataSales
			})
			payload.sales = reformattedDataSales,
			res.status(200).json(payload)
		}
	})
}

module.exports = index
