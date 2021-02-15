'use strict'

module.exports = (sequelize, DataTypes) => {

	/* -----------------------------------------------------------*/
	/* Definition:																								*/
	/*------------------------------------------------------------*/

	const Countries = sequelize.define('Countries',{
		idcountry: {
			primaryKey:true,
			type:DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false
		},
		name: {
			type:DataTypes.STRING,
			allowNull: false
		},
		prefix: {
			type:DataTypes.STRING,
			allowNull: false
		},
		timezone: {
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
		tableName: 'countries',
		timestamps: true
	})

	/* -----------------------------------------------------------*/
	/* Relations:																									*/
	/*------------------------------------------------------------*/

	Countries.associate = (models) => {

		// 1:M (This table has the foreign key in the table States)
		models.Countries.hasMany(models.States,{
			foreignKey: 'idcountry',
			sourceKey: 'idcountry',
			as: 'States',
			onUpdate: 'CASCADE'
		})

		// M:N (This table has the foreign key in the table CountriesSponsors - Sponsors)
		models.Countries.belongsToMany(models.Sponsors,{
			through: models.Countries_Sponsors,
			foreignKey: 'idcountry',
			sourceKey: 'idcountry',
			as: 'Sponsors',
			onUpdate: 'CASCADE'
		})

		// 1:1 (This table has the foreign key in the table tabla Coins)
		models.Countries.hasOne(models.Coins, {
			foreignKey: 'idcountry',
			sourceKey: 'idcountry',
			as: 'Coins',
			onUpdate: 'CASCADE'
		})
	}
	return Countries
}
