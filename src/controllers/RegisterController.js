'use strict'

// Requiere package:
const path = require('path')
const bcrypt = require('bcrypt')
const Sequelize = require('sequelize')
const Response = require(path.join(__dirname, '../services/Response'))
const Console_Messages = require(path.join(__dirname,'../services/Console_Messages'))
const db = require(path.join(__dirname, '../models'))
const mail = require(path.join(__dirname, '../services/Mail'))
const verificationCode = require(path.join(__dirname, '../services/Code'))
const ActivateAdmin = require(path.join(__dirname, './auth/ActivateAdmin'))
const activateAdmin = new ActivateAdmin()
const consoleMessages = new Console_Messages()
const response = new Response()
const Op = Sequelize.Op

const index = async(req, res) => {
	const pin = req.body.registrationPin
	const password = req.body.password
	const to = req.body.email
	const subject = 'Validación de correo electrónico'
	const name = req.body.name
	const code = await verificationCode()
	const text = `<p>Hola ${name}, te damos la bienvenida a BitMoney.</p><p>Tu codigo de validacion es: <b>${code}</b> </p>`

	if(code === 500)res.status(response.SEE01.status).json(response.SEE01.msg)
	else{


		// Sponsors Validation:
		db.Sponsors.find({
			where: {[Op.and]: [{pin: pin}, {state: true}]}
		}).then(dataSponsors => {
			if(dataSponsors == null){
				res.status(response.NVRP03.status).json(response.NVRP03.msg)
			}
			else
			{

				// Administrator Validation:
				db.Administrators.find({
					where: {[Op.and]: [{email: to}]}
				}).then(async dataAdministrator => {

					// Password Encryption:
					const salt = bcrypt.genSaltSync(10)
					const hash = bcrypt.hashSync(password, salt)

					const dataAdmin = {
						name : name,
						email : to,
						password : hash,
						state : 'confirmar'
					}
					const idSponsor = dataSponsors.dataValues.idsponsor
					const payload = {
						verificationCode:code
					}

					/*-----------------------------------------------*/
					/*  Disabled Administrator                       */
					/*-----------------------------------------------*/
					if(dataAdministrator != null)
					{
						if(dataAdministrator.state != 'inactivo') {
							res.status(response.AEE04.status).json(response.AEE04.msg)
						}
						else {
							const idAdmin = await activateAdmin.activate(dataAdmin, dataAdministrator, code)
							if (idAdmin === 500) res.status(response.SEE01.status).json(response.SEE01.msg)
							else {
								payload.id = idAdmin

								// Send info to email and client:
								mail(to, subject, text)
								res.status(200).json(payload)
							}
						}
					}
					/*----------------------------------------------- */
					/*  New Administrator                             */
					/*----------------------------------------------- */

					else
					{

						db.Wallets.findAll({
							where :{[Op.and]: [{idadministrator: null},{idseller: null}]},
							attributes: [[Sequelize.literal('DISTINCT ON (idcoin) idcoin'), 'idcoin'], 'idwallet']
						}).then(dataWallet =>{

							if(dataWallet == '' )
							{
								res.status(response.NEB01.status).json(response.NEB01.msg)
							}
							else
							{
								// Sequelize Transaction:
								db.sequelize.transaction(t => {

									// Administrators:
									return db.Administrators.create(dataAdmin, {
										transaction: t
									}).then(newAdmin => {

										// Shops:
										const dataShop = {
											idsponsor : idSponsor,
											idadministrator: newAdmin.dataValues.idadministrator
										}

										return db.Shops.create(dataShop, {
											transaction: t
										}).then(newShop => {
											return [newShop, newAdmin]
										})
									}).then(async newDataShop => {

										//Wallets:
										const idadministrator = newDataShop[1].dataValues.idadministrator

										// Assign all the available wallets of the different cryptocurrencies to seller:
										for (let i = 0; i < dataWallet.length; i++) {
											db.Wallets.update({idadministrator: idadministrator},{
												where : {[Op.and]:[{idwallet:dataWallet[i].idwallet}]},
												transaction: t
											}).then(walletUpdate => {
												if (walletUpdate[0] != 1) {
													throw new Error
												}
											})
										}
										return [newDataShop[0], newDataShop[1]]
									}).then(newDataWallet => {

										// Codes:
										const dataCodes = {
											idadministrator : newDataWallet[1].dataValues.idadministrator,
											code: code
										}

										return db.Codes.create(dataCodes, {
											transaction: t
										}).then(() => {
											return newDataWallet[0].dataValues.idshop
										})
									})
								}).then(idAdmin => {
									payload.id = idAdmin

									// Send info to email and client:
									mail(to, subject, text)
									res.status(200).json(payload)
								}).catch(err => {

									// Error handler:
									const payloadLog = {
										message: err.message,
										module: __filename,
										line: '89:91',
										type: 'error'
									}
									consoleMessages.create(payloadLog)
									res.status(response.SEE01.status).json(response.SEE01.msg)
								})
							}
						})
					}
				})
			}
		})
	}
}

module.exports = index
