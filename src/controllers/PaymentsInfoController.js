'use strict'

// Requiere package:
const path = require('path')
const Sequelize = require('sequelize')
const Response = require(path.join(__dirname, '../services/Response'))
const db = require(path.join(__dirname,'../models'))
const response = new Response()
const Op = Sequelize.Op

const index = (req, res) => {
	const idshop = req.idshop
	const token = req.token
	const itemectQuery = {
		model : db.Banks_Accounts,
		as : 'Banks_Accounts',
		where: {[Op.and]: [{state: {[Op.ne]:false}}]},
		attributes: ['num'],
		required: false,
		include : [
			{
				model : db.Banks,
				where: {[Op.and]: [{state: {[Op.ne]:false}}]},
				attributes: ['name'],
				required: false,
				as : 'Banks'
			},
			{
				model : db.Types_Accounts,
				where: {[Op.and]: [{state: {[Op.ne]:false}}]},
				attributes: ['title'],
				required: false,
				as : 'Types_Accounts'
			},
			{
				model : db.Coins,
				where: {[Op.and]: [{state: {[Op.ne]:false}}]},
				attributes: ['idcoin','alias'],
				required: false,
				as : 'Coins' ,
				include: [
					{
						model : db.Contents,
						where: {[Op.and]: [{state: true}]},
						attributes: ['content' ,'percent', 'profit', 'deduction'],
						required: false,
						as : 'Contents' ,
						include: [
							{
								model : db.Programs,
								where: {[Op.and]: [{state: {[Op.ne]:false}}]},
								attributes: ['title', 'idprogram'],
								required: false,
								as : 'Programs'
							}
						]
					}
				]
			}
		]
	}

	// Info of total to payment
	db.Shops.findAll({
		where : {[Op.and]:[{idshop: idshop}]},
		attributes: ['idbankaccount', 'idprogram'],
		include : [itemectQuery,
			{
				model : db.Payments,
				limit:1,
				order: [
					[Sequelize.fn('max', Sequelize.col('date'))]
				],
				group: 'idpayment',
				required: false,
				as : 'Payments'
			},
			{
				model: db.Cities,
				as: 'Cities'
			}
		]
	}).then(payments => {
		if (payments == '') {
			res.status(response.NFI03.status).json(response.NFI03.msg)
		}
		else{


			// Paytmens pendings list
			db.Payments.findAll({
				where : {[Op.and]:[{idshop: idshop}, {state: 'activo'}]},
				attributes: ['idpayment','amount','total', 'idprogram'],
				include : [itemectQuery]
			}).then(async paymentsPendings => {

				// Sales info. (Payments pendings)
				const salesInfo = await db.Payments_Pendings.findAndCountAll({
					where : {[Op.and]:[{idshop: idshop}]},
				}).then(paymentsPendingsCount => {
					return db.Payments_Pendings.sum('amount', {
						where: {[Op.and]:[{state: true},{idshop:idshop}]}
					}).then(paymentsPendingsSum => {
						return db.Payments_Pendings.min('reference',{
							where :{[Op.and]:[{state:true},{idshop:idshop}]}
						}).then(paymentsPendingsMin => {
							return db.Payments_Pendings.max('reference',{
								where :{[Op.and]:[{state:true},{idshop:idshop}]}
							}).then(paymentsPendingsLast => {
								return {
									count: paymentsPendingsCount.count,
									sum: paymentsPendingsSum == null ? 0 : paymentsPendingsSum,
									first: Number.isNaN(paymentsPendingsMin) ? null : paymentsPendingsMin,
									last: Number.isNaN(paymentsPendingsLast) ? null : paymentsPendingsLast,
								}
							})
						})
					})
				})
				const typePaymentUnavalible = payments[0].Cities.idtypepayment == null ? 'efectivo' : ''
				const typesPayment = await db.Types_Payments.findAll({
					where: [{state: true},{title: {[Op.ne]: typePaymentUnavalible}}]
				}).then(async typePayments =>{
					const typePaymentAvalible = await typePayments.map(item =>{
						let itemData = {}
						itemData.id = 							item.idtypepayment
						itemData.title = 						item.title
						itemData.description = 			item.description
						return itemData
					})
					return typePaymentAvalible
				})


				const paymentsData = await filterPaymentsPrograms(payments[0], salesInfo)
				const paymentsPendingData = await filterPaymentPendings(paymentsPendings)
				const payload = {
					token: token,
					numberSales: 			salesInfo.count,
					money: 						salesInfo.sum === 0 ? null : salesInfo.sum,
					firstSale: 				salesInfo.first,
					lastSale: 				salesInfo.last,
					bank: 						payments[0].Banks_Accounts.Banks.name,
					accountType: 			payments[0].Banks_Accounts.Types_Accounts.title,
					accountNumber: 		payments[0].Banks_Accounts.num,
					transactionCost: 	paymentsData.cost,
					total: 						paymentsData.total,
					description: 			paymentsData.description,
					paymentCompleted: payments[0].Payments[0].idpayment,
					paymentsPending: 	paymentsPendingData,
					typesPayment:			typesPayment
				}
				res.status(200).json(payload)
			})
		}
	})
}

// Values depending on the program:
const filterPaymentsPrograms = (payments, salesInfo) => {

	let valuePorcent = 0
	const paymentsData = {}

	// Find content of the porgrama select
	const program = payments.Banks_Accounts.Coins.Contents.find(element =>{
		if (element.Programs.idprogram == payments.idprogram) {
			return element
		}

	})

	// Daily: EJ.(percent 1%, deduction: 1600 cop, profit: 0%)
	if(program.percent != 0){

		// paymentsData.cost: 1% + 1600 COP
		paymentsData.cost = `${(program.percent * 100)}% + ${program.deduction} ${payments.Banks_Accounts.Coins.alias}`

		// valuePorcent: (60000 * 0.01) = 600
		valuePorcent = salesInfo.sum * program.percent

		// paymentsData.total: (60000 - 600 - 1600) = 57800
		paymentsData.total = salesInfo.sum - valuePorcent - program.deduction
	}

	// Monthly: (percent 0%, deduction: 0 cop, profit: 1%)
	else if (program.profit != 0){
		paymentsData.cost = null
		valuePorcent = salesInfo.sum * program.profit
		paymentsData.total = salesInfo.sum + valuePorcent
	}

	// Weekly: (percent 0%, deduction: 1600 cop, profit: 1%)
	else{
		paymentsData.cost = program.deduction
		paymentsData.total = salesInfo.sum - program.deduction
	}

	if(salesInfo.sum == 0)paymentsData.total = null
	paymentsData.description = program.content
	return paymentsData
}

// History values depending on the program:
const filterPaymentPendings = (paymentsPendings) => {

	// Maping of paymentsPendings pendings list
	let cost = 0
	let unitaryData = paymentsPendings.map(item =>{

		// Find content of the porgrama select
		const program = item.Banks_Accounts.Coins.Contents.find(element =>{

			if (element.Programs.idprogram == item.idprogram) {
				return element
			}

		})

		// validate of programs in the total
		if(program.percent != 0){ // Diario
			cost = (program.percent * 100) +'% + '+ program.deduction
		}
		else if (program.profit != 0){ // Mensual
			cost = null
		}
		else{ // Semanal
			cost = program.deduction
		}

		let itemData = {}
		itemData.id = 							item.idpayment
		itemData.banc = 						item.Banks_Accounts.Banks.name
		itemData.accountType = 			item.Banks_Accounts.Types_Accounts.title
		itemData.accountNumber = 		item.Banks_Accounts.num
		itemData.transactionCost = 	cost
		itemData.money = 						item.amount
		itemData.total = 						item.total
		return itemData
	})

	if(unitaryData == ''){
		unitaryData = null
	}
	return unitaryData
}

module.exports = index
