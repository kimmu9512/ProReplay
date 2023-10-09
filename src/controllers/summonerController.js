const UserSubscription = require("../database/models/userSubscriptions");
const { isInGame } = require("../services/riotApi");
const Summoner = require("../database/models/summoner");

exports.checkActiveGames = async (req, res) => {
  try {
    const usersubscriptions = await UserSubscription.findAll();
    await Promise.all(
      usersubscriptions.map(async (subscription) => {
        const summoners = await Summoner.findOne({
          where: { id: subscription.dataValues.summonerId },
        });
        console.log(summoners.dataValues.summonerName);
        console.log(summoners.dataValues.riotId);
        if (
          summoners &&
          (await isInGame(
            summoners.dataValues.riotId,
            summoners.dataValues.region
          ))
        ) {
          console.log(summoners.dataValues.summonerName + " is in game");
          // TODO: process recording of game of summoner here
        } else {
          console.log(summoners.dataValues.summonerName + " is not in game");
        }
      })
    );
    res.status(200).send("checked all usersubscriptions for active games");
  } catch (error) {
    console.error("Error in checking active games: " + error);
    res.status(500).send("Error in checking active games: " + error);
  }
};
