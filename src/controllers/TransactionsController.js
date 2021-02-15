'use strict'

// Requiere package:
const path = require('path')
const moment = require('moment')
const Sequelize = require('sequelize')
const env = require(path.join(__dirname,'../../config/env'))
const Exchange = require(path.join(__dirname, '../services/Exchange'))
const db = require(path.join(__dirname,'../models'))
const notification = require(path.join(__dirname,'../services/Notifications'))
const Console_Messages = require(path.join(__dirname,'../services/Console_Messages'))
const SMS = require(path.join(__dirname,'../services/SMS'))
const mail = require(path.join(__dirname, '../services/Mail'))
const consoleMessages = new Console_Messages()
const exchange = new Exchange()
const sms = new SMS()
const Op = Sequelize.Op

const index = async(outputs, dataSales, hash, time, criptoName, stateSale) => {

	// Get info of users (ADMIN/SELLER)
	let dataUser = ''
	if (dataSales.idadministrator != null) {
		dataUser = await db.Administrators.find({where: {idadministrator: dataSales.idadministrator}}).then(dataAdmin =>{
			return db.Sessions.find({where: {idsession: dataSales.idsession}}).then(dataSession=>{
				return [dataAdmin.name, dataSession.firebase_token]
			})
		})
	}
	else{
		dataUser = await db.Sellers.find({where: {idseller: dataSales.idseller}}).then(dataSeller =>{
			return db.Sessions.find({where: {idsession: dataSales.idsession}}).then(dataSession=>{
				return [dataSeller.name, dataSession.firebase_token]
			})
		})
	}

	// Get value in coin of country and the trm of database register
	db.Sales_Trm.findAll({
		where:  {idsale:dataSales.idsale},
		include: [
			{
				model: db.Trm,
				as: 'Trm'
			},
			{
				model: db.Sales,
				as: 'Sales',
				include:[
					{
						model: db.Shops,
						as: 'Shops',
					}
				]
			}
		]
	}).then(trmDatabase => {

		// Filter of trm type for your value
		let trmCoin, criptoTrm, idCriptoCoin
		for (let i = 0; i < trmDatabase.length; i++) {
			if (trmDatabase[i].Trm.type == 'cripto') {
				criptoTrm = trmDatabase[i].Trm.value
				idCriptoCoin = trmDatabase[i].Trm.idcoin
			}
			else if (trmDatabase[i].Trm.type == 'estandar') {
				trmCoin =  trmDatabase[i].Trm.value
			}
		}

		// Change of value criptocoin to coin of country
		const btcAmount = outputs.value / 100000000
		let amount = btcAmount * criptoTrm
		amount = amount * trmCoin

		// Get current value of limit base for BITTREX
		db.Limits.findAll({
			where: {[Op.and]:[{idcoin:  idCriptoCoin},{state: true}]},
			lim: 1,
			order: [['created_at', 'DESC']]
		}).then(limitData => {

			// Get sum of amounts in buffer:
			db.Transactions.sum('value', {
				where: {in_buffer:true},
			}).then(sumTransactions => {
				sumTransactions = (isNaN( sumTransactions ) ? 0 : sumTransactions / 100000000)
				const value = +(Math.ceil((btcAmount + sumTransactions ) + 'e+8') + 'e-8')

				// Get numbers consecutive in transaction table:
				db.Payments_Pendings.max('reference', { where: {idshop:dataSales.idshop}}
				).then(maxReference => {
					db.Payments_Pendings.max('consecutive'
					).then( async(maxConsecutive) => {

						// Set object for create the register in transaction table:
						const transactionData = {
							idsale: dataSales.idsale,
							idwallet: dataSales.idwallet,
							hash: hash,
							value: outputs.value
						}

						// Set object for create the register in payments Pendings table:
						const paymentsPendingsData = {
							idshop: dataSales.idshop,
							reference: maxReference + 1,
							consecutive: maxConsecutive + 1
						}

						// Set object for send notify to phones:
						const dataPayloadFirebase = {
							notification:{},
							data:{
								storeName: trmDatabase[0].Sales.Shops.name,
								date: moment.unix(time).format('DD/MM/YYYY  hh:mm a'),
								sellerName: dataUser[0],
								reference: (maxReference + 1).toString(),
								consecutive: (maxConsecutive + 1).toString(),
								coin: criptoName[0]
							}
						}

						/* ------------------------------------------	*/
						/* Validation amount getting in transaction:	*/
						/* ------------------------------------------	*/

						// Amounts same:
						if (outputs.value == dataSales.amount) {

							// Values add to object after of validation:
							dataPayloadFirebase.notification.title = 'Transacción Completa'
							transactionData.state = 'completa'
							paymentsPendingsData.amount = dataSales.value
							dataPayloadFirebase.data.value = dataSales.value.toString()
						}

						// Amounts not precises:
						else{

							// Amount of incomplete transaction:
							if(outputs.value < dataSales.amount){
								dataPayloadFirebase.notification.title = 'Transacción Incompleta'
								transactionData.state = 'incompleta'
							}

							// Amount of transaction exceeded
							else{
								dataPayloadFirebase.notification.title = 'Transacción Excedida'
								transactionData.state = 'excedida'
							}

							// Values add to object after of validation:
							paymentsPendingsData.amount = amount
							dataPayloadFirebase.data.value = amount.toString()
						}

						// Query balance in BITTREX:
						const amoundExchange = await exchange.balance(criptoName[1])

						const smsPayload ={
							from: env.twilioNumFrom,
							to: env.twilioNumAdmin
						}

						// Send messages SMS to Bitmoney administrator for handling of errors and resources:
						if (amoundExchange == 500) {
							smsPayload.body = `Error en el servidor al intentar capturar la cantidad de ${criptoName[1]} disponible en BITTREX`
							sms(smsPayload)
							mail(env.emailAdmin , 'Error de servidor.', smsPayload)
						}
						else{
							if (amoundExchange.result.Available < limitData[0].value) {

								if (limitData[0].value < value) {
									smsPayload.body = `AVISO! Se necesita aumentar la base en BITTREX, ya que el monto actual disponible es de ${amoundExchange.result.Available} ${criptoName[1]} y se requiere un mínimo de ${(Math.ceil((value + limitData[0].value ) + 'e+8') + 'e-8')} ${criptoName[1]}. NOTA: Este valor mínimo es la sumatoria de la base preestablecida con lo que se acúmulo de transacciones sin cambiar, no se tiene en cuenta la comisión del exchange en este valor.`
								}
								else {
									smsPayload.body = `AVISO! Se necesita aumentar la base en BITTREX, ya que el monto actual disponible es de ${amoundExchange.result.Available} ${criptoName[1]} y se requiere un minimo de ${limitData[0].value} ${criptoName[1]}. NOTA: no se tiene en cuenta la comisión del exchange en este valor.`
								}
								sms.send(smsPayload)
								mail(env.emailAdmin , 'Bitmoney: Sin base en BITTREX.', smsPayload)
							}

							// Validate the amount available in Bittrex with the incoming amount plus the buffer:
							if (amoundExchange.result.Available < value) {

								transactionData.in_buffer = true
							}
							else{
								transactionData.in_buffer = false
							}

							// Transaction sql.
							db.sequelize.transaction(t => {

								// Create register in tables transaction:
								return db.Transactions.create(transactionData, {
									transaction: t
								}).then(newDataTransactions => {

									// Create register in tables payments pending:
									paymentsPendingsData.idtransaction = newDataTransactions.idtransaction
									return db.Payments_Pendings.create(paymentsPendingsData, {
										transaction:  t
									}).then(async () => {

										let changeValue = 404

										// Validate if the register is in buffer for your sale:
										if (transactionData.in_buffer == false) {

											// Calling to sell of Criptocurrency to USD.
											await exchange.sell(criptoName[1], value).then(status =>{
												changeValue = status
											})
										}

										return [changeValue, newDataTransactions]
									})
								}).then(changeOk => {

									// Problem in sale
									if(changeOk[0] == 500){
										return db.Transactions.update({in_buffer: true},{
											where:{idtransaction: changeOk[1].idtransaction},
											transaction: t
										})
									}
									// Successful sale
									else if(changeOk[0] == 200){
										return db.Transactions.update({ in_buffer: false},{
											where: {in_buffer: true},
											transaction: t
										})
									}
									// no value to sell
									else{
										return true
									}
								}).then(changeOk =>{
									const sale ={}
									if (stateSale == true) sale.state = 'confirmado'
									else sale.state ='reliquidado'
									return db.Sales.update(sale,{
										where:{idsale:dataSales.idsale},
										transaction: t
									}).then(() => {
										return changeOk
									})
								})
							}).then(() => {

								// Send notify to phone:
								notification(dataUser[1], dataPayloadFirebase)
							}).catch(err => {

								// Error handler:
								const payloadLog = {
									message: err.message,
									module: __filename,
									line: '',
									type: 'error'
								}
								consoleMessages.create(payloadLog)
							})
						}
					})
				})
			})
		})
	})
}
module.exports = index



