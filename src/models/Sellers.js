'use strict'

module.exports = (sequelize, DataTypes) => {

	/* -----------------------------------------------------------*/
	/* Definition:																								*/
	/*------------------------------------------------------------*/

	const Sellers = sequelize.define('Sellers',{
		idseller: {
			primaryKey:true,
			type:DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false
		},
		idshop: {
			type:DataTypes.INTEGER,
			allowNull: false
		},
		login: {
			type:DataTypes.STRING,
			allowNull: false
		},
		password: DataTypes.STRING,
		num: {
			type:DataTypes.INTEGER,
			allowNull: false
		},
		name: {
			type:DataTypes.STRING,
			allowNull: false
		},
		state: {
			type:DataTypes.ENUM,
			values: ['activo', 'inactivo', 'definir', 'confirmar', 'incompleto'],
			allowNull: false
		},
		created_at: {
			type:DataTypes.DATE,
			allowNull: false
		},
		updated_at:DataTypes.DATE
	},{
		tableName: 'sellers',
		timestamps: true
	})

	/* -----------------------------------------------------------*/
	/* Relations:																									*/
	/*------------------------------------------------------------*/

	Sellers.associate = (models) => {

		// M:1 (The Shops table has the foreign key in this table)
		models.Sellers.belongsTo(models.Shops, {
			foreignKey: 'idshop',
			targetKey: 'idshop',
			as: 'Shops',
			onUpdate: 'CASCADE'
		})

		// 1:1 (This table has the foreign key in the table Sessions)
		models.Sellers.hasOne(models.Sessions, {
			foreignKey: 'idseller',
			sourceKey: 'idseller',
			as: 'Sessions',
			onUpdate: 'CASCADE'
		})

		// 1:M (This table has the foreign key in the table Sales)
		models.Sellers.hasMany(models.Sales,{
			foreignKey: 'idseller',
			sourceKey: 'idseller',
			as: 'Sales',
			onUpdate: 'CASCADE'
		})

		// 1:M (This table has the foreign key in the table Wallets)
		models.Sellers.hasMany(models.Wallets,{
			foreignKey: 'idseller',
			sourceKey: 'idseller',
			as: 'Wallets',
			onUpdate: 'CASCADE'
		})

		// M:N (This table has the foreign key in the table Approbations - Policies)
		models.Sellers.belongsToMany(models.Policies,{
			through: models.Approbations,
			foreignKey: 'idseller',
			sourceKey: 'idseller',
			as: 'Policies',
			onUpdate: 'CASCADE'
		})
	}
	return Sellers
}
