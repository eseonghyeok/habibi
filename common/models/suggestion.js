"use strict";

module.exports = function (sequelize, DataTypes) {
  var Suggestion = sequelize.define("Suggestion", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    check: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    paranoid: false,
    tableName: "suggestions",
    hooks: {},
    indexes: [],
  });

  return Suggestion;
};
