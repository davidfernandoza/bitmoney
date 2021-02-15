'use strict'

// Requiere package:
const path = require('path')
const Sequelize = require('sequelize')
const Response = require(path.join(__dirname, '../services/Response'))
const db = require(path.join(__dirname,'../models'))
const Mail = require(path.join(__dirname,'../services/Mail'))
const VerificationCode = require(path.join(__dirname,'../services/Code'))
const response = new Response()
const Op = Sequelize.Op

const index = async(req, res) => {
	const to = req.body.email
	const subject = 'Restauración de contraseña'
	const code = await VerificationCode()

	// Send code to administrator email:
	if (code != 500) {
		db.Administrators.find({
			where : {	[Op.and]:[{email: to}, {state: {[Op.ne]:'inactivo'}}]},
			include : [{
				model : db.Shops,
				as : 'Shops'
			}]
		}).then(dataAdmin => {
			if(dataAdmin == null)
			{
				res.status(response.NFE03.status).json(response.NFE03.msg)
			}
			else
			{
				const text = `<p>Hola ${dataAdmin.name}.</p><p>El código para la restauración de tu contraseña es: <b>${code}</b> </p>`
				const payload = {
					recoveryCode: code,
					id: dataAdmin.Shops[0].idshop
				}
				Mail(to, subject, text)
				res.status(200).json(payload)
			}
		})
	}
	else{
		res.status(response.SEE01.status).json(response.SEE01.msg)
	}
}

module.exports = index

