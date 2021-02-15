'use strict'

// Requiere package:
// const btoa = require('btoa') -- For api xe
const path = require('path')
const got = require('got')
const moment = require('moment')
const Sequelize = require('sequelize')
const db = require(path.join(__dirname, '../models'))
const env = require(path.join(__dirname, '../../config/env'))
const Console_Messages = require(path.join(__dirname,'./Console_Messages'))
const consoleMessages = new Console_Messages()
const Op = Sequelize.Op

class TRM {

	constructor () {
		this.now = moment().unix()

		// Temporary:
		this.urlUsdCop = 'https://www.datos.gov.co/resource/g3ab-sax9.json?$order=vigenciadesde%20DESC&$limit=1'
		this.urlCoinbase = 'https://api.coinbase.com/v2/prices/BTC-USD/buy'

		// Pro:
		this.urlCap = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/map'
		this.urlXe = 'https://xecdapi.xe.com/v1/convert_from.json/'
	}

	// Function for TRM of USD to COP -- TODO: temporal
	async	coin (alias, idCoinShop) {
		try {
			let valueCoin_USD = 0
			let idTrmCoin =	0

			// Check the the last TRM in store's currency:
			return await db.Trm.find({
				where: {[Op.and]:[{idcoin: idCoinShop}, {state: true}, {expiration: {[Op.gt]: this.now}}, {type: 'estandar'}]},
				lim: 1,
				order: [['created_at', 'DESC']]
			}).then( async dataCoin => {

				if (dataCoin != null) {
					valueCoin_USD = dataCoin.value
					idTrmCoin = dataCoin.idtrm
					return [valueCoin_USD, idTrmCoin]
				}
				else{

					const options = {
						headers: {
							'X-App-Token' : env.datosAuth
						}
					}

					const usdCop = await got(this.urlUsdCop, options)

					// Value USD - COP
					const trmCoin = await db.Trm.update({ state : false},{
						where: {[Op.and]:[{idcoin: idCoinShop}, {type: 'estandar'}]}
					}).spread(() => {
						valueCoin_USD = JSON.parse(usdCop.body)
						valueCoin_USD = parseFloat(valueCoin_USD[0].valor)

						let estandarDataTrm = {
							idcoin: idCoinShop,
							value: valueCoin_USD,
							type: 'estandar',
							expiration:  moment().add(5, 'minutes').unix(),
							state: true
						}
						return db.Trm.create(estandarDataTrm).then(newTrmCoin =>{
							idTrmCoin = newTrmCoin.idtrm
							return [valueCoin_USD, idTrmCoin]
						})
					})
					return trmCoin
				}
			})

		}
		catch (err) {

			// Error handler;
			const payloadLog = {
				message: err.body,
				module: __filename,
				line: '29:31',
				type: 'error'
			}
			consoleMessages.create(payloadLog)
			return 500
		}
	}

	/*----------------------------------------------------------*/
	/* CriptoCoin    | TRM(Bitmoney) - BTC -> USD |             */
	/*----------------------------------------------------------*/
	async criptoTrm (idCriptoCoin, numberArray) {
		let valueCriptoCoin = 0
		let idtrm = 0

		// Trm bitmoney valid:
		return await db.Trm.find({
			where: {[Op.and]:[{idcoin: idCriptoCoin}, {state: true}, {expiration: {[Op.gt]:this.now}}, {type: 'cripto'}]},
			lim: 1,
			order: [['created_at', 'DESC']]
		}).then( async dataCriptoCoin => {

			// Query trm base:
			const trm_CriptoBase = await this.trmCriptoBase(idCriptoCoin, numberArray)

			if (dataCriptoCoin != null && trm_CriptoBase != 500) {
				valueCriptoCoin = dataCriptoCoin.value
				idtrm = dataCriptoCoin.idtrm

				// Return: value btc_usd original, id trm btc_usd original, value trm_bm, id trm_bm
				return [trm_CriptoBase[0], trm_CriptoBase[1], valueCriptoCoin, idtrm]
			}
			else if (trm_CriptoBase == 500) {
				return 500
			}
			else {

				// TRM bitmoney:
				return await db.Trm.update({ state : false},{
					where: {[Op.and]:[{idcoin: idCriptoCoin}, {type: 'cripto'}]}
				}).spread(async() => {

					return await db.Discounts.findAll({
						lim: 1,
						order: [['created_at','DESC']],
						where: {[Op.and]:[{idcoin: idCriptoCoin}, {state: 'true'}]},
					}).then(async discountsData => {

						if(discountsData != ''){

							// Calculate TRM:
							valueCriptoCoin = trm_CriptoBase[0]
							const discounts = valueCriptoCoin * discountsData[0].value
							const valueTRM_USD = valueCriptoCoin - discounts
							const criptoDataTrm = {
								iddiscount: discountsData[0].iddiscount,
								idcoin: idCriptoCoin,
								value: valueTRM_USD, // USD -> criptoCoin
								type: 'cripto',
								expiration:  moment().add(5, 'minutes').unix(),
								state: true
							}

							// 	Create new trm bitmoney:
							return await db.Trm.create(criptoDataTrm).then(dataTrm => {
								idtrm = dataTrm.idtrm
								return [trm_CriptoBase[0], trm_CriptoBase[1], valueTRM_USD, idtrm]
							}).catch(err => {

								// Error handler;
								const payloadLog = {
									message: err.message,
									module: __filename,
									line: '150:152',
									type: 'error'
								}
								consoleMessages.create(payloadLog)
								return 500
							})
						}
						else{

							// Error handler;
							const payloadLog = {
								message: 'Sin descuentos para procesar la TRM.',
								module: __filename,
								line: '134:136',
								type: 'error'
							}
							consoleMessages.create(payloadLog)
							return 500
						}
					})
				})
			}
		})

	}


	/*--------------------------------------------------------------------*/
	/* request to api external = CriptoCoin  | TRM(Original) BTC -> USD | */
	/*--------------------------------------------------------------------*/

	// eslint-disable-next-line no-unused-vars
	async trmCriptoBase (idCriptoCoin, numberArray) {
		try {
			let valueCriptoBase = 0
			let idtrm = 0

			// Trm base valid:
			return await db.Trm.find({
				where: {[Op.and]:[{idcoin: idCriptoCoin}, {state: true}, {expiration: {[Op.gt]:this.now}}, {type: 'base'}]},
				lim: 1,
				order: [['created_at', 'DESC']]
			}).then( async dataCriptoCoin => {

				if (dataCriptoCoin != null) {
					valueCriptoBase = dataCriptoCoin.value
					idtrm = dataCriptoCoin.idtrm
					return [valueCriptoBase, idtrm]
				}
				else{

					// Query api trm BTC_USD
					const btcUsd = await got(this.urlCoinbase)

					return await db.Trm.update({ state : false},{
						where: {[Op.and]:[{idcoin: idCriptoCoin}, {type: 'base'}]}
					}).spread(async() => {

						valueCriptoBase = JSON.parse(btcUsd.body)
						valueCriptoBase = valueCriptoBase.data.amount

						const criptoBaseData  = {
							idcoin: idCriptoCoin,
							value: valueCriptoBase, // USD -> criptoCoin
							type: 'base',
							expiration:  moment().add(5, 'minutes').unix(),
							state: true
						}

						// Create TRM base:
						return await db.Trm.create(criptoBaseData).then(dataTrm=>{
							idtrm = dataTrm.idtrm
							return[valueCriptoBase, idtrm]
						}).catch(err=>{

							// Error handler;
							const payloadLog = {
								message: err.message,
								module: __filename,
								line: '228:230',
								type: 'error'
							}
							consoleMessages.create(payloadLog)
							return 500
						})
					})
				}
			})
		}catch (err) {

			// Error handler;
			const payloadLog = {
				message: err.body,
				module: __filename,
				line: '192:194',
				type: 'error'
			}
			consoleMessages.create(payloadLog)
			return 500
		}
	}
}
module.exports = TRM



/* -----------------------------------------------------------------
consulta a XE para capturar el valor de las divisas (alias -> 'COP')
se debe de hacer autentificación con https.
--------------------------------------------------------------------
const stringAuth = await btoa(`${env.xeId}:${env.xeKey}`)
const options = {
	headers: {
		'Authorization': `Basic ${stringAuth}`
	}
}
const client = await got(`${this.urlXe}?to=${alias}&amount=1`, options)
const dataXE = JSON.parse(client.body)
--------------------------------------------------------------------*/

/* ------------------------------------------------------------------
Consulta en coinmarketcap para las diferentes criptomonedas
---------------------------------------------------------------------
const options = {
	headers: {
		'X-CMC_PRO_API_KEY' : env.capKey
	}
}

const client = await got('https://pro-api.coinmarketcap.com/v1/cryptocurrency/map', options)
const dataCap = JSON.parse(client.body)
----------------------------------------------------------------------*/
