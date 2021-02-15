'use strict'

module.exports = (sequelize, DataTypes) => {

	/* -----------------------------------------------------------*/
	/* Definition:																								*/
	/*------------------------------------------------------------*/

	const Contents = sequelize.define('Contents',{
		idcontent: {
			primaryKey:true,
			type:DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false
		},
		idprogram: {
			type:DataTypes.INTEGER,
			allowNull:false
		},
		idcoin: {
			type:DataTypes.INTEGER,
			allowNull:false
		},
		content: {
			type:DataTypes.TEXT,
			allowNull: false
		},
		percent: DataTypes.DOUBLE,
		profit: DataTypes.DOUBLE,
		deduction: DataTypes.DOUBLE,
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
		tableName: 'contents',
		timestamps: true
	})

	/* -----------------------------------------------------------*/
	/* Relations:																									*/
	/*------------------------------------------------------------*/

	Contents.associate = (models) => {

		// M:1 (The Programs table has the foreign key in this table)
		models.Contents.belongsTo(models.Programs,{
			foreignKey: 'idprogram',
			sourceKey: 'idprogram',
			as: 'Programs',
			onUpdate: 'CASCADE'
		})

		// M:1 (The Coins table has the foreign key in this table)
		models.Contents.belongsTo(models.Coins,{
			foreignKey: 'idcoin',
			sourceKey: 'idcoin',
			as: 'Coins',
			onUpdate: 'CASCADE'
		})
	}
	return Contents
}
