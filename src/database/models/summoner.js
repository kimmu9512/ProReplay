const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const Summoner = sequelize.define("Summoner", {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,
    validate: {
      len: [1, 63], // Max length 63 characters
    },
  },

  accountId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [1, 56], // Max length 56 characters
    },
  },
  puuid: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [78, 78], // Exact length of 78 characters
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tag: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profileIconId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  summonerLevel: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  region: {
    type: DataTypes.ENUM,
    values: [
      "br1",
      "eun1",
      "euw1",
      "jp1",
      "kr",
      "la1",
      "la2",
      "na1",
      "oc1",
      "ph2",
      "ru",
      "sg2",
      "th2",
      "tr1",
      "tw2",
      "vn2",
    ],
    allowNull: false,
  },
});
module.exports = Summoner;
