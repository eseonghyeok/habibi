"use strict";

module.exports = function (sequelize, DataTypes) {
  var Calendar = sequelize.define("Calendar", {
    date: {
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
    tableName: "calendars",
    hooks: {},
    indexes: [],
  });

  return Calendar;
};
