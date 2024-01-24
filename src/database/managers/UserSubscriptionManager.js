const Summoner = require("../models/summoner");
class UserSubscriptionManager {
  constructor(userSubscriptionModel) {
    this.UserSubscription = userSubscriptionModel;
  }
  async hasUserSubscribedToSummoner(userId, summonerId) {
    try {
      const userSubscription = await this.UserSubscription.findOne({
        where: {
          userId: userId,
          summonerId: summonerId,
        },
      });
      if (userSubscription) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(
        "Error in checking if user has subscribed to summoner: " + error
      );
      throw error;
    }
  }
  async subscribeSummoner(userId, summonerId) {
    try {
      if (
        (await this.hasUserSubscribedToSummoner(userId, summonerId)) === false
      ) {
        const newUserSubscription = await this.UserSubscription.create({
          userId: userId,
          summonerId: summonerId,
        });
      } else {
        const newUserSubscription = await this.UserSubscription.findOne({
          where: {
            userId: userId,
            summonerId: summonerId,
          },
        });
      }
      return newUserSubscription;
    } catch (error) {
      console.error("Error in subscribing summoner: " + error);
      throw error;
    }
  }
  async unsubscribeSummoner(userId, summonerId) {
    try {
      const userSubscription = await this.UserSubscription.findOne({
        where: {
          userId: userId,
          summonerId: summonerId,
        },
      });
      if (userSubscription) {
        await userSubscription.destroy();
      }
    } catch (error) {
      console.error("Error in unsubscribing summoner: " + error);
      throw error;
    }
  }
  async getSubscribedSummoners(userId) {
    try {
      const userSubscriptions = await this.UserSubscription.findAll({
        where: { userId: userId },
        include: [
          {
            model: Summoner,
            required: true,
          },
        ],
      });
      const summoners = userSubscriptions.map(
        (subscription) => subscription.Summoner
      );
      return userSubscriptions;
    } catch (error) {
      console.error("Error in getting subscribed summoners: " + error);
      throw error;
    }
  }
}
