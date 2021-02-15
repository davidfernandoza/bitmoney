'use strict'

module.exports = (sequelize, DataTypes) => {

	/* -----------------------------------------------------------*/
	/* Definition:																								*/
	/*------------------------------------------------------------*/

	const Discounts = sequelize.define('Discounts',{
		iddiscount: {
			primaryKey:true,
			type:DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false
		},
		idcoin: {
			type:DataTypes.INTEGER,
			allowNull:false
		},
		value: {
			type:DataTypes.DOUBLE,
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
		tableName: 'discounts',
		timestamps: true
	})

	/* -----------------------------------------------------------*/
	/* Relations:																									*/
	/*------------------------------------------------------------*/

	Discounts.associate = (models) => {

		// 1:1 (The Coins table has the foreign key in this table)
		models.Discounts.belongsTo(models.Coins, {
			foreignKey: 'idcoin',
			targetKey: 'idcoin',
			as: 'Coins',
			onUpdate: 'CASCADE'
		})

		// 1:M (This table has the foreign key in the table Trm)
		models.Discounts.hasMany(models.Trm,{
			foreignKey: 'iddiscount',
			sourceKey: 'iddiscount',
			as: 'Trm',
			onUpdate: 'CASCADE'
		})
	}
	return Discounts
}
