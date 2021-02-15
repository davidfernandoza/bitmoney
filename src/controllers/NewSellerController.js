'use strict'

// Requiere package:
const path = require('path')
const Sequelize = require('sequelize')
const Response = require(path.join(__dirname, '../services/Response'))
const Console_Messages = require(path.join(__dirname,'../services/Console_Messages'))
const db = require(path.join(__dirname,'../models'))
const VerificationCode = require(path.join(__dirname,'../services/Code'))
const consoleMessages = new Console_Messages()
const response = new Response()
const Op = Sequelize.Op

// Create seller:
const index = async(req, res) => {
	const name = req.body.name
	const idShop = req.idshop
	const token = req.token
	const code = await VerificationCode()
	const Seller = {
		name:name,
		idshop: idShop,
		login: idShop + code,
		state: 'definir'
	}

	// Query available wallets:
	db.Wallets.findAll({
		where :{[Op.and]: [{idadministrator: null},{idseller: null}]},
		attributes: [[Sequelize.literal('DISTINCT ON (idcoin) idcoin'), 'idcoin'], 'idwallet']
	}).then(dataWallet => {
		if(dataWallet == '')
		{
			res.status(response.NEB01.status).json(response.NEB01.msg)
		}
		else
		{

			// Query Seller number:
			db.Sellers.find({
				where: {[Op.and]: [{idshop: idShop}]},
				attributes: ['num'],
				order: Sequelize.literal('max(num) DESC'),
				limit: 1,
				group: 'num'
			}).then(dataSeller => {
				if(dataSeller == null)
				{
					Seller.num = 1
				}
				else
				{
					Seller.num = dataSeller.num + 1
				}

				// Sequelize Transaction:
				db.sequelize.transaction(t => {
					return db.Sellers.create(Seller, {
						transaction: t
					}).then(async newSeller => {

						// Assign all the available wallets of the different cryptocurrencies to seller:
						for (let i = 0; i < dataWallet.length; i++) {
							db.Wallets.update({idseller:newSeller.idseller},{
								where : {[Op.and]:[{idwallet:dataWallet[i].idwallet}]},
								transaction: t
							}).then(walletUpdate => {
								if (walletUpdate[0] != 1) {
									throw new Error
								}
							})
						}
						return newSeller
					})
				}).then(result => {

					const payload = {
						name:   result.name,
						id:     result.idseller,
						number: result.num,
						token:  token
					}
					res.status(200).json(payload)
				}).catch(err => {

					// Error handler;
					const payloadLog = {
						message: err.message,
						module: __filename,
						line: '56:58',
						type: 'error'
					}
					consoleMessages.create(payloadLog)
					res.status(response.SEE01.status).json(response.SEE01.msg)
				})
			})
		}
	})
}

module.exports = index

