'use strict'

module.exports = (sequelize, DataTypes) => {

	/* -----------------------------------------------------------*/
	/* Definition:																								*/
	/*------------------------------------------------------------*/

	const Transactions = sequelize.define('Transactions',{
		idtransaction: {
			primaryKey:true,
			type:DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false
		},
		idsale: {
			type:DataTypes.INTEGER,
			allowNull: false
		},
		idwallet: {
			type:DataTypes.INTEGER,
			allowNull: false
		},
		hash: {
			type:DataTypes.STRING,
			allowNull: false
		},
		value: {
			type:DataTypes.BIGINT,
			allowNull: false
		},
		in_buffer :{
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false
		},
		state: {
			type:DataTypes.ENUM,
			values:['completa','incompleta','excedida'],
			allowNull: false
		},
		created_at: {
			type:DataTypes.DATE,
			allowNull: false
		},
		updated_at:DataTypes.DATE
	},{
		tableName: 'transactions',
		timestamps: true
	})

	/* -----------------------------------------------------------*/
	/* Relations:																									*/
	/*------------------------------------------------------------*/

	Transactions.associate = (models) => {

		// 1:1 (The Sales table has the foreign key in this table)
		models.Transactions.belongsTo(models.Sales, {
			foreignKey: 'idsale',
			targetKey: 'idsale',
			as: 'Sales',
			onUpdate: 'CASCADE'
		})

		// M:1 (The Wallets table has the foreign key in this table)
		models.Transactions.belongsTo(models.Wallets, {
			foreignKey: 'idwallet',
			targetKey: 'idwallet',
			as: 'Wallets',
			onUpdate: 'CASCADE'
		})

		// 1:1 (This table has the foreign key in the table Payments_Pendings)
		models.Transactions.hasOne(models.Payments_Pendings, {
			foreignKey: 'idtransaction',
			sourceKey: 'idtransaction',
			as: 'Payments_Pendings',
			onUpdate: 'CASCADE'
		})
	}
	return Transactions
}
