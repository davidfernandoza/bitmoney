'use strict'

module.exports = (sequelize, DataTypes) => {

	/* -----------------------------------------------------------*/
	/* Definition:																								*/
	/*------------------------------------------------------------*/

	const Payments = sequelize.define('Payments',{
		idpayment: {
			primaryKey:true,
			type:DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false
		},
		idbankaccount:DataTypes.INTEGER,
		idprogram: {
			type:DataTypes.INTEGER,
			allowNull: false
		},
		idtypepayment: {
			type:DataTypes.INTEGER,
			allowNull: false
		},
		idshop: {
			type:DataTypes.INTEGER,
			allowNull: false
		},
		idtxt:DataTypes.INTEGER,
		amount: {
			type:DataTypes.DOUBLE,
			allowNull: false
		},
		total: {
			type:DataTypes.DOUBLE,
			allowNull: false
		},
		img: DataTypes.STRING,
		expiration: {
			type: DataTypes.BIGINT,
			allowNull:true
		},
		date: DataTypes.BIGINT,
		class: {
			type:DataTypes.ENUM,
			values:['global','unitario'],
			allowNull: false
		},
		state: {
			type:DataTypes.ENUM,
			values:['activo','cancelado','depositado','expirado'],
			allowNull: false
		},
		created_at: {
			type:DataTypes.DATE,
			allowNull: false
		},
		updated_at:DataTypes.DATE
	},{
		tableName: 'payments',
		timestamps: true
	})

	/* -----------------------------------------------------------*/
	/* Relations:																									*/
	/*------------------------------------------------------------*/

	Payments.associate = (models) => {

		// M:1 (The Banks_Accounts table has the foreign key in this table )
		models.Payments.belongsTo(models.Banks_Accounts, {
			foreignKey: 'idbankaccount',
			targetKey: 'idbankaccount',
			as: 'Banks_Accounts',
			onUpdate: 'CASCADE'
		})

		// M:1 (The Programs table has the foreign key in this table)
		models.Payments.belongsTo(models.Programs, {
			foreignKey: 'idprogram',
			targetKey: 'idprogram',
			as:	'Programs',
			onUpdate: 'CASCADE'
		})

		// M:1 (The Types_Payments table has the foreign key in this table)
		models.Payments.belongsTo(models.Types_Payments, {
			foreignKey: 'idtypepayment',
			targetKey: 'idtypepayment',
			as:	'Types_Payments',
			onUpdate: 'CASCADE'
		})

		// M:1 (The Shops table has the foreign key in this table)
		models.Payments.belongsTo(models.Shops, {
			foreignKey: 'idshop',
			targetKey: 'idshop',
			as: 'Shops',
			onUpdate: 'CASCADE'
		})

		// M:1 (The Txt table has the foreign key in this table)
		models.Payments.belongsTo(models.Txt, {
			foreignKey: 'idtxt',
			targetKey: 'idtxt',
			as: 'Txt',
			onUpdate: 'CASCADE'
		})

		// 1:M (This table has the foreign key in the table Payments_Pendings)
		models.Payments.hasMany(models.Payments_Pendings,{
			foreignKey: 'idpayment',
			sourceKey: 'idpayment',
			as: 'Payments_Pendings',
			onUpdate: 'CASCADE'
		})
	}
	return Payments
}
