'use strict'

module.exports = (sequelize, DataTypes) => {

	/* -----------------------------------------------------------*/
	/* Definition:																								*/
	/*------------------------------------------------------------*/

	const Wallets = sequelize.define('Wallets',{
		idwallet: {
			primaryKey:true,
			type:DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false
		},
		idcoin: {
			type:DataTypes.INTEGER,
			allowNull: false
		},
		identerprise: {
			type:DataTypes.INTEGER,
			allowNull: false
		},
		idadministrator: DataTypes.INTEGER,
		idseller: DataTypes.INTEGER,
		address: {
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
		tableName: 'wallets',
		timestamps: true
	})

	/* -----------------------------------------------------------*/
	/* Relations:																									*/
	/*------------------------------------------------------------*/

	Wallets.associate = (models) => {

		// M:1 (The Coins table has the foreign key in this table)
		models.Wallets.belongsTo(models.Coins, {
			foreignKey: 'idcoin',
			targetKey: 'idcoin',
			as: 'Coins',
			onUpdate: 'CASCADE'
		})

		// M:1 (The Enterprises table has the foreign key in this table)
		models.Wallets.belongsTo(models.Enterprises, {
			foreignKey: 'identerprise',
			targetKey: 'identerprise',
			as: 'Enterprises',
			onUpdate: 'CASCADE'
		})

		// M:1 (The Administrators table has the foreign key in this table)
		models.Wallets.belongsTo(models.Administrators, {
			foreignKey: 'idadministrator',
			targetKey: 'idadministrator',
			as: 'Administrators',
			onUpdate: 'CASCADE'
		})

		// M:1 (The Sellers table has the foreign key in this table)
		models.Wallets.belongsTo(models.Sellers, {
			foreignKey: 'idseller',
			targetKey: 'idseller',
			as: 'Sellers',
			onUpdate: 'CASCADE'
		})

		// 1:M (This table has the foreign key in the table Sales)
		models.Wallets.hasMany(models.Sales,{
			foreignKey: 'idwallet',
			sourceKey: 'idwallet',
			as: 'Sales',
			onUpdate: 'CASCADE'
		})

		// 1:M (This table has the foreign key in the table Transactios)
		models.Wallets.hasMany(models.Transactions,{
			foreignKey: 'idwallet',
			sourceKey: 'idwallet',
			as: 'Transactions',
			onUpdate: 'CASCADE'
		})
	}
	return Wallets
}
