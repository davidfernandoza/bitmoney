'use strict'

module.exports = (sequelize, DataTypes) => {

	/* -----------------------------------------------------------*/
	/* Definition:																								*/
	/*------------------------------------------------------------*/

	const Txt = sequelize.define('Txt',{
		idtxt: {
			primaryKey:true,
			type:DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false
		},
		url: {
			type:DataTypes.STRING,
			allowNull: false,
			unique: true
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
		tableName: 'txt',
		timestamps: true
	})

	/* -----------------------------------------------------------*/
	/* Relations:																									*/
	/*------------------------------------------------------------*/

	Txt.associate = (models) => {

		// 1:M (This table has the foreign key in the table Payments)
		models.Txt.hasMany(models.Payments,{
			foreignKey: 'idtxt',
			sourceKey: 'idtxt',
			as: 'Payments',
			onUpdate: 'CASCADE'
		})
	}
	return Txt
}
