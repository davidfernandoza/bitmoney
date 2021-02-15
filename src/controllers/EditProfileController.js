'use strict'

// Requiere package:
const path = require('path')
const Sequelize = require('sequelize')
const Response = require(path.join(__dirname, '../services/Response'))
const Console_Messages = require(path.join(__dirname,'../services/Console_Messages'))
const db = require(path.join(__dirname,'../models'))
const consoleMessages = new Console_Messages()
const response = new Response()
const Op = Sequelize.Op

const index = (req, res) => {
	const iduser = req.iduser
	const bank = req.body.bank
	const accountType = req.body.accountType
	const accountNum = req.body.accountNumber
	const country = req.body.country
	const documentHolder = req.body.documentNumber
	const nameHolder = req.body.accountHolder
	const cellphone = req.body.cellphone
	const city = req.body.city
	const addressShop = req.body.address
	const nameShop = req.body.name
	const token = req.token
	const state = 'activo'
	const dataHolder = {
		document: documentHolder,
		name:nameHolder
	}
	const dataShops = {
		idcity: city,
		name: nameShop,
		address: addressShop
	}
	const payloadAdmin = {
		cellphone: cellphone,
		state:state
	}
	const dataBanckAccount = {
		idtypeaccount:accountType,
		idbank:bank,
		state:true
	}

	/* -------------------------------- */
	/* Validation of data existence:		*/
	/* -------------------------------- */

	// Cities:
	db.Cities.find({
		where: {[Op.and]:[{idcity:city}, {state: {[Op.ne]:false}}]}
	}).then(resulCity => {
		if (resulCity == null) res.status(response.NFSI01.status).json(response.NFSI01.msg)
		else{

			// Contries And Coins:
			db.Countries.find({
				where:{[Op.and]:[{idcountry:country}, {state: {[Op.ne]:false}}]},
				include : [{
					model : db.Coins,
					as : 'Coins'
				}]
			}).then(resulCountryCoin => {
				if (resulCountryCoin == null) res.status(response.NFSI02.status).json(response.NFSI02.msg)
				else{

					// Banks:
					db.Banks.find({
						where:{[Op.and]:[{idbank:bank}, {state: {[Op.ne]:false}}]}
					}).then(resulBank => {
						if (resulBank == null) res.status(response.NFSI03.status).json(response.NFSI03.msg)
						else{

							// Types Accounts:
							db.Types_Accounts.find({
								where:{[Op.and]:[{idtypeaccount:accountType}, {state: true}]}
							}).then(resulTypeAccounts => {
								if (resulTypeAccounts == null) res.status(response.NFSI04.status).json(response.NFSI04.msg)
								else{

									// Banks Accounts and Holders
									db.Banks_Accounts.find({
										where: {[Op.and]:[{num:accountNum}]},
										include : [{
											model : db.Holders,
											as : 'Holders'
										}]
									}).then(resultBankAccount => {

										// Sequelize transaction with the data to update:
										db.sequelize.transaction(t => {
											return db.Administrators.update(payloadAdmin, {
												where : {[Op.and]: [{idadministrator: iduser}]},
												returning: true,
												transaction: t
											}).then(async () => {
												dataBanckAccount.idcoin = resulCountryCoin.Coins.idcoin

												// Account not exist (create):
												if (resultBankAccount == null) {

													const holder = await db.Holders.find({
														where: {[Op.or]: [{document:documentHolder}]}
													}).then(async resultHolder => {
														if (resultHolder) return resultHolder
														return await db.Holders.create(dataHolder, {
															transaction: t
														}).then(newHolder => {
															return newHolder
														})
													})

													dataBanckAccount.num = accountNum
													dataBanckAccount.idholder = holder.idholder
													return db.Banks_Accounts.create(dataBanckAccount, {
														transaction: t
													}).then(newBankAccount => {
														return newBankAccount
													})
												}

												// Account exist (update):
												else{

													// It has different holder:
													if (resultBankAccount.Holders.document != documentHolder) {
														throw new Error (403)
													}

													return db.Banks_Accounts.update(dataBanckAccount, {
														where : {[Op.and]: [{idbankaccount: resultBankAccount.idbankaccount}]},
														returning: true,
														transaction: t
													}).then(editBankAccount => {
														return editBankAccount[1][0]
													})
												}
											}).then(bankAccount => {
												dataShops.idbankaccount = bankAccount.idbankaccount
												return db.Shops.update(dataShops, {
													where:{[Op.or]:[{idadministrator:iduser}]},
													transaction: t
												})
											})
										}).then(() => {
											res.status(200).json({token: token})
										}).catch(err => {

											if (err.message == '403') res.status(response.AEE07.status).json(response.AEE07.msg)

											else{
												// Error handler;
												const payloadLog = {
													message: err.message,
													module: __filename,
													line: '87:89',
													type: 'error'
												}
												consoleMessages.create(payloadLog)
												res.status(response.SEE01.status).json(response.SEE01.msg)
											}
										})
									})
								}
							})
						}
					})
				}
			})
		}
	})
}

module.exports = index


