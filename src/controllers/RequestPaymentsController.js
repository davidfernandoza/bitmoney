'use strict'

// Requiere package:
const path = require('path')
const moment = require('moment')
const Sequelize = require('sequelize')
const Response = require(path.join(__dirname, '../services/Response'))
const Console_Messages = require(path.join(__dirname,'../services/Console_Messages'))
const db = require(path.join(__dirname,'../models'))
const consoleMessages = new Console_Messages()
const response = new Response()
const Op = Sequelize.Op

const index = async(req, res) => {
	const idshop = req.idshop
	const idTypePayment = req.body.idtypepayment
	const token = req.token
	const amount = await db.Payments_Pendings.sum('amount', {
		where: {[Op.and]:[{state: true},{idshop:idshop}]}
	}).then(sum => {
		return sum
	})

	if (amount != null) {

		db.Types_Payments.find({
			where:{idtypepayment: idTypePayment},
		}).then(idtypepayment => {

			// Validate Types Payments data:
			if (idtypepayment != null) {


				db.Shops.findAll({
					where : {[Op.and]:[{idshop: idshop}]},
					attributes: ['idbankaccount','idprogram'],
					include : [
						{
							model : db.Banks_Accounts,
							as : 'Banks_Accounts',
							where: {[Op.and]: [{state: true}]},
							attributes: ['idcoin'],
							required: false,
							include : [
								{
									model : db.Coins,
									where: {[Op.and]: [{state: true}]},
									attributes: ['idcoin'],
									required: false,
									as : 'Coins' ,
									include: [
										{
											model : db.Contents,
											where: {[Op.and]: [{state: true}]},
											attributes: ['percent', 'profit', 'deduction'],
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
						},
						{
							model : db.Cities,
							as : 'Cities',
							include: [
								{
									model: db.Types_Payments,
									as: 'Types_Payments'
								}
							],
							required: false
						}
					]
				}).then(dataPyments => {

					// Validate paymens in cash:
					if (dataPyments[0].Cities.Types_Payments == null && idtypepayment.title == 'efectivo') {
						res.status(response.PEB03.status).json(response.PEB03.msg)
					}
					else{

						// Find content of the porgrama select
						const program = dataPyments[0].Banks_Accounts.Coins.Contents.find(element =>{

							if (element.Programs.idprogram == dataPyments[0].idprogram) {
								return element
							}

						})

						let total
						const percent = program.percent
						const profit = program.profit
						const deduction = program.deduction

						// Create total depending on the program:
						if(program.Programs.title == 'diario'){ // Daily
							total = amount * percent
							total = amount - total - deduction
						}
						else if (program.Programs.title == 'semanal'){ // Weekly
							total = amount - deduction
						}
						else{ // Monthly
							total = amount * profit
							total = amount + total
						}

						let Payment = {
							idbankaccount:dataPyments[0].idbankaccount,
							idprogram:dataPyments[0].idprogram,
							idtypepayment: idTypePayment,
							idshop:idshop,
							amount:amount,
							total:total,
							expiration: moment().add(5, 'days').unix(),
							date:moment().unix(),
							class:'unitario',
							state: 'activo'
						}

						// Sequelize Transaction:
						db.sequelize.transaction(t => {

							// Payments:
							return db.Payments.create(Payment, {
								transaction: t
							}).then(newPayment => {

								// Payment_pendings: in block.
								return db.Payments_Pendings.update({ state : false, idpayment: newPayment.idpayment },{
									where: {[Op.and]: [{idshop:idshop},{state: true}]},
									transaction: t
								}).spread(() => {})
							})
						}).then(() => {
							res.status(200).json({token: token})
						}).catch(err => {

							// Error handler:
							const payloadLog = {
								message: err.message,
								module: __filename,
								line: '96:98',
								type: 'error'
							}
							consoleMessages.create(payloadLog)
							res.status(response.SEE01.status).json(response.SEE01.msg)
						})
					}
				})
			}
			else{
				res.status(response.PEB02.status).json(response.PEB02.msg)
			}
		})
	}
	else{
		res.status(response.PEB01.status).json(response.PEB01.msg)
	}
}

module.exports = index
