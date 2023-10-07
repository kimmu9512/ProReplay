const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const Summoner = sequelize.define("Summoner", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  summonerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  region: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  puuid: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  accountId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  riotId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});
module.exports = Summoner;
