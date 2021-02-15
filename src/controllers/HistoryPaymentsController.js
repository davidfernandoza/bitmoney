'use strict'

// Requiere package:
const path = require('path')
const Sequelize = require('sequelize')
const moment = require('moment')
const db = require(path.join(__dirname,'../models'))
const env = require(path.join(__dirname,'../../config/env'))
const Op = Sequelize.Op

// History payments of shop:
const index = (req, res) => {
	const idshop = req.idshop
	const token = req.token
	let sale = ''

	// Query payments data:
	db.Payments.findAll({
		where : {[Op.and]:[{idshop: idshop}]},
		attributes: ['date','idpayment','total','state','img'],
		order: [['date','DESC']],
		include : [
			{
				model : db.Types_Payments,
				where: {[Op.and]: [{state: {[Op.ne]:false}}]},
				required: false,
				as : 'Types_Payments'
			},
			{
				model : db.Banks_Accounts,
				as : 'Banks_Accounts',
				where: {[Op.and]: [{state: {[Op.ne]:false}}]},
				required: false,
				include : [
					{
						model : db.Banks,
						where: {[Op.and]: [{state: {[Op.ne]:false}}]},
						required: false,
						as : 'Banks'
					},
					{
						model : db.Coins,
						where: {[Op.and]: [{state: {[Op.ne]:false}}]},
						required: false,
						as : 'Coins'
					}
				]
			},
			{
				model : db.Programs,
				where: {[Op.and]: [{state: {[Op.ne]:false}}]},
				required: false,
				as : 'Programs'
			}
		]
	}).then(dataPayments => {
		db.Payments_Pendings.max('reference',{
			where :{[Op.and]:[{state:false},{idshop:idshop}]}
		}).then(max => {
			db.Payments_Pendings.min('reference',{
				where :{[Op.and]:[{state:false},{idshop:idshop}]}
			}).then(min => {

				// Validate max and min of payments pendins:
				if (isNaN(max) || isNaN(min)) sale = null
				else sale = `${min} - ${max}`

				// Format the query to send to the client:
				const reformattedDataPayments = dataPayments.map(item =>{
					const newDataPaymets = {}
					newDataPaymets.date = moment.unix(parseInt(item.dataValues.date)).locale('es').format('dddd MMM D/YYYY')
					newDataPaymets.id = item.dataValues.idpayment
					newDataPaymets.amount = item.dataValues.total
					newDataPaymets.period = item.Programs.title
					newDataPaymets.paymentType = item.Types_Payments.title
					newDataPaymets.sales = sale
					newDataPaymets.accountNumber = item.Banks_Accounts.num
					newDataPaymets.img = item.dataValues.img
					newDataPaymets.Banks = item.Banks_Accounts.Banks.name
					newDataPaymets.whatsapp_soporte = env.soportPhone
					newDataPaymets.coin = item.Banks_Accounts.Coins.alias
					newDataPaymets.state = item.state
					return newDataPaymets
				})
				const payments = (reformattedDataPayments == '' ? null : reformattedDataPayments)
				const payload = {
					payments: payments,
					token:token
				}
				res.status(200).json(payload)
			})
		})
	})
}

module.exports = index
