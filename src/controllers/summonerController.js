const UserSubscription = require("../database/models/userSubscriptions");
const { isInGame } = require("../services/riotApi");
const Summoner = require("../database/models/summoner");
const { verifySummoner } = require("../services/riotApi");
const {
  getSummoner,
  makeGame,
  saveGameData,
} = require("../database/utils/dbHelpers");
const GameCard = require("../interfaces/gameCard");
const GameSummoner = require("../database/models/GameSummoner");
const { Sequelize, Op } = require("sequelize");
const Game = require("../database/models/game");
const { spectateSummoner, replaySh } = require("../services/neekoServer");
exports.getGameIdBySummonerNameAndRegion = async (req, res) => {
  try {
    const summonerRegion = req.params.region;
    summonerRegion.toLowerCase();
    const summonerName = req.params.summonerName;
    const summonerTag = req.params.summonerTag;
    const currSummoner = await Summoner.findOne({
      where: { name: summonerName, region: summonerRegion, tag: summonerTag },
    });
    if (!currSummoner) {
      res.status(404).send("Summoner not found");
    }
    const { isInGameStatus, data: gameData } = await isInGame(
      currSummoner.dataValues.id,
      currSummoner.dataValues.region
    );
    if (isInGameStatus) {
      //send json response with game id
      res.status(200).json({ gameId: gameData.gameId });
    } else {
      res.status(404).send("Summoner is not in game");
    }
  } catch (error) {
    console.error(
      "Error in getting game id by summoner name and region: " + error
    );
    res
      .status(500)
      .send("Error in getting game id by summoner name and region: " + error);
  }
};
exports.getGameCardWithGameIdAndSummoner = async (req, res) => {
  try {
    // Get all the parameters from the request
    const summonerRegion = req.params.region;
    summonerRegion.toLowerCase();
    const summonerName = req.params.summonerName;
    const gameId = req.params.gameId;
    const summonerTag = req.params.summonerTag;
    // Get the current summoner to strip inforamtion required.
    const currSummoner = await Summoner.findOne({
      where: { name: summonerName, region: summonerRegion, tag: summonerTag },
    });

    // Check if the current summoner was found
    if (!currSummoner) {
      res.status(404).send("Summoner not found");
    }

    // Get the game related data.
    const primarySummoner = await GameSummoner.findOne({
      where: { summonerId: currSummoner.id },
    });
    if (!primarySummoner) {
      res.status(404).send("primary summoner not found");
    }
    const otherSummoners = await GameSummoner.findAll({
      where: {
        riotGameId: gameId,
        summonerId: { [Op.ne]: primarySummoner.summonerId },
      },
    });
    const currGameCard = new GameCard(primarySummoner, otherSummoners, gameId);
    console.log(currGameCard);
    res.status(200).send(currGameCard);
  } catch (error) {
    console.error(
      "Error in getting game card with game id and summoner: " + error
    );
    res
      .status(500)
      .send("Error in getting game card with game id and summoner: " + error);
  }
};
exports.getAllGameCardsForSummoner = async (req, res) => {
  try {
    const region = req.params.region;
    const summonerName = req.params.summonerName;
    const summonerTag = req.params.summonerTag;
    // Get the current summoner to strip inforamtion required.
    const summoner = await Summoner.findOne({
      where: { name: summonerName, region: region, tag: summonerTag },
    });

    // Error check if the summoner was found
    if (!summoner) {
      res.status(404).send("Summoner not found");
    }

    // Get all the games that the summoner has played
    const gameSummonerRecords = await GameSummoner.findAll({
      where: { summonerId: summoner.id },
    });

    // Make a list of all the gameCard objects based on gameSummonerRecords
    const gameCards = await Promise.all(
      gameSummonerRecords.map(async (gameSummonerRecord) => {
        const primarySummoner = gameSummonerRecord;
        const primaryTeamSummoners = await GameSummoner.findAll({
          where: {
            riotGameId: gameSummonerRecord.riotGameId,
            teamId: primarySummoner.teamId,
          },
        });
        const otherTeamSummoners = await GameSummoner.findAll({
          where: {
            riotGameId: gameSummonerRecord.riotGameId,
            teamId: { [Op.ne]: primarySummoner.teamId },
          },
        });
        return new GameCard(
          primarySummoner,
          primaryTeamSummoners,
          otherTeamSummoners,
          gameSummonerRecord.riotGameId
        );
      })
    );

    // Send the list of gameCards to the frontend
    res.status(200).send(gameCards);
  } catch (error) {
    res
      .status(500)
      .send("Error in getting all game cards for summoner: " + error);
  }
};

exports.checkAllUserSubscriptions = async () => {
  const usersubscriptions = await UserSubscription.findAll();
  await Promise.all(
    usersubscriptions.map(async (subscription) => {
      const summoners = await Summoner.findOne({
        where: { id: subscription.dataValues.summonerId },
      });
      if (!summoners) {
        console.log("Summoner not found for subscription: " + subscription.id);
        return; // Skip to next iteration if summoner not found
      }
      const { isInGameStatus, data: gameData } = await isInGame(
        summoners.dataValues.id,
        summoners.dataValues.region
      );
      console.log("Summoner : ", summoners.dataValues.name);
      console.log("Game data: ", isInGameStatus);
      if (!gameData || !gameData.gameId) {
        console.log(
          "Game data is null or missing gameId for summoner: " +
            summoners.dataValues.name
        );
        return; // Skip to next iteration if game data is not valid
      }
      const game = await Game.findOne({
        where: { riotGameId: gameData.gameId },
      });
      if (!game && isInGameStatus) {
        console.log(
          summoners.dataValues.name + " is in game. Saving participants..."
        );
        saveGameData(gameData);
        // TODO: process recording of game of summoner here
        spectateSummoner(
          summoners.dataValues.name,
          summoners.dataValues.region
        );
      } else {
        console.log(
          summoners.dataValues.name + " is not in game or game already exists."
        );
      }
    })
  );
};
exports.checkActiveGames = async (req, res) => {
  try {
    await checkAllUserSubscriptions();
    res.status(200).send("Checked all user subscriptions for active games");
  } catch (error) {
    console.error("Error in checking active games: " + error);
    res.status(500).send("Error in checking active games");
  }
};

// check if summoner is in backend database, if not, add it to database
// then return summoner data
// if summoner is in database, return summoner data (and update summoner data in database with latest data from riot api)
exports.getSummonerByRegionAndName = async (req, res) => {
  try {
    const region = req.params.region;
    const summonerName = req.params.summonerName;
    const summonerTag = req.params.summonerTag;

    // Search for Summoner in database and riot api return null if not found
    const summoner = await getSummoner(summonerName, region, summonerTag);
    if (!summoner) {
      return res.status(404).send("Summoner not found");
    }
    res.status(200).send(summoner);
  } catch (error) {
    console.error("Error in getting summoner: ", error);
    res.status(500).send("Error in getting summoner");
  }
};

exports.startRecording = async (req, res) => {
  try {
    console.log("Hello");
    const region = req.params.region;
    const summonerName = req.params.summonerName;
    const summonerTag = req.params.summonerTag;
    const data = await spectateSummoner(summonerName, region, summonerTag);
    res.status(200).send(data);
  } catch (error) {
    console.error("Error in starting recording: " + error);
    res.status(404).send("Error in starting recording");
  }
};
exports.watchReplay = async (req, res) => {
  try {
    console.log("Hello watch replay");
    const gameId = req.params.gameId;
    const data = await replaySh(gameId);
    res.status(200).send(data);
  } catch (error) {
    console.error("Error in watching replay: " + error);
    res.status(404).send("Error in watching replay");
  }
};
