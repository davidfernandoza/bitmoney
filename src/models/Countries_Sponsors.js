'use strict'

module.exports = (sequelize, DataTypes) => {

	/* -----------------------------------------------------------*/
	/* Definition:																								*/
	/*------------------------------------------------------------*/

	const Countries_Sponsors = sequelize.define('Countries_Sponsors',{
		idcountrysponsor: {
			primaryKey:true,
			type:DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false
		},
		idcountry: {
			type:DataTypes.INTEGER,
			allowNull: false
		},
		idsponsor: {
			type:DataTypes.INTEGER,
			allowNull: false
		},
		passport: DataTypes.STRING,
		cellphone: {
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
		operatorAliases: false,
		tableName: 'countries_sponsors',
		timestamps: true
	})

	/* -----------------------------------------------------------*/
	/* Relations:																									*/
	/*------------------------------------------------------------*/

	Countries_Sponsors.associate = (models) => {

		// M:N (The Countries table has the foreign key in this table)
		models.Countries_Sponsors.belongsTo(models.Countries, {
			foreignKey: 'idcountry',
			targetKey: 'idcountry',
			as: 'Countries',
			onUpdate: 'CASCADE'
		})

		// M:N (The Sponsors table has the foreign key in this table)
		models.Countries_Sponsors.belongsTo(models.Sponsors, {
			foreignKey: 'idsponsor',
			targetKey: 'idsponsor',
			as: 'Sponsors',
			onUpdate: 'CASCADE'
		})
	}
	return Countries_Sponsors
}
