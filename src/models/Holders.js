'use strict'

module.exports = (sequelize, DataTypes) => {

	/* -----------------------------------------------------------*/
	/* Definition:																								*/
	/*------------------------------------------------------------*/

	const Holders = sequelize.define('Holders',{
		idholder: {
			primaryKey:true,
			type:DataTypes.INTEGER,
			autoIncrement: true,
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
		email: DataTypes.STRING,
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
		tableName: 'holders',
		timestamps: true
	})

	/* -----------------------------------------------------------*/
	/* Relations:																									*/
	/*------------------------------------------------------------*/

	Holders.associate = (models) => {

		// 1:M (This table has the foreign key in the table Banks_Accounts)
		models.Holders.hasMany(models.Banks_Accounts,{
			foreignKey: 'idholder',
			sourceKey: 'idholder',
			as: 'Banks_Accounts',
			onUpdate: 'CASCADE'
		})
	}
	return Holders
}
