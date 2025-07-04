"use strict";

module.exports = function (sequelize, DataTypes) {
	var Record = sequelize.define("Record", {
		date: {
			type: DataTypes.TEXT,
			primaryKey: true,
			allowNull: false
		},
		type: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		data: {
			type: DataTypes.JSON,
			allowNull: true
		},
		metadata: {
			type: DataTypes.JSON,
			allowNull: true
		}
	}, {
		timestamps: true,
		underscored: true,
		freezeTableName: true,
		paranoid: false,
		tableName: "records",
		hooks: {},
		indexes: [],
	});

  return Record;
};
