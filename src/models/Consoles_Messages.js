'use strict'

module.exports = (sequelize, DataTypes) => {

	/* -----------------------------------------------------------*/
	/* Definition:																								*/
	/*------------------------------------------------------------*/

	const Console_Messages = sequelize.define('Console_Messages',{
		idconsolemessage: {
			primaryKey:true,
			type:DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false
		},
		message: {
			type:DataTypes.TEXT,
			allowNull: false
		},
		status:DataTypes.STRING,
		module: {
			type:DataTypes.STRING,
			allowNull: false
		},
		line: {
			type:DataTypes.STRING,
			allowNull: false
		},
		type: {
			type:DataTypes.ENUM,
			values:['error','alerta', 'mensaje'],
			allowNull: false
		},
		state: {
			type:DataTypes.BOOLEAN,
			defaultValue: true,
			allowNull: false
		},
		created_at: {
			type:DataTypes.DATE,
			allowNull: false
		},
		updated_at:DataTypes.DATE
	},{
		tableName: 'console_messages',
		timestamps: true
	})
	return Console_Messages
}
