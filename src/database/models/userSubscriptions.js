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
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    references: {
      model: Summoner,
      key: "id",
    },
  },
});
// Associate UserSubscription to User
UserSubscriptions.belongsTo(User, {
  foreignKey: "userId",
});

// Associate UserSubscription to Summoner
UserSubscriptions.belongsTo(Summoner, {
  foreignKey: "summonerId",
});
User.belongsToMany(Summoner, {
  through: UserSubscriptions,
  foreignKey: "userId",
  as: "SubscribedSummoners", // <- alias
});
Summoner.belongsToMany(User, {
  through: UserSubscriptions,
  foreignKey: "summonerId",
  as: "Subscribers", // <- alias
});

module.exports = UserSubscriptions;
