'use strict'

module.exports = (sequelize, DataTypes) => {

	/* -----------------------------------------------------------*/
	/* Definition:																								*/
	/*------------------------------------------------------------*/

	const Limits = sequelize.define('Limits',{
		idlimit: {
			primaryKey:true,
			type:DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false
		},
		idcoin: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		identerprise: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		value: {
			type:DataTypes.DOUBLE,
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
		tableName: 'limits',
		timestamps: true
	})

	/* -----------------------------------------------------------*/
	/* Relations:																									*/
	/*------------------------------------------------------------*/

	Limits.associate = (models) => {

		// M:1 (The Coins table has the foreign key in this table)
		models.Limits.belongsTo(models.Coins, {
			foreignKey: 'idcoin',
			targetKey: 'idcoin',
			as: 'Coins',
			onUpdate: 'CASCADE'
		})

		// M:1 (The Enterprises table has the foreign key in this table)
		models.Limits.belongsTo(models.Enterprises, {
			foreignKey: 'identerprise',
			targetKey: 'identerprise',
			as: 'Enterprises',
			onUpdate: 'CASCADE'
		})
	}
	return Limits
}
