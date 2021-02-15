'use strict'

// Requiere package:
const path = require('path')
const moment = require('moment')
const Sequelize = require('sequelize')
const db = require(path.join(__dirname, '../models'))
const Op = Sequelize.Op



const index = () => {

	setTimeout(index, 600000)

	// Cancel payment for expirate:
	db.Payments.update({ state: 'expirado' },{
		where:{[Op.and]:[{expiration: {[Op.lt]: moment().unix()}}, {state: 'activo'}]}
	}).spread(() => {})
}

module.exports = index
