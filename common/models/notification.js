"use strict";

module.exports = function (sequelize, DataTypes) {
  var Notification = sequelize.define("Notification", {
    title: {
      type: DataTypes.TEXT,
      primaryKey: true,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    paranoid: false,
    tableName: "notifications",
    hooks: {},
    indexes: [],
  });

  return Notification;
};
