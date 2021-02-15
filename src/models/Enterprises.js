'use strict'

module.exports = (sequelize, DataTypes) => {

	/* -----------------------------------------------------------*/
	/* Definition:																								*/
	/*------------------------------------------------------------*/

	const Enterprises = sequelize.define('Enterprises',{
		identerprise: {
			primaryKey:true,
			type:DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false
		},
		name: {
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
		tableName: 'enterprises',
		timestamps: true
	})

	/* -----------------------------------------------------------*/
	/* Relations:																									*/
	/*------------------------------------------------------------*/

	Enterprises.associate = (models) => {

		// 1:M (This table has the foreign key in the table Wallets)
		models.Enterprises.hasMany(models.Wallets,{
			foreignKey: 'identerprise',
			sourceKey: 'identerprise',
			as: 'Wallets',
			onUpdate: 'CASCADE'
		})

		// 1:M (This table has the foreign key in the table Shops)
		models.Enterprises.hasMany(models.Shops,{
			foreignKey: 'identerprise',
			sourceKey: 'identerprise',
			as: 'Shops',
			onUpdate: 'CASCADE',
		})

		// 1:M (This table has the foreign key in the table Limits)
		models.Enterprises.hasMany(models.Limits,{
			foreignKey: 'identerprise',
			sourceKey: 'identerprise',
			as: 'Limits',
			onUpdate: 'CASCADE',
		})
	}
	return Enterprises
}
