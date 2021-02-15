'use strict'

module.exports = (sequelize, DataTypes) => {

	/* -----------------------------------------------------------*/
	/* Definition:																								*/
	/*------------------------------------------------------------*/

	const Shops = sequelize.define('Shops',{
		idshop: {
			primaryKey:true,
			type:DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false
		},
		idadministrator: {
			type:DataTypes.INTEGER,
			allowNull: false
		},
		idbankaccount: DataTypes.INTEGER,
		idsponsor: {
			type:DataTypes.INTEGER,
			allowNull: false
		},
		idprogram: {
			type:DataTypes.INTEGER,
			defaultValue: 1,
			allowNull: false
		},
		identerprise: DataTypes.INTEGER,
		idcity: DataTypes.INTEGER,
		nit: DataTypes.BIGINT,
		name: DataTypes.STRING,
		address: DataTypes.STRING,
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
		tableName: 'shops',
		timestamps: true
	})

	/* -----------------------------------------------------------*/
	/* Relations:																									*/
	/*------------------------------------------------------------*/

	Shops.associate = (models) => {

		// M:1 (The Administrators table has the foreign key in this table)
		models.Shops.belongsTo(models.Administrators, {
			foreignKey: 'idadministrator',
			targetKey: 'idadministrator',
			as: 'Administrators',
			onUpdate: 'CASCADE'
		})

		// M:1 (The Banks_Accounts table has the foreign key in this table)
		models.Shops.belongsTo(models.Banks_Accounts, {
			foreignKey: 'idbankaccount',
			targetKey: 'idbankaccount',
			as: 'Banks_Accounts',
			onUpdate: 'CASCADE'
		})

		// M:1 (The Sponsors table has the foreign key in this table)
		models.Shops.belongsTo(models.Sponsors, {
			foreignKey: 'idsponsor',
			targetKey: 'idsponsor',
			as: 'Sponsors',
			onUpdate: 'CASCADE'
		})

		// M:1 (The Programs table has the foreign key in this table)
		models.Shops.belongsTo(models.Programs, {
			foreignKey: 'idprogram',
			targetKey: 'idprogram',
			as: 'Programs',
			onUpdate: 'CASCADE'
		})

		// M:1 (The Enterprises table has the foreign key in this table)
		models.Shops.belongsTo(models.Enterprises, {
			foreignKey: 'identerprise',
			targetKey: 'identerprise',
			as: 'Enterprises',
			onUpdate: 'CASCADE'
		})

		// M:1 (The Cities table has the foreign key in this table)
		models.Shops.belongsTo(models.Cities, {
			foreignKey: 'idcity',
			targetKey: 'idcity',
			as: 'Cities',
			onUpdate: 'CASCADE'
		})

		// 1:M (This table has the foreign key in the table Payments_Pendings)
		models.Shops.hasMany(models.Payments_Pendings,{
			foreignKey: 'idshop',
			sourceKey: 'idshop',
			as: 'Payments_Pendings',
			onUpdate: 'CASCADE'
		})

		// 1:M (This table has the foreign key in the table Sellers)
		models.Shops.hasMany(models.Sellers,{
			foreignKey: 'idshop',
			sourceKey: 'idshop',
			as: 'Sellers',
			onUpdate: 'CASCADE'
		})

		// 1:M (This table has the foreign key in the table Sales)
		models.Shops.hasMany(models.Sales,{
			foreignKey: 'idshop',
			sourceKey: 'idshop',
			as: 'Sales',
			onUpdate: 'CASCADE'
		})

		// 1:M (This table has the foreign key in the table Payments)
		models.Shops.hasMany(models.Payments,{
			foreignKey: 'idshop',
			sourceKey: 'idshop',
			as: 'Payments',
			onUpdate: 'CASCADE'
		})
	}
	return Shops
}
