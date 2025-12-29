"use strict";

module.exports = function (sequelize, DataTypes) {
  var Dues = sequelize.define("Dues", {
    date: {
      type: DataTypes.TEXT,
      primaryKey: true,
      allowNull: false
    },
    money: {
      type: DataTypes.JSON,
      allowNull: false
    },
    history: {
      type: DataTypes.ARRAY(DataTypes.JSON),
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
    tableName: "dues",
    hooks: {},
    indexes: [],
  });

  return Dues;
};
