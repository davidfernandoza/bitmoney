'use strict'

// Requiere package:
const path = require('path')
const Express = require('express')
const bodyParser = require('body-parser')
const blockchains = require(path.join(__dirname,'../src/services/blockchains'))
const expirationPayments = require(path.join(__dirname,'../src/controllers'))
const Response = require(path.join(__dirname, '../src/services/Response'))
const response = new Response()
const app = Express()

// Initiation of blockchains:
blockchains.Bitcoin(false)

// Initiation Expiration payments controller:
expirationPayments.ExpirationPaymentsController()

// Request of ruters:
const api = require(path.join(__dirname, '../src/routes/api'))

// Middlewares:
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())// Toma la informacion y la parsea a JSON.

// Routes register:
app.use('/api', api)

// Latest Middleware for error:
app.use((req, res) => {
	res.status(response.NVM01.status).send(response.NVM01.msg)
})

module.exports = app
