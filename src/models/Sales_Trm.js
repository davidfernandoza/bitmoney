'use strict'

module.exports = (sequelize, DataTypes) => {

	/* -----------------------------------------------------------*/
	/* Definition:																								*/
	/*------------------------------------------------------------*/

	const Sales_Trm = sequelize.define('Sales_Trm',{
		idsaletrm: {
			primaryKey:true,
			type:DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false
		},
		idsale: {
			type:DataTypes.INTEGER,
			allowNull: false
		},
		idtrm: {
			type:DataTypes.INTEGER,
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
		tableName: 'sales_trm',
		timestamps: true
	})

	/* -----------------------------------------------------------*/
	/* Relations:																									*/
	/*------------------------------------------------------------*/

	Sales_Trm.associate = (models) => {

		// M:N (The Sales table has the foreign key in this table)
		models.Sales_Trm.belongsTo(models.Sales, {
			foreignKey: 'idsale',
			targetKey: 'idsale',
			as: 'Sales',
			onUpdate: 'CASCADE'
		})

		// M:N (The Trm table has the foreign key in this table)
		models.Sales_Trm.belongsTo(models.Trm, {
			foreignKey: 'idtrm',
			targetKey: 'idtrm',
			as: 'Trm',
			onUpdate: 'CASCADE'
		})
	}
	return Sales_Trm
}
