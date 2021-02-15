'use strict'

module.exports = (sequelize, DataTypes) => {

	/* -----------------------------------------------------------*/
	/* Definition:																								*/
	/*------------------------------------------------------------*/


	const Administrators = sequelize.define('Administrators',{
		idadministrator: {
			primaryKey:true,
			type:DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false,
			isNumeric: true
		},
		email:DataTypes.STRING,
		password: {
			type:DataTypes.STRING,
			defaultValue: null,
		},
		name: {
			type:DataTypes.STRING,
			allowNull: false
		},
		cellphone: DataTypes.STRING,
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
		tableName: 'administrators',
		timestamps: true
	})

	/* -----------------------------------------------------------*/
	/* Relations:																									*/
	/*------------------------------------------------------------*/

	Administrators.associate = (models) => {

		// 1:1 (This table has the foreign key in the table Codes)
		models.Administrators.hasOne(models.Codes, {
			foreignKey: 'idadministrator',
			sourceKey: 'idadministrator',
			as: 'Codes',
			onUpdate: 'CASCADE'
		})

		// 1:1 (This table has the foreign key in the table Sessions)
		models.Administrators.hasOne(models.Sessions, {
			foreignKey: 'idadministrator',
			sourceKey: 'idadministrator',
			as: 'Sessions',
			onUpdate: 'CASCADE'
		})

		// 1:M (This table has the foreign key in the table Sales)
		models.Administrators.hasMany(models.Sales,{
			foreignKey: 'idadministrator',
			sourceKey: 'idadministrator',
			as: 'Sales',
			onUpdate: 'CASCADE'
		})

		// 1:M (This table has the foreign key in the table Shops)
		models.Administrators.hasMany(models.Shops,{
			foreignKey: 'idadministrator',
			sourceKey: 'idadministrator',
			as: 'Shops',
			onUpdate: 'CASCADE'
		})

		// 1:M (This table has the foreign key in the table Wallets)
		models.Administrators.hasMany(models.Wallets,{
			foreignKey: 'idadministrator',
			sourceKey: 'idadministrator',
			as: 'Wallets',
			onUpdate: 'CASCADE'
		})

		// M:N (This table has the foreign key in the table Approbations - Policies)
		models.Administrators.belongsToMany(models.Policies,{
			through: models.Approbations,
			foreignKey: 'idadministrator',
			sourceKey: 'idadministrator',
			as: 'Policies',
			onUpdate: 'CASCADE'
		})
	}
	return Administrators
}
