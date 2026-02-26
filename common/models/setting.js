"use strict";

module.exports = function (sequelize, DataTypes) {
  var Setting = sequelize.define("Setting", {
    name: {
      type: DataTypes.TEXT,
      primaryKey: true,
      allowNull: false
    },
    content: {
      type: DataTypes.JSON,
      allowNull: false
    }
  }, {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    paranoid: false,
    tableName: "settings",
    hooks: {},
    indexes: [],
  });

  return Setting;
};
