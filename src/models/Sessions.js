'use strict'

module.exports = (sequelize, DataTypes) => {

	/* -----------------------------------------------------------*/
	/* Definition:																								*/
	/*------------------------------------------------------------*/

	const Sessions = sequelize.define('Sessions',{
		idsession: {
			primaryKey:true,
			type:DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false
		},
		idseller: DataTypes.INTEGER,
		idadministrator: DataTypes.INTEGER,
		firebase_token: {
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
		tableName: 'sessions',
		timestamps: true
	})

	/* -----------------------------------------------------------*/
	/* Relations:																									*/
	/*------------------------------------------------------------*/

	Sessions.associate = (models) => {

		// 1:M (The Sellers table has the foreign key in this table)
		models.Sessions.belongsTo(models.Sellers, {
			foreignKey: 'idseller',
			targetKey: 'idseller',
			as: 'Sellers',
			onUpdate: 'CASCADE'
		})

		// 1:M (The Administrators table has the foreign key in this table)
		models.Sessions.belongsTo(models.Administrators, {
			foreignKey: 'idadministrator',
			targetKey: 'idadministrator',
			as: 'Administrators',
			onUpdate: 'CASCADE'
		})

		// 1:M (This table has the foreign key in the table Sales)
		models.Sessions.hasOne(models.Sales, {
			foreignKey: 'idsession',
			sourceKey: 'idsession',
			as: 'Sales',
			onUpdate: 'CASCADE'
		})
	}
	return Sessions
}
