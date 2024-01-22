const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");
const Summoner = require("./summoner");
const Game = require("./game");

const GameSummoner = sequelize.define("GameSummoner", {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  championId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  spell1Id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  spell2Id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // ... any other attributes you want to record for the summoner in this game
  riotGameId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: Game,
      key: "riotGameId",
    },
  },
  summonerId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Summoner,
      key: "id",
    },
  },
  teamId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  region: {
    type: DataTypes.ENUM,
    values: [
      "na1",
      "euw",
      "eune",
      "kr",
      "br",
      "oce",
      "lan",
      "las",
      "ru",
      "tr",
      "jp",
    ],
    allowNull: false,
  },
  // ...
});

// Associate GameSummoner to Game
GameSummoner.belongsTo(Game, {
  foreignKey: "gameId",
});

// Associate GameSummoner to Summoner
GameSummoner.belongsTo(Summoner, {
  foreignKey: "summonerId",
});

Game.belongsToMany(Summoner, {
  through: GameSummoner,
  foreignKey: "gameId",
  as: "SummonersInGame", // <- alias
});

Summoner.belongsToMany(Game, {
  through: GameSummoner,
  foreignKey: "summonerId",
  as: "GamesPlayed", // <- alias
});

module.exports = GameSummoner;
