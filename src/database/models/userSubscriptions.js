const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");
const User = require("./user");
const Summoner = require("./summoner");

const UserSubscriptions = sequelize.define("UserSubscription", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: User,
      key: "id",
    },
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
});

User.belongsToMany(Summoner, {
  through: UserSubscriptions,
  foreignKey: "userId",
});
Summoner.belongsToMany(User, {
  through: UserSubscriptions,
  foreignKey: "summonerId",
});

module.exports = UserSubscriptions;
