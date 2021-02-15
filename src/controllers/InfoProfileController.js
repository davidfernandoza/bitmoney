'use strict'

// Requiere package:
const path = require('path')
const Sequelize = require('sequelize')
const db = require(path.join(__dirname,'../models'))
const Op = Sequelize.Op

// Send list of banks, types accounts and contries:
const index = (req, res) => {
	const token = req.token

	db.Banks.findAll({
		where : {state: {[Op.ne]:false}},
		attributes: [['idbank','id'], 'name']
	}).then(dataBanks => {
		if (dataBanks == '')dataBanks = null

		db.Types_Accounts.findAll({
			where : {state: {[Op.ne]:false}},
			attributes: [['idtypeaccount','id'], ['title','name']]
		}).then(dataTypeAccounts => {
			if (dataTypeAccounts == '')dataTypeAccounts = null

			db.Countries.findAll({
				where : {state: {[Op.ne]:false}},
				attributes: [['idcountry','id'], 'name']
			}).then(dataCountries => {
				if (dataCountries == '')dataCountries = null

				const payload = {
					banks: dataBanks,
					accountTypes: dataTypeAccounts,
					countrys: dataCountries,
					token: token
				}
				res.status(200).json(payload)
			})
		})
	})
}

module.exports = index
