'use strict'

// Requiere package:
const path = require('path')
const env = require(path.join(__dirname,'../../config/env'))
const Response = require(path.join(__dirname, '../services/Response'))
const response = new Response()

const index = (req, res, next) => {
	if(!req.headers.http_wlv_token){
		return res.status(response.NVTV02.status).json(response.NVTV02.msg)
	}
	const token = req.headers.http_wlv_token
	if(token != env.staticToken){
		return res.status(response.NVTV02.status).json(response.NVTV02.msg)
	}
	else next()
}

module.exports = index
