'use strict'

module.exports = (sequelize, DataTypes) => {

	/* -----------------------------------------------------------*/
	/* Definition:																								*/
	/*------------------------------------------------------------*/

	const Payments_Pendings = sequelize.define('Payments_Pendings',{
		idpaymentpending: {
			primaryKey:true,
			type:DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false
		},
		idpayment: DataTypes.INTEGER,
		idshop: {
			type:DataTypes.INTEGER,
			allowNull: false
		},
		idtransaction: {
			type:DataTypes.INTEGER,
			allowNull: false
		},
		reference: {
			type:DataTypes.BIGINT,
			allowNull: false
		},
		consecutive: {
			type:DataTypes.BIGINT,
			allowNull: false
		},
		amount: {
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
		tableName: 'payments_pendings',
		timestamps: true
	})

	/* -----------------------------------------------------------*/
	/* Relations:																									*/
	/*------------------------------------------------------------*/

	Payments_Pendings.associate = (models) => {

		// M:1 (The Payments table has the foreign key in this table)
		models.Payments_Pendings.belongsTo(models.Payments, {
			foreignKey: 'idpayment',
			targetKey: 'idpayment',
			as: 'Payments',
			onUpdate: 'CASCADE'
		})

		// M:1 (The Shops table has the foreign key in this table)
		models.Payments_Pendings.belongsTo(models.Shops, {
			foreignKey: 'idshop',
			targetKey: 'idshop',
			as: 'Shops',
			onUpdate: 'CASCADE'
		})

		// 1:1 (The Transactions table has the foreign key in this table)
		models.Payments_Pendings.belongsTo(models.Transactions, {
			foreignKey: 'idtransaction',
			targetKey: 'idtransaction',
			as: 'Transactions',
			onUpdate: 'CASCADE'
		})
	}
	return Payments_Pendings
}
