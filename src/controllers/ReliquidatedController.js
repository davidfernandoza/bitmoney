'use strict'

// Requiere package:
const path = require('path')
const Console_Messages = require(path.join(__dirname,'../services/Console_Messages'))
const Response = require(path.join(__dirname, '../services/Response'))
const TRM = require(path.join(__dirname,'../services/TRM'))
const transactions = require(path.join(__dirname,'../controllers/TransactionsController'))
const db = require(path.join(__dirname,'../models'))
const notification = require(path.join(__dirname,'../services/Notifications'))
const consoleMessages = new Console_Messages()
const response = new Response()
const trm = new TRM()


const index = (idSale, idCoin, outputs, dataSales, hash, time, criptoName) => {

	// alias filter of the coins:
	db.Coins.find({
		where:{idcoin:idCoin}
	}).then(resulCoinShop => {

		db.Sales_Trm.findAll({
			where: {idsale: idSale},
			include:[
				{
					model: db.Trm,
					as: 'Trm',
					where:{type:'cripto'},
					attributes:['idcoin'],
					required: false,
					include:[
						{
							model: db.Coins,
							as: 'Coins'
						}
					]
				}
			]
		}).then(async salesTrmData => {

			let idCriptoCoin, criptoNum
			for (let i = 0; i < salesTrmData.length; i++) {

				// Search cripto trm:
				if (salesTrmData[i].Trm != null) {
					idCriptoCoin = salesTrmData[i].Trm.idcoin
					criptoNum = salesTrmData[i].Trm.Coins.cripto_num
				}
			}

			// New trm:
			const trmCoinShop = await trm.coin(resulCoinShop.alias, idCoin)
			const trmCriptoCoin = await trm.criptoTrm(idCriptoCoin, criptoNum)
			const idTrmCoin = trmCoinShop[1]
			const idBaseCoin = trmCriptoCoin[1]
			const idTrmCriptoCoin = trmCriptoCoin[3]

			// Update old trm for new trm:
			db.sequelize.transaction(t => {

				// Trm estandar
				return db.Sales_Trm.update({idtrm: idTrmCoin},{
					where: {idsaletrm: salesTrmData[0].idsaletrm},
					transaction: t
				}).then(()=>{

					// Trm Base
					return db.Sales_Trm.update({idtrm: idBaseCoin},{
						where: {idsaletrm: salesTrmData[1].idsaletrm},
						transaction: t
					}).then(()=>{

						// Trm Cripto
						return db.Sales_Trm.update({idtrm: idTrmCriptoCoin},{
							where: {idsaletrm: salesTrmData[2].idsaletrm},
							transaction: t
						})
					})
				})
			}).then(() => {
				transactions(outputs, dataSales, hash, time, criptoName, false)
			}).catch(err => {

				// Error handler:
				const payloadLog = {
					message: err.message,
					module: __filename,
					line: '55:57',
					type: 'error'
				}
				consoleMessages.create(payloadLog)

				db.Sessions.find({
					where: {idsession: dataSales.idsession}
				}).then(dataSession=>{

					const dataPayloadFirebase = {
						notification:{
							title: 'Error en la reliquidación de la transacción.'
						},
						data: response.SEE01.msg
					}
					notification(dataSession.firebase_token, dataPayloadFirebase)
				})
			})
		})
	})
}

module.exports = index
