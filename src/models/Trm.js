'use strict'

module.exports = (sequelize, DataTypes) => {

	/* -----------------------------------------------------------*/
	/* Definition:																								*/
	/*------------------------------------------------------------*/

	const Trm = sequelize.define('Trm',{
		idtrm: {
			primaryKey:true,
			type:DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false
		},
		iddiscount:DataTypes.INTEGER,
		idcoin: {
			type:DataTypes.INTEGER,
			allowNull: false
		},
		value: {
			type:DataTypes.DOUBLE,
			allowNull: false
		},
		expiration: {
			type:DataTypes.BIGINT,
			allowNull: false
		},
		type: {
			type:DataTypes.ENUM,
			values:['cripto','estandar', 'base'],
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
		tableName: 'trm',
		timestamps: true
	})

	/* -----------------------------------------------------------*/
	/* Relations:																									*/
	/*------------------------------------------------------------*/

	Trm.associate = (models) => {

		// M:1 (The Discounts table has the foreign key in this table)
		models.Trm.belongsTo(models.Discounts, {
			foreignKey: 'iddiscount',
			targetKey: 'iddiscount',
			as: 'Discounts',
			onUpdate: 'CASCADE'
		})

		// M:1 (The Coins table has the foreign key in this table)
		models.Trm.belongsTo(models.Coins, {
			foreignKey: 'idcoin',
			targetKey: 'idcoin',
			as: 'Coins',
			onUpdate: 'CASCADE'
		})

		// M:N (This table has the foreign key in the table Sales_Trm - Sales)
		models.Trm.belongsToMany(models.Sales, {
			through: models.Sales_Trm,
			foreignKey: 'idtrm',
			sourceKey: 'idtrm',
			as: 'Sales',
			onUpdate: 'CASCADE'
		})
	}
	return Trm
}
