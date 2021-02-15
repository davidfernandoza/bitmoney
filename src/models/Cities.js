'use strict'

module.exports = (sequelize, DataTypes) => {

	/* -----------------------------------------------------------*/
	/* Definition:																								*/
	/*------------------------------------------------------------*/

	const Cities = sequelize.define('Cities',{
		idcity: {
			primaryKey:true,
			type:DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false
		},
		idstate: {
			type:DataTypes.INTEGER,
			allowNull: false
		},
		idtypepayment:DataTypes.INTEGER,
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
		tableName: 'cities',
		timestamps: true
	})

	/* -----------------------------------------------------------*/
	/* Relations:																									*/
	/*------------------------------------------------------------*/

	Cities.associate = (models) => {

		// M:1 (The States table has the foreign key in this table)
		models.Cities.belongsTo(models.States, {
			foreignKey: 'idstate',
			targetKey: 'idstate',
			as: 'States',
			onUpdate: 'CASCADE'
		})

		// M:1 (The Types_Payments table has the foreign key in this table)
		models.Cities.belongsTo(models.Types_Payments, {
			foreignKey: 'idtypepayment',
			targetKey: 'idtypepayment',
			as: 'Types_Payments',
			onUpdate: 'CASCADE'
		})

		// 1:M (This table has the foreign key in the table Shops)
		models.Cities.hasMany(models.Shops,{
			foreignKey: 'idcity',
			sourceKey: 'idcity',
			as: 'Shops',
			onUpdate: 'CASCADE'
		})

	}
	return Cities
}
