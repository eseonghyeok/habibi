"use strict";

module.exports = function (sequelize, DataTypes) {
  var Notification = sequelize.define("Notification", {
    index: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    title: {
      type: DataTypes.TEXT,
      unique: true,
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
