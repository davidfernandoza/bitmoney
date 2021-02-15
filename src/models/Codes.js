'use strict'

module.exports = (sequelize, DataTypes) => {

	/* -----------------------------------------------------------*/
	/* Definition:																								*/
	/*------------------------------------------------------------*/

	const Codes = sequelize.define('Codes',{
		idcode: {
			primaryKey:true,
			type:DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false
		},
		idadministrator: {
			type:DataTypes.INTEGER,
			allowNull: false
		},
		code: {
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
		tableName: 'codes',
		timestamps: true
	})

	/* -----------------------------------------------------------*/
	/* Relations:																									*/
	/*------------------------------------------------------------*/

	Codes.associate = (models) => {

		// 1:1 (The Administrators table has the foreign key in this table)
		models.Codes.belongsTo(models.Administrators, {
			foreignKey: 'idadministrator',
			targetKey: 'idadministrator',
			as: 'Administrators',
			onUpdate: 'CASCADE'
		})
	}
	return Codes
}
