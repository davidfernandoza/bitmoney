'use strict'

module.exports = (sequelize, DataTypes) => {

	/* -----------------------------------------------------------*/
	/* Definition:																								*/
	/*------------------------------------------------------------*/

	const Banks = sequelize.define('Banks',{
		idbank: {
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
		tableName: 'banks',
		timestamps: true
	})

	/* -----------------------------------------------------------*/
	/* Relations:																									*/
	/*------------------------------------------------------------*/

	Banks.associate = (models) => {

		// 1:M (This table has the foreign key in the table Banks_Accounts)
		models.Banks.hasMany(models.Banks_Accounts,{
			foreignKey: 'idbank',
			sourceKey: 'idbank',
			as: 'Banks_Accounts',
			onUpdate: 'CASCADE'
		})
	}
	return Banks
}

