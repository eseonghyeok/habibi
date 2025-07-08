"use strict";

module.exports = function (sequelize, DataTypes) {
  var Team = sequelize.define("Team", {
    name: {
      type: DataTypes.TEXT,
      primaryKey: true,
      allowNull: false
    },
    record: {
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
    tableName: "teams",
    hooks: {},
    indexes: [],
  });

  Team.associate = function(models) {
    Team.hasMany(models.Player, {
      as: "players",
      foreignKey: "teamName"
    });
  };

  return Team;
};
