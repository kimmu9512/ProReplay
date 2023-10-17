const UserSubscription = require("../database/models/userSubscriptions");
const { isInGame } = require("../services/riotApi");
const Summoner = require("../database/models/summoner");
const RecordedMatch = require("../database/models/recordedMatch");
const { verifySummoner } = require("../services/riotApi");
const { getSummoner } = require("../database/utils/dbHelpers");
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

exports.getMatches = async (req, res) => {
  try {
    const summonerId = req.params.summonerId;
    const matches = await RecordedMatch.findAll({
      where: { summonerId: summonerId },
    });
    res.status(200).send(matches);
  } catch (error) {
    console.error("Error in getting matches: " + error);
    res.status(500).send("Error in getting matches: " + error);
  }
};

// check if summoner is in backend database, if not, add it to database
// then return summoner data
// if summoner is in database, return summoner data (and update summoner data in database with latest data from riot api)
exports.getSummoner = async (req, res) => {
  try {
    const region = req.params.region;
    const summonerName = req.params.summonerName;

    // database summoner
    console.log("region is " + region);
    console.log("summonerName is " + summonerName);
    const summoner = await getSummoner(summonerName, region);
    // riot api summoner
    const newSummoner = await verifySummoner(summonerName, region);
    if (summoner) {
      // update summoner data in database with latest data from riot api
      await Summoner.update(
        {
          summonerName: summonerName,
          region: region,
          puuid: newSummoner.puuid,
          accountId: newSummoner.accountId,
          riotId: newSummoner.id,
          profileIconId: newSummoner.profileIconId,
          summonerLevel: newSummoner.summonerLevel,
        },
        {
          where: { summonerName: summonerName, region: region },
        }
      );
    } else {
      // add summoner to database
      await Summoner.create({
        summonerName: summonerName,
        region: region,
        puuid: newSummoner.puuid,
        accountId: newSummoner.accountId,
        riotId: newSummoner.id,
        profileIconId: newSummoner.profileIconId,
        summonerLevel: newSummoner.summonerLevel,
      });
    }
    res.status(200).send(newSummoner);
  } catch (error) {
    console.error("Error in getting summoner: " + error);
    res.status(404).send("Error in getting summoner");
  }
};
