'use strict'

// Requiere package:
const path = require('path')
const moment = require('moment')
const emitter = require('events')
const Pg_Pubsub = require('pg-pubsub')
const blockchainSocket = require('blockchain.info/Socket')
const env = require(path.join(__dirname, '../../../config/env'))
const db = require(path.join(__dirname,'../../models'))
const reliquidated = require(path.join(__dirname,'../../controllers/ReliquidatedController'))
const transactions = require(path.join(__dirname,'../../controllers/TransactionsController'))
const Console_Messages = require(path.join(__dirname,'../Console_Messages'))
const consoleMessages = new Console_Messages()
const pubsubInstance = new Pg_Pubsub(`postgres://${env.username}:${env.password}@${env.host}/${env.database}`)
let count = 0

const  index = (close) => {
	const socketBlockchainInfo = new blockchainSocket({ network: 3 }) // TODO: temporal network: 3
	if (close == true) {
		socketBlockchainInfo.close()
		socketBlockchainInfo.onClose(()=>{
			index(false)
		})
	}
	else{

		// List of wallets:
		db.Wallets.findAll({
			where:{idcoin: 1},
			attributes:['idwallet','address']
		}).then(walletsData => {

			let payload = {}
			if (walletsData != null && walletsData != '') {
				let ids = [], wallet=[]
				for (let i = 0; i < walletsData.length; i++) {
					wallet[i] = walletsData[i].address
					ids[i] = walletsData[i].idwallet
				}

				// Open events listeners for wallets quantity
				emitter.EventEmitter.defaultMaxListeners = walletsData.length + 1

				// Reload index if not openig the socket:
				const flow = setTimeout(index, 60000, true)

				// Open Socket:
				socketBlockchainInfo.onOpen(()=>{
					payload = {
						message: 'Conexion abierta con blockchain.info',
						module: __filename,
						line:	'45:47',
						type:	'mensaje'
					}
					consoleMessages.create(payload)
					clearTimeout(flow)
				})

				// Get transactions of Blockchain.info:
				socketBlockchainInfo.onTransaction(dataTransaction => {
					processTransaction(dataTransaction.out, dataTransaction.hash,dataTransaction.time, wallet, ids)
				},{addresses:wallet})

			}
			else {
				setTimeout(index, 60000, true)

				if (count == 0) {
					// Error wallets:
					payload = {
						message: 'Billeteras no encontradas.',
						module: __filename,
						line:	'29:31',
						type:	'error'
					}
					consoleMessages.create(payload)
					count += 1
				}
			}
		})
	}

	// Function that processes the transaction:
	const processTransaction = (outputs, hash, time, wallets, idWallets) => {

		let idx = ''
		let payload = {}

		for (let i = 0; i < outputs.length; i++) {

			// Find the associated wallet in the transaction:
			idx = wallets.indexOf(outputs[i].addr)

			if (idx != -1) {

				// Check if there is a sale waiting for a payment:
				db.Sales.find({
					where:{idwallet: idWallets[idx], state: 'espera'},
					lim: 1,
					order: [['created_at', 'DESC']]
				}).then(dataSales =>{
					if (dataSales != null && dataSales != '') {

						// Reliquidated expired transaction:
						if (moment().unix() > dataSales.expiration) {
							reliquidated(dataSales.idsale, dataSales.idcoin, outputs[i], dataSales, hash, time,['bitcoin', 'BTC'], false)
						}
						else{

							// The sale is confirmed:
							transactions(outputs[i], dataSales, hash, time, ['bitcoin', 'BTC'], true)
						}
					}
					else{

						// Transaction alert without associated sale:
						payload = {
							message: `Transacción sin venta asociada (Address: ${outputs[i].addr}, Value: ${outputs[i].value} Time UNIX: ${time} Hash: ${hash})`,
							module: __filename,
							line:	'97',
							type:	'alerta'
						}
						consoleMessages.create(payload)
					}
				})
			}
		}
	}
}

// Pub / Sub -> POSTREGRESQL Wallets Notification:
pubsubInstance.addChannel('new_wallet', () => {
	index(true)
})

module.exports = index
