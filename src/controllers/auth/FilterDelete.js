'use strict'

// Requiere package:
const path = require('path')
const db = require(path.join(__dirname, '../../models'))

const index = async(result, username) => {

	// Validate empty data:
	let countNull = 0
	if (result[0].stateBank == false || result[0].stateAccount == false){
		result[0].accountNumber = null
		result[0].accountHolder = null
		result[0].documentHolder = null
		countNull = 1
	}

	if (result[0].stateCoin == false){
		result[0].coin = null
		countNull = 1
	}
	if (result[0].stateCity == false){
		result[0].city = null
		countNull = 1
	}
	if (result[0].stateDepartament == false){
		result[0].department = null
		countNull = 1
	}
	if(result[0].stateCountry == false){
		result[0].country = null
		countNull = 1
	}

	// Validate if you have null data to give the incomplete status to the user:
	if (countNull == 1 ){
		await db.Administrators.update({state: 'incompleto'}, {
			where: { email: username }
		})
		delete result[0].state
		result[0].state = 'incompleto'
	}
	else {
		await db.Administrators.update({state: 'activo'}, {
			where: { email: username }
		})
		delete result[0].state
		result[0].state = 'activo'
	}

	// Delete data unneeded for response:
	delete result[0].stateHolder
	delete result[0].stateBank
	delete result[0].stateAccount
	delete result[0].stateCoin
	delete result[0].stateCity
	delete result[0].stateDepartament
	delete result[0].stateCountry
	delete result[0].iduser
	result[0].token = result[1]
	return result[0]
}

module.exports = index
