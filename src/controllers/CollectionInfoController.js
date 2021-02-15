'use strict'

// Requiere package:
const path = require('path')
const Sequelize = require('sequelize')
const Console_Messages = require(path.join(__dirname,'../services/Console_Messages'))
const Response = require(path.join(__dirname, '../services/Response'))
const db = require(path.join(__dirname,'../models/'))
const TRM = require(path.join(__dirname,'../services/TRM'))
const trm = new TRM()
const consoleMessages = new Console_Messages()
const response = new Response()
const Op = Sequelize.Op

// Collection info:
const index = async (req, res) =>{
	const idshop = req.idshop
	const token = req.token

	// Query list cripto coins:
	const coins = await db.Coins.findAll({
		where: { [Op.and]: [{ type: 'cripto' }, { state: true }] },
		attributes: ['name', 'idcoin', 'cripto_num']
	})

	// Query banks data:
	db.Shops.findAll({
		where: { [Op.and]: [{ idshop: idshop }, { state: { [Op.ne]: false } }] },
		attributes: ['idbankaccount'],
		include: [
			{
				model: db.Banks_Accounts,
				as: 'Banks_Accounts',
				where: { [Op.and]: [{ state: { [Op.ne]: false } }] },
				include: [
					{
						model: db.Coins,
						where: { [Op.and]: [{ state: { [Op.ne]: false } }] },
						attributes: ['alias', 'idcoin'],
						as: 'Coins'
					}
				]
			}
		]
	}).then(async dataBank => {
		try {
			if (dataBank[0].Banks_Accounts.Coins.alias) {
				const coinShopAlias = dataBank[0].Banks_Accounts.Coins.alias
				const idCoinShop = dataBank[0].Banks_Accounts.Coins.idcoin
				const trmCoin = await trm.coin(coinShopAlias, idCoinShop)
				let numBtcFind = 0
				let idBtc = 0
				let count = 0

				// Cripto Coins list:
				const coin = coins.map(obj => {
					const objData = {}
					if (obj.name == 'bitcoin') {
						numBtcFind = obj.cripto_num
						idBtc = obj.idcoin
						count = 1
					}
					objData.id = obj.idcoin
					objData.name = obj.name
					return objData
				})


				if (coin != '' && count === 1) {

					// Default bitcoin, other criptocoins for ajax
					const trmCriptoCoin = await trm.criptoTrm(idBtc, numBtcFind)
					const payload = {
						token: token,
						valueBtc: trmCriptoCoin[2],
						valueUsd: trmCoin[0],
						coin: coinShopAlias,
						coins: coin
					}
					res.status(200).json(payload)
				}
				else {
					throw new Error('No se enconto alguna criptomoneda en la base de datos.')
				}
			} else {
				throw new Error('No se enconto la moneda de la tienda.')
			}

		} catch (err) {

			// Error handler;
			const payloadLog = {
				message: err.message,
				module: __filename,
				line: '45:48',
				type: 'error'
			}
			consoleMessages.create(payloadLog)
			res.status(response.SEE01.status).json(response.SEE01.msg)
		}
	})
}

module.exports = index
