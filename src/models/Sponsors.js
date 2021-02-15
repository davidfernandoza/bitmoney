'use strict'

module.exports = (sequelize, DataTypes) => {

	/* -----------------------------------------------------------*/
	/* Definition:																								*/
	/*------------------------------------------------------------*/

	const Sponsors = sequelize.define('Sponsors',{
		idsponsor: {
			primaryKey:true,
			type:DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false
		},
		pin: {
			type:DataTypes.STRING,
			allowNull: false
		},
		document: {
			type:DataTypes.STRING,
			allowNull: false
		},
		name: {
			type:DataTypes.STRING,
			allowNull: false
		},
		email: {
			type:DataTypes.STRING,
			allowNull: false
		},
		password: {
			type:DataTypes.STRING,
			allowNull: false
		},
		type: {
			type:DataTypes.ENUM,
			values:['administrador','soporte'],
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
		tableName: 'sponsors',
		timestamps: true
	})

	/* -----------------------------------------------------------*/
	/* Relations:																									*/
	/*------------------------------------------------------------*/

	Sponsors.associate = (models) => {

		// 1:M (This table has the foreign key in the table Shops)
		models.Sponsors.hasMany(models.Shops,{
			foreignKey: 'idsponsor',
			sourceKey: 'idsponsor',
			as: 'Shops',
			onUpdate: 'CASCADE'
		})

		// 1:M (This table has the foreign key in the table Banks_Accounts)
		models.Sponsors.hasMany(models.Banks_Accounts,{
			foreignKey: 'idsponsor',
			sourceKey: 'idsponsor',
			as: 'Banks_Accounts',
			onUpdate: 'CASCADE'
		})

		// M:N (This table has the foreign key in the table Countries_Sponsors - Countries)
		models.Sponsors.belongsToMany(models.Countries,{
			through: models.Countries_Sponsors,
			foreignKey: 'idsponsor',
			sourceKey: 'idsponsor',
			as: 'Countries',
			onUpdate: 'CASCADE'
		})
	}
	return Sponsors
}
