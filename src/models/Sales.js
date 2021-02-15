'use strict'

module.exports = (sequelize, DataTypes) => {

	/* -----------------------------------------------------------*/
	/* Definition:																								*/
	/*------------------------------------------------------------*/

	const Sales = sequelize.define('Sales',{
		idsale: {
			primaryKey:true,
			type:DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false
		},
		idseller: DataTypes.INTEGER,
		idadministrator: DataTypes.INTEGER,
		idwallet: {
			type:DataTypes.INTEGER,
			allowNull: false
		},
		idshop: {
			type:DataTypes.INTEGER,
			allowNull: false
		},
		idcoin: {
			type:DataTypes.INTEGER,
			allowNull: false
		},
		idsession: {
			type:DataTypes.INTEGER,
			allowNull: false
		},
		value: {
			type:DataTypes.DOUBLE,
			allowNull: false
		},
		amount: {
			type:DataTypes.BIGINT,
			allowNull: false
		},
		expiration: {
			type:DataTypes.BIGINT,
			allowNull: false
		},
		img: DataTypes.STRING,
		state: {
			type:DataTypes.ENUM,
			values:['confirmado','espera','cancelado','reliquidado'],
			allowNull: false
		},
		created_at: {
			type:DataTypes.DATE,
			allowNull: false
		},
		updated_at:DataTypes.DATE
	},{
		tableName: 'sales',
		timestamps: true
	})

	/* -----------------------------------------------------------*/
	/* Relations:																									*/
	/*------------------------------------------------------------*/

	Sales.associate = (models) => {

		// M:1 (The Sellers table has the foreign key in this table)
		models.Sales.belongsTo(models.Sellers, {
			foreignKey: 'idseller',
			targetKey: 'idseller',
			as: 'Sellers',
			onUpdate: 'CASCADE'
		})

		// M:1 (The Administrators table has the foreign key in this table)
		models.Sales.belongsTo(models.Administrators, {
			foreignKey: 'idadministrator',
			targetKey: 'idadministrator',
			as: 'Administrators',
			onUpdate: 'CASCADE'
		})

		// M:1 (The Wallets table has the foreign key in this table)
		models.Sales.belongsTo(models.Wallets, {
			foreignKey: 'idwallet',
			targetKey: 'idwallet',
			as: 'Wallets',
			onUpdate: 'CASCADE'
		})

		// M:1 (The Shops table has the foreign key in this table)
		models.Sales.belongsTo(models.Shops, {
			foreignKey: 'idshop',
			targetKey: 'idshop',
			as: 'Shops',
			onUpdate: 'CASCADE'
		})

		// M:1 (The Coins table has the foreign key in this table)
		models.Sales.belongsTo(models.Coins, {
			foreignKey: 'idcoin',
			targetKey: 'idcoin',
			as: 'Coins',
			onUpdate: 'CASCADE'
		})

		// M:1 (The Sessions table has the foreign key in this table)
		models.Sales.belongsTo(models.Sessions, {
			foreignKey: 'idsession',
			targetKey: 'idsession',
			as: 'Sessions',
			onUpdate: 'CASCADE'
		})

		// 1:1 (This table has the foreign key in the table Transactions)
		models.Sales.hasOne(models.Transactions, {
			foreignKey: 'idsale',
			sourceKey: 'idsale',
			as: 'Transactions',
			onUpdate: 'CASCADE'
		})

		// M:N (This table has the foreign key in the table Sales_Trm - Trm)
		models.Sales.belongsToMany(models.Trm,{
			through: models.Sales_Trm,
			foreignKey: 'idsale',
			sourceKey: 'idsale',
			as: 'Trm',
			onUpdate: 'CASCADE'
		})
	}
	return Sales
}
