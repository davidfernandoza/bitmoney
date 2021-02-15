'use strict'

// Requiere package:
const path = require('path')
const db = require(path.join(__dirname,'../models/'))

// Query policies list:
const index = (req, res) => {
	const token = req.token
	const payload = {token: token}
	db.Policies.findAll({
		lim: 1,
		where :{state : 'true'},
		attributes: ['description']
	}).then(policies => {
		if (policies == '') {
			payload.policies = null
		}
		else{
			payload.policies = policies[0].description
		}
		res.status(200).json(payload)
	})
}

module.exports = index
