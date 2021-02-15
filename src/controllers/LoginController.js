'use strict'

// Requiere package:
const path = require('path')
const sequelize = require('sequelize')
const bcrypt = require('bcrypt')
const db = require(path.join(__dirname, '../models/'))
const auth = require(path.join(__dirname,'./auth'))
const Response = require(path.join(__dirname, '../services/Response'))
const Console_Messages = require(path.join(__dirname,'../services/Console_Messages'))
const response = new Response()
const consoleMessages = new Console_Messages()
const Op = sequelize.Op

// Function for user login:
const index = async (req, res) => {
	const username = req.body.username
	const firebaseToken = req.body.tokenFirebase
	const password = req.body.password

	const data = await db.Administrators.find({
		where: {[Op.and]:[{email: username}, {state: {[Op.ne]:'inactivo'}}]}
	}).then(dataAdmin => {
		if(dataAdmin != null)
		{

			// Return the approval of the existence of the administrator -> (check 1):
			dataAdmin.check = 1
			return dataAdmin
		}
		else
		{

			// Query sellers:
			const seller = db.Sellers.find({
				where: {[Op.and]:[{idseller: username}, {state: {[Op.ne]:'inactivo'}}]}
			}).then(dataSeller => {
				if(dataSeller != null)
				{
					// Return the approval of the existence of the seller -> (check 0):
					dataSeller.check = 0
					return dataSeller
				}
				else{
					res.status(response.NFU03.status).json(response.NFU03.msg)
				}
			})
			return seller
		}
	})

	if (data.state == 'inactivo') {
		res.status(response.NFU03.status).json(response.NFU03.msg)
	}
	else if (data.password == null){
		res.status(response.NFP06.status).json(response.NFP06.msg)
	}
	else{

		// Password Validation:
		await bcrypt.compare(password, data.password, async(err, same) => {

			// Error handler:
			if(err){
				const payloadErr = {
					message: err,
					module: __filename,
					line:	'78:80',
					type:	'error'
				}
				consoleMessages.create(payloadErr)
				res.status(response.SEE01.status).json(response.SEE01.msg)
			}
			else if (same === false){
				res.status(response.NVP04.status).json(response.NVP04.msg)
			}
			else{

				/*------------------------------------------------------------*/
				/* Login administrator:                             					*/
				/*------------------------------------------------------------*/
				if (data.check === 1){

					// Query transaction admin:
					const adminData = await auth.Admin(username, firebaseToken, data, false)

					if (adminData === 500) {
						res.status(response.SEE01.status).json(response.SEE01.msg)
					}
					else res.status(200).json(adminData)
				}

				/*------------------------------------------------------------*/
				/* Login Sellers:                                             */
				/*------------------------------------------------------------*/
				else {

					// Query transaction seller:
					const sellerData = await auth.Seller(username, firebaseToken, data)
					if (sellerData === 500) {
						res.status(response.SEE01.status).json(response.SEE01.msg)
					}
					else res.status(200).json(sellerData)
				}
			}
		})
	}
}

module.exports = index
