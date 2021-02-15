'use strict'

module.exports = (sequelize, DataTypes) => {

	/* -----------------------------------------------------------*/
	/* Definition:																								*/
	/*------------------------------------------------------------*/

	const Approbations = sequelize.define('Approbations',{
		idapprobation: {
			primaryKey:true,
			type:DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false
		},
		idseller: DataTypes.INTEGER,
		idadministrator: DataTypes.INTEGER,
		idpolicy: {
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
		tableName: 'approbations',
		timestamps: true
	})

	/* -----------------------------------------------------------*/
	/* Relations:																									*/
	/*------------------------------------------------------------*/

	Approbations.associate = (models) => {

		// M:N (The Sellers table has the foreign key in this table)
		models.Approbations.belongsTo(models.Sellers, {
			foreignKey: 'idseller',
			targetKey: 'idseller',
			as: 'Sellers',
			onUpdate: 'CASCADE'
		})

		// M:N (The Administrators table has the foreign key in this table)
		models.Approbations.belongsTo(models.Administrators, {
			foreignKey: 'idadministrator',
			targetKey: 'idadministrator',
			as: 'Administrators',
			onUpdate: 'CASCADE'
		})

		// M:N (The Policies table has the foreign key in this table)
		models.Approbations.belongsTo(models.Policies, {
			foreignKey: 'idpolicy',
			targetKey: 'idpolicy',
			as: 'Policies',
			onUpdate: 'CASCADE'
		})
	}
	return Approbations
}
