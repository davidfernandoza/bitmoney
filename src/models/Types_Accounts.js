'use strict'

module.exports = (sequelize, DataTypes) => {

	/* -----------------------------------------------------------*/
	/* Definition:																								*/
	/*------------------------------------------------------------*/

	const Types_Accounts = sequelize.define('Types_Accounts',{
		idtypeaccount: {
			primaryKey:true,
			type:DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false
		},
		title: {
			type:DataTypes.STRING,
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
		tableName: 'types_accounts',
		timestamps: true
	})

	/* -----------------------------------------------------------*/
	/* Relations:																									*/
	/*------------------------------------------------------------*/

	Types_Accounts.associate = (models) => {

		// 1:M (This table has the foreign key in the table Banks_Accounts)
		models.Types_Accounts.hasMany(models.Banks_Accounts,{
			foreignKey: 'idtypeaccount',
			sourceKey: 'idtypeaccount',
			as: 'Banks_Accounts',
			onUpdate: 'CASCADE'
		})
	}
	return Types_Accounts
}
