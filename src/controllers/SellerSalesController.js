'use strict'

// Requiere package:
const path = require('path')
const moment = require('moment')
const Sequelize = require('sequelize')
const Response = require(path.join(__dirname, '../services/Response'))
const db = require(path.join(__dirname,'../models'))
const response = new Response()
const Op = Sequelize.Op

const index = async(req, res) => {
	const idseller = req.body.idSeller
	const token = req.token

	// Get data seller:
	const sellerData = await db.Sellers.find({
		where:{[Op.and]:[{idseller:idseller}, {state: {[Op.ne]:'inactivo'}}]},
		attributes: ['name','idseller','num']
	}).then(newDataseller => newDataseller)

	if(sellerData == null){
		res.status(response.NFI04.status).json(response.NFI04.msg)
	}
	else{

		// Get sales by seller:
		db.Sales.findAll({
			where : {[Op.and]:[{idseller: idseller}]},
			attributes: [['created_at','date'],'value','state','img'],
			include : [{
				model : db.Coins,
				as : 'Coins'
			}]
		}).then(dataSales => {

			const payload ={
				name:sellerData.name,
				id:sellerData.idseller,
				number:sellerData.num,
				token:token
			}

			if (dataSales == '') {
				payload.sellers = null
			}
			else{

				// Refactored object:
				const sellers = dataSales.map(item =>{
					const sellerData = {}
					sellerData.date = 	moment(item.dataValues.date).locale('es').format('dddd MMM D/YYYY'),
					sellerData.amount = item.dataValues.value
					sellerData.state = 	item.dataValues.state
					sellerData.img = 		item.dataValues.img
					sellerData.coin = 	item.Coins.alias
					return sellerData
				})
				payload.sellers = sellers
			}
			res.status(200).json(payload)
		})
	}
}

module.exports = index
