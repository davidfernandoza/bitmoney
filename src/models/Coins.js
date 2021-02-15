'use strict'

module.exports = (sequelize, DataTypes) => {

	/* -----------------------------------------------------------*/
	/* Definition:																								*/
	/*------------------------------------------------------------*/

	const Coins = sequelize.define('Coins',{
		idcoin: {
			primaryKey:true,
			type:DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false
		},
		idcountry: DataTypes.INTEGER,
		name: {
			type:DataTypes.STRING,
			allowNull: false
		},
		alias: {
			type:DataTypes.STRING,
			allowNull: false
		},
		cripto_num:DataTypes.INTEGER,
		type: {
			type:DataTypes.ENUM,
			values:['cripto','estandar'],
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
		tableName: 'coins',
		timestamps: true
	})

	/* -----------------------------------------------------------*/
	/* Relations:																									*/
	/*------------------------------------------------------------*/

	Coins.associate = (models) => {

		// 1:1 (The Countries table has the foreign key in this table)
		models.Coins.belongsTo(models.Countries, {
			foreignKey: 'idcountry',
			targetKey: 'idcountry',
			as: 'Countries',
			onUpdate: 'CASCADE'
		})

		// 1:1 (This table has the foreign key in the table Discounts)
		models.Coins.hasOne(models.Discounts, {
			foreignKey: 'idcoin',
			sourceKey: 'idcoin',
			as: 'Discounts',
			onUpdate: 'CASCADE'
		})

		// 1:M (This table has the foreign key in the table Banks_Accounts)
		models.Coins.hasMany(models.Banks_Accounts,{
			foreignKey: 'idcoin',
			sourceKey: 'idcoin',
			as: 'Banks_Accounts',
			onUpdate: 'CASCADE'
		})

		// 1:M (This table has the foreign key in the table Wallets)
		models.Coins.hasMany(models.Wallets,{
			foreignKey: 'idcoin',
			sourceKey: 'idcoin',
			as: 'Wallets',
			onUpdate: 'CASCADE'
		})

		// 1:M (This table has the foreign key in the table Sales)
		models.Coins.hasMany(models.Sales,{
			foreignKey: 'idcoin',
			sourceKey: 'idcoin',
			as: 'Sales',
			onUpdate: 'CASCADE'
		})

		// 1:M (This table has the foreign key in the table Trm)
		models.Coins.hasMany(models.Trm,{
			foreignKey: 'idcoin',
			sourceKey: 'idcoin',
			as: 'Trm',
			onUpdate: 'CASCADE'
		})

		// 1:M (This table has the foreign key in the table Contents)
		models.Coins.hasMany(models.Contents,{
			foreignKey: 'idcoin',
			sourceKey: 'idcoin',
			as: 'Contents',
			onUpdate: 'CASCADE'
		})

		// 1:M (This table has the foreign key in the table Limits)
		models.Coins.hasMany(models.Limits,{
			foreignKey: 'idcoin',
			sourceKey: 'idcoin',
			as: 'Limits',
			onUpdate: 'CASCADE'
		})
	}
	return Coins
}
