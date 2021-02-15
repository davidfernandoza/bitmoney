'use strict'

module.exports = (sequelize, DataTypes) => {

	/* -----------------------------------------------------------*/
	/* Definition:																								*/
	/*------------------------------------------------------------*/

	const Invalid_Tokens = sequelize.define('Invalid_Tokens',{
		idinvalidtoken: {
			primaryKey:true,
			type:DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false
		},
		token: {
			type:DataTypes.STRING,
			allowNull: false
		},
		created_at: {
			type:DataTypes.DATE,
			allowNull: false
		},
		updated_at:DataTypes.DATE
	},{
		tableName: 'invalid_tokens',
		timestamps: true
	})
	return Invalid_Tokens
}
