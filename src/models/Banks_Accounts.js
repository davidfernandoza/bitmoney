'use strict'

module.exports = (sequelize, DataTypes) => {

	/* -----------------------------------------------------------*/
	/* Definition:																								*/
	/*------------------------------------------------------------*/

	const Banks_Accounts = sequelize.define('Banks_Accounts',{
		idbankaccount: {
			primaryKey:true,
			type:DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false
		},
		idtypeaccount: {
			type:DataTypes.INTEGER,
			allowNull: false
		},
		idbank: {
			type:DataTypes.INTEGER,
			allowNull: false
		},
		idcoin: {
			type:DataTypes.INTEGER,
			allowNull: false
		},
		idsponsor:DataTypes.INTEGER,
		idholder:DataTypes.INTEGER,
		num: {
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
		tableName: 'banks_accounts',
		timestamps: true
	})

	/* -----------------------------------------------------------*/
	/* Relations:																									*/
	/*------------------------------------------------------------*/

	Banks_Accounts.associate = (models) => {

		// M:1 (The Types_Accounts table has the foreign key in this table)
		models.Banks_Accounts.belongsTo(models.Types_Accounts, {
			foreignKey: 'idtypeaccount',
			targetKey: 'idtypeaccount',
			as: 'Types_Accounts',
			onUpdate: 'CASCADE'
		})

		// M:1 (The Banks table has the foreign key in this table)
		models.Banks_Accounts.belongsTo(models.Banks, {
			foreignKey: 'idbank',
			targetKey: 'idbank',
			as: 'Banks',
			onUpdate: 'CASCADE'
		})

		// M:1 (The Coins table has the foreign key in this table)
		models.Banks_Accounts.belongsTo(models.Coins, {
			foreignKey: 'idcoin',
			targetKey: 'idcoin',
			as: 'Coins',
			onUpdate: 'CASCADE'
		})

		// M:1 (The Sponsors table has the foreign key in this table)
		models.Banks_Accounts.belongsTo(models.Sponsors, {
			foreignKey: 'idsponsor',
			targetKey: 'idsponsor',
			as: 'Sponsors',
			onUpdate: 'CASCADE'
		})

		// M:1 (The Holders table has the foreign key in this table)
		models.Banks_Accounts.belongsTo(models.Holders, {
			foreignKey: 'idholder',
			targetKey: 'idholder',
			as: 'Holders',
			onUpdate: 'CASCADE'
		})

		// 1:M (This table has the foreign key in the table Payments)
		models.Banks_Accounts.hasMany(models.Payments,{
			foreignKey: 'idbankaccount',
			sourceKey: 'idbankaccount',
			as: 'Payments',
			onUpdate: 'CASCADE'
		})

		// 1:M (This table has the foreign key in the table Shops)
		models.Banks_Accounts.hasMany(models.Shops, {
			foreignKey: 'idbankaccount',
			sourceKey: 'idbankaccount',
			as: 'Shops',
			onUpdate: 'CASCADE'
		})
	}
	return Banks_Accounts
}
