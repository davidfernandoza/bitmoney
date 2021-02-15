'use strict'

// Requiere package:
const path = require('path')
const Sequelize = require('sequelize')
const db = require(path.join(__dirname,'../models/'))
const Op = Sequelize.Op

// Query and send departments of countries:
const index = (req, res) => {
	const idcountry = req.body.idCountry
	const token = req.token
	let departments = ''
	db.States.findAll({
		where : {[Op.and]:[{idcountry: idcountry}, {state: {[Op.ne]:false}}]},
		attributes: [['idstate','id'], 'name']
	}).then(dataStates => {
		if (dataStates == '')
		{
			departments = null
		}
		else{
			departments = dataStates
		}
		const payload = {
			departments: departments,
			token: token
		}
		res.status(200).json(payload)
	})
}

module.exports = index
