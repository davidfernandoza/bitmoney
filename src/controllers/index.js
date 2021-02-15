'use strict'

// Requiere package:
const fs = require('fs')
const path = require('path')

// Read all files in folder:
const files = fs.readdirSync(__dirname).filter(file => {
	return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js')
})
let fileName = null

// The files are iterated getting:
files.forEach((file) => {

	// Every file name is filtered:
	fileName = path.basename(file,'.js')
	if (fileName !== 'index')
	{

		// Export each file in the folder, except the index:
		exports[fileName] = require('./'+fileName)
	}
})

