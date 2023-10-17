const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");
const User = require("./user");
const Summoner = require("./summoner");

const ReocrdedMatch = sequelize.define("RecordedMatch", {
  matchId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  summonerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: Summoner,
      key: "id",
    },
  },
  championName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Summoner.hasMany(ReocrdedMatch, {
  foreignKey: "summonerId",
  onDelete: "CASCADE",
});
ReocrdedMatch.belongsTo(Summoner, {
  foreignKey: "summonerId",
  onDelete: "CASCADE",
});
module.exports = ReocrdedMatch;
