'use strict'

module.exports = (sequelize, DataTypes) => {

	/* -----------------------------------------------------------*/
	/* Definition:																								*/
	/*------------------------------------------------------------*/

	const Programs = sequelize.define('Programs',{
		idprogram: {
			primaryKey:true,
			type:DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false
		},
		title: {
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
		tableName: 'programs',
		timestamps: true
	})

	/* -----------------------------------------------------------*/
	/* Relations:																									*/
	/*------------------------------------------------------------*/

	Programs.associate = (models) => {

		// 1:M (This table has the foreign key in the table Payments)
		models.Programs.hasMany(models.Payments,{
			foreignKey: 'idprogram',
			sourceKey: 'idprogram',
			as: 'Payments',
			onUpdate: 'CASCADE'
		})

		// 1:M (This table has the foreign key in the table Shops)
		models.Programs.hasMany(models.Shops,{
			foreignKey: 'idprogram',
			sourceKey: 'idprogram',
			as: 'Shops',
			onUpdate: 'CASCADE'
		})

		// 1:M (This table has the foreign key in the table Contents)
		models.Programs.hasMany(models.Contents,{
			foreignKey: 'idprogram',
			sourceKey: 'idprogram',
			as: 'Contents',
			onUpdate: 'CASCADE'
		})
	}
	return Programs
}
