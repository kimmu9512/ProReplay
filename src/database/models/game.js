const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const Game = sequelize.define("Game", {
  riotGameId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: true,
    primaryKey: true,
  },

  // ... any other attributes specific to the game itself
});

module.exports = Game;
