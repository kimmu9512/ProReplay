const UserManager = require("./UserManager");
const SummonerManager = require("./SummonerManager");
const UserSubscriptionManager = require("./UserSubscriptionManager");

class DatabaseManager {
  constructor() {
    this.userManager = new UserManager();
    this.summonerManager = new SummonerManager();
    this.userSubscripbtionManager = new UserSubscriptionManager();
  }
}
