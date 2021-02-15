'use strict'

module.exports = (sequelize, DataTypes) => {

	/* -----------------------------------------------------------*/
	/* Definition:																								*/
	/*------------------------------------------------------------*/

	const Types_Payments = sequelize.define('Types_Payments',{
		idtypepayment: {
			primaryKey:true,
			type:DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false
		},
		title: {
			type:DataTypes.STRING,
			allowNull: false
		},
		description: {
			type:DataTypes.TEXT,
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
		tableName: 'types_payments',
		timestamps: true
	})

	/* -----------------------------------------------------------*/
	/* Relations:																									*/
	/*------------------------------------------------------------*/

	Types_Payments.associate = (models) => {

		// 1:M (This table has the foreign key in the table tabla Payments)
		models.Types_Payments.hasMany(models.Payments,{
			foreignKey: 'idtypepayment',
			sourceKey: 'idtypepayment',
			as: 'Payments',
			onUpdate: 'CASCADE'
		})

		// 1:M (This table has the foreign key in the table Cities)
		models.Types_Payments.hasMany(models.Cities,{
			foreignKey: 'idtypepayment',
			sourceKey: 'idtypepayment',
			as: 'Cities',
			onUpdate: 'CASCADE'
		})
	}
	return Types_Payments
}
