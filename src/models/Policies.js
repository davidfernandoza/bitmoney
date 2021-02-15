'use strict'

module.exports = (sequelize, DataTypes) => {

	/* -----------------------------------------------------------*/
	/* Definition:																								*/
	/*------------------------------------------------------------*/

	const Policies = sequelize.define('Policies',{
		idpolicy: {
			primaryKey:true,
			type:DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false
		},
		title: {
			type:DataTypes.STRING,
			allowNull: false
		},
		description: {
			type:DataTypes.TEXT,
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
		tableName: 'policies',
		timestamps: true
	})

	/* -----------------------------------------------------------*/
	/* Relations:																									*/
	/*------------------------------------------------------------*/

	Policies.associate = (models) => {

		// M:N (This table has the foreign key in the table Approbations - Administrators)
		models.Policies.belongsToMany(models.Administrators,{
			through: models.Approbations,
			foreignKey: 'idpolicy',
			sourceKey: 'idpolicy',
			as: 'Administrators',
			onUpdate: 'CASCADE'
		})

		// M:N (This table has the foreign key in the table Approbations - Seller)
		models.Policies.belongsToMany(models.Sellers,{
			through: models.Approbations,
			foreignKey: 'idpolicy',
			sourceKey: 'idpolicy',
			as: 'Sellers',
			onUpdate: 'CASCADE'
		})
	}
	return Policies
}
