'use strict'

// Requiere package:
const path = require('path')
const Sequelize = require('sequelize')
const db = require(path.join(__dirname, '../models/'))
const Op = Sequelize.Op

const index = async(req, res) => {
	const iddepartment = req.body.idDepartment
	const token = req.token

	// Query cities list:
	const cities = await db.Cities.findAll({
		where : {[Op.and]:[{idstate: iddepartment}, {state: {[Op.ne]:false}}]},
		attributes: [['idcity','id'], 'name']
	}).then(dataCities => {
		if (dataCities == '')
		{
			return null
		}
		return dataCities
	})

	const payload = {
		citys: cities,
		token: token
	}
	res.status(200).json(payload)
}

module.exports = index
