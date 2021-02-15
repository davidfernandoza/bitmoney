'use strict'

// Requiere package:
const fs        		= require('fs')
const path      		= require('path')
const Sequelize 		= require('sequelize')
const basename  		= path.basename(__filename)
const {enviroment} 	= require(path.join(__dirname,'../../config/env'))
const config    		= require(path.join(__dirname,'../../config/database'))[enviroment]
const	sequelize 		= new Sequelize(config.database, config.username, config.password, config)
const db        		= {}

// Read all files javascript and set the model to the object db:
fs.readdirSync(__dirname).filter(file => {
	return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
}).forEach(file => {

	// The sequelize options are transferred to the model:
	const model = sequelize['import'](path.join(__dirname, file))
	db[model.name] = model
})

// Check within each model if there is a relationship with other tables:
Object.keys(db).forEach(modelName => {

	// If there is a relation, it will be transferred to the function to "associate" all the models:
	if (db[modelName].associate) {
		db[modelName].associate(db)
	}
})

// The options of sequelize are transferred to object "db":
db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
