const UserManager = require("./UserManager");
const SummonerManager = require("./SummonerManager");
const UserSubscriptionManager = require("./UserSubscriptionManager");

class DatabaseManager {
  constructor(
    summonerModel,
    gameSummonerModel,
    gameModel,
    userModel,
    userSubscriptionModel
  ) {
    this.userManager = new UserManager(userModel);
    this.gameManer = new GameManager(gameModel);
    this.summonerManager = new SummonerManager(
      summonerModel,
      gameSummonerModel
    );
    this.userSubscripbtionManager = new UserSubscriptionManager(
      userSubscriptionModel
    );
  }
}
