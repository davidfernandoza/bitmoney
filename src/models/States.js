'use strict'

module.exports = (sequelize, DataTypes) => {

	/* -----------------------------------------------------------*/
	/* Definition:																								*/
	/*------------------------------------------------------------*/

	const States = sequelize.define('States',{
		idstate: {
			primaryKey:true,
			type:DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false
		},
		idcountry: {
			type:DataTypes.INTEGER,
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
		tableName: 'states',
		timestamps: true
	})

	/* -----------------------------------------------------------*/
	/* Relations:																									*/
	/*------------------------------------------------------------*/

	States.associate = (models) => {

		// M:1 (The Countries table has the foreign key in this table)
		models.States.belongsTo(models.Countries, {
			foreignKey: 'idcountry',
			targetKey: 'idcountry',
			as: 'Countries',
			onUpdate: 'CASCADE'
		})

		// 1:M (This table has the foreign key in the table Cities)
		models.States.hasMany(models.Cities,{
			foreignKey: 'idstate',
			sourceKey: 'idstate',
			as: 'Cities',
			onUpdate: 'CASCADE'
		})
	}
	return States
}
