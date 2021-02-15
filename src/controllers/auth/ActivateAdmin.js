'use strict'

// Requiere package:
const path = require('path')
const Sequelize = require('sequelize')
const Console_Messages = require(path.join(__dirname,'../../services/Console_Messages'))
const db = require(path.join(__dirname, '../../models'))
const consoleMessages = new Console_Messages()
const Op = Sequelize.Op


class ActivateAdmin {

	async activate(dataAdmin, dataAdministrator, code){

		// Delete code active.
		db.Codes.destroy({where: { idadministrator:dataAdministrator.idadministrator }})

		// Activate administrator data:
		return await db.sequelize.transaction(t => {

			// Administrator:
			return db.Administrators.update(dataAdmin, {
				where : {idadministrator: dataAdministrator.idadministrator},
				returning: true,
				transaction: t
			}).then(admin =>{

				// Shop:
				return db.Shops.update({state: true},{
					where: {[Op.and]: [{idadministrator: dataAdministrator.idadministrator}]},
					returning: true,
					transaction: t
				}).then(dataShopUpdate => {
					return [dataShopUpdate[1][0], admin[1][0]]
				})
			}).then(dataShop => {

				if (dataShop[0].idbankaccount) {

					// Banks accounts:
					return db.Banks_Accounts.update({state: true},{
						where: {[Op.and]: [{idbankaccount: dataShop[0].idbankaccount}]},
						returning: true,
						transaction: t
					}).then(dataBankAccountUpdate => {
						return [dataBankAccountUpdate[1][0], dataShop[0], dataShop[1]]
					})
				}
				else{
					return dataShop
				}
			}).then(dataBankAccount => {

				if (dataBankAccount[0].idholder) {

					// Holders:
					return db.Holders.update({state: true},{
						where: {[Op.and]: [{idholder: dataBankAccount[0].idholder}]},
						returning: true,
						transaction: t
					}).then(dataHoldeUpdate => {
						return [dataHoldeUpdate[1][0], dataBankAccount[0], dataBankAccount[1],dataBankAccount[2]]
					})
				}
				else{
					return [0, 1, dataBankAccount[0], dataBankAccount[0]]
				}
			}).then(dataHolder => {

				// WALLETS: in block.
				return db.Wallets.update({ state : true},{
					where: { idadministrator: dataHolder[2].idadministrator },
					transaction: t
				}).spread(() => {
					return db.Wallets.findAll({
						where: { idadministrator: dataHolder[2].idadministrator }
					})
				}).then(walletDataUpdate => {
					return [walletDataUpdate[0], dataHolder[0], dataHolder[1], dataHolder[2], dataHolder[3]]
				})
			}).then(dataWallet => {

				// CODES:
				let dataCodes = {
					idadministrator : dataWallet[4].idadministrator,
					code: code
				}
				return db.Codes.create(dataCodes, {
					transaction: t
				}).then(() => {
					return dataWallet[3].idshop
				})
			})
		}).then(result => result).catch(err => {

			// Error handler:
			const payloadLog = {
				message: err.message,
				module: __filename,
				line: '21:23',
				type: 'error'
			}
			consoleMessages.create(payloadLog)
			return 500
		})
	}
}

module.exports = ActivateAdmin

