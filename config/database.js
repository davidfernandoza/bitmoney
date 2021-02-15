'use strict'

// Requiere package:
const path = require('path')
const database = 'postgres'
const Sequelize = require('sequelize')
const env = require(path.join(__dirname,'./env'))
const Op = Sequelize.Op

module.exports = {
	development: {
		username: env.username,
		password: env.password,
		database: env.database,
		host: 		env.host,
		dialect: database,
		operatorsAliases: Op,
		define:{
			freezeTableName:true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			deletedAt: 'deleted_at',
			charset: 'UTF-8',
			findByPrimary: 'String'
		}
	},
	test: {
		username: env.username,
		password: '0123456789',
		database: 'test_bitmoney',
		host: 		env.host,
		dialect: database,
		operatorsAliases: Op,
		define:{
			freezeTableName:true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			deletedAt: 'deleted_at',
			charset: 'UTF-8',
			findByPrimary: 'String'
		}
	},
	production: {
		username: env.username,
		password: env.password,
		database: env.database,
		host: 		env.host,
		dialect: 	database,
		operatorsAliases: Op,
		logging: false,
		define:{
			freezeTableName:true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			deletedAt: 'deleted_at',
			charset: 'UTF-8',
			findByPrimary: 'String'
		}
	}
}





