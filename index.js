'use strict'

// Requiere package:
const path = require('path')
const app = require(path.join(__dirname, './config/app'))
const env = require(path.join(__dirname, './config/env'))

// Server:
app.listen(env.port)
