'use strict'

// Requiere package:
const path = require('path')
const Sequelize = require('sequelize')
const moment = require('moment')
const Response = require(path.join(__dirname, '../services/Response'))
const Console_Messages = require(path.join(__dirname,'../services/Console_Messages'))
const TRM = require(path.join(__dirname,'../services/TRM'))
const db = require(path.join(__dirname,'../models'))
const trm = new TRM()
const consoleMessages = new Console_Messages()
const response = new Response()
const Op = Sequelize.Op

// FIXME: arreglar trm

const index = async(req, res) => {
	const valueCoin = parseFloat(req.body.value)
	const idCriptoCoin = req.body.coin
	const idShop = req.idshop
	const idUser = req.iduser
	const rol = req.roluser
	const token = req.token
	const session = req.idfirebase

	// Query criptoCoins:
	const criptoCoin = await db.Coins.find({
		where: { [Op.and]: [{ idcoin: idCriptoCoin }] },
		attributes: ['idcoin', 'cripto_num']
	}).then(dataCoins => {
		if (dataCoins == null) res.status(response.NFC04.status).json(response.NFC04.msg)
		else return dataCoins
	})

	// Query wallet:
	const wallet = await db.Wallets.find({
		where: {[Op.or]: [{ idadministrator: idUser }, { idseller: idUser }], state: true, idcoin: idCriptoCoin},
		attributes: ['idwallet', 'address']
	}).then(dataWallet => {
		if (dataWallet == null){

			// Error handler;
			const payloadLog = {
				message: 'No se encontro la wallet.',
				module: __filename,
				line: '29:31',
				type: 'error'
			}
			consoleMessages.create(payloadLog)
			res.status(response.SEE01.status).json(response.SEE01.msg)
		}
		else return dataWallet
	})
	db.Shops.findAll({
		where: { [Op.and]: [{ idshop: idShop }, { state: { [Op.ne]: false } }] },
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
	}).then(async dataShop => {

		if (dataShop == ''){

			// Error handler;
			const payloadLog = {
				message: 'No se encontro la tienda.',
				module: __filename,
				line: '29:31',
				type: 'error'
			}
			consoleMessages.create(payloadLog)
			res.status(response.SEE01.status).json(response.SEE01.msg)
		}

		try {
			const alias = dataShop[0].Banks_Accounts.Coins.alias
			const idCoinShop = dataShop[0].Banks_Accounts.Coins.idcoin
			const numCriptoCoin = criptoCoin.cripto_num

			// Get TRM:
			const trmUSD_COP = await trm.coin(alias, idCoinShop)
			const trmCriptoCoin_USD = await trm.criptoTrm(idCriptoCoin, numCriptoCoin)
			if (trmUSD_COP === 500 || trmCriptoCoin_USD === 500) {

				// Error handler;
				const payloadLog = {
					message: 'trmUSD_COP o trmCriptoCoin_USD Error 500',
					module: __filename,
					line: '91:93',
					type: 'error'
				}
				consoleMessages.create(payloadLog)
				res.status(response.SEE01.status).json(response.SEE01.msg)
			}
			else{
				let expiration = moment().add(10, 'minutes').unix()
				const valueUSD = valueCoin / trmUSD_COP[0]

				//  Round up in decimal 8
				const valueTransaction = +(Math.ceil((valueUSD / trmCriptoCoin_USD[2]) + 'e+8') + 'e-8')
				const value = parseInt(valueTransaction * 100000000)
				const dataSale = {
					idwallet: wallet.idwallet,
					idshop: idShop,
					idcoin: idCoinShop,
					idsession: session,
					value: valueCoin,
					amount: value,
					expiration: expiration,
					state: 'espera'
				}

				if (rol == 'admin') {
					dataSale.idadministrator = idUser
				}
				else {
					dataSale.idseller = idUser
				}
				expiration = expiration - (moment().unix())
				expiration = moment.unix(expiration).format('mm:ss')

				// Transaction sequelize:
				db.sequelize.transaction(t => {

					// Cancel active sales:
					return db.Sales.update({ state: 'cancelado' },{
						where: {idwallet: wallet.idwallet, state: 'espera'},
						transaction: t
					}).then(() => {
						return db.Sales.create(dataSale, {transaction: t
						}).then(dataSaleCreate => dataSaleCreate)
					}).then(salesData => {

						// TRM: base, cripto, estandar
						return db.Sales_Trm.bulkCreate([
							{ idsale: salesData.idsale,  idtrm: trmUSD_COP[1] },
							{ idsale: salesData.idsale,  idtrm: trmCriptoCoin_USD[1] },
							{ idsale: salesData.idsale,  idtrm: trmCriptoCoin_USD[3] }
						], {transaction: t
						}).then(() => salesData)
					})
				}).then(result => {
					const payload = {
						token: token,
						value: valueTransaction,
						wallet: wallet.address,
						time: expiration,
						id: result.idsale
					}
					res.status(200).json(payload)
				}).catch(err =>{

					// Error handler:
					const payloadLog = {
						message: err.message,
						module: __filename,
						line: '137:139',
						type: 'error'
					}
					consoleMessages.create(payloadLog)
					res.status(response.SEE01.status).json(response.SEE01.msg)
				})
			}
		} catch (err) {

			// Error handler;
			const payloadLog = {
				message: err.message,
				module: __filename,
				line: '84:86',
				type: 'error'
			}
			consoleMessages.create(payloadLog)
			res.status(response.SEE01.status).json(response.SEE01.msg)
		}
	})
}

module.exports = index
