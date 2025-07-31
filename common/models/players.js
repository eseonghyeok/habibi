"use strict";

module.exports = function (sequelize, DataTypes) {
  var Player = sequelize.define("Player", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    teamName: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    info: {
      type: DataTypes.JSON,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
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
    tableName: "players",
    hooks: {},
    indexes: [],
  });

  Player.associate = function(models) {
    Player.belongsTo(models.Team, {
      as: "team",
      foreignKey: "teamName"
    });
  };

  return Player;
};
