'use strict'

// Requiere package:
const path = require('path')
const Response = require(path.join(__dirname, '../services/Response'))
const db = require(path.join(__dirname, '../models/'))
const response = new Response()

const index = async(req, res) => {
	const idshop = req.idshop
	const token = req.token
	const coin = await db.Shops.find({
		where: {idshop: idshop},
		attributes: ['idshop'],
		include:[
			{
				model : db.Banks_Accounts,
				as : 'Banks_Accounts',
				where: {state: true},
				attributes: ['num'],
				required: false,
				include : [
					{
						model : db.Coins,
						where: {state: true},
						attributes: ['idcoin'],
						required: false,
						as : 'Coins'
					}
				]
			}
		]
	})

	if (coin.Banks_Accounts != null) {
		let programs = null
		const idCoin = coin.Banks_Accounts.Coins.idcoin
		const program = await db.Programs.findAll({
			attributes: [['idprogram','id'],'title',['state','enable']],
			include : [
				{
					model : db.Shops,
					as : 'Shops',
					where:{idshop:req.idshop},
					attributes: ['idprogram'],
					required: false
				},
				{
					model : db.Contents,
					as : 'Contents',
					where:{idcoin:idCoin},
					required: true
				}
			]
		}).then(dataStates => {
			return dataStates
		})

		if (program != '') {

			// Refactored response:
			programs = program.map(item =>{
				const programData = {}
				programData.id = 				item.dataValues.id
				programData.title = 		item.dataValues.title
				programData.content = 	item.Contents[0].content
				programData.enable = 		item.dataValues.enable

				if(item.Shops != ''){
					programData.select = true
				}
				else{
					programData.select = false
				}
				return programData
			})
		}
		const payload = {
			options: programs,
			token: token
		}
		res.status(200).json(payload)
	}
	else{
		res.status(response.SEE01.status).json(response.SEE01.msg)
	}
}

module.exports = index

