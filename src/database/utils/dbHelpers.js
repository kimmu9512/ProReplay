const User = require("../models/user");
const Summoner = require("../models/summoner");
const UserSubscriptions = require("../models/userSubscriptions");
const Game = require("../models/game");
const { pool, sequelize } = require("../../config/db");
const GameSummoner = require("../models/GameSummoner");
const { verifySummoner } = require("../../services/riotApi");
const makeGame = async (riotGameId) => {
  try {
    const [game, created] = await Game.findOrCreate({
      where: { riotGameId: riotGameId },
      defaults: { riotGameId: riotGameId },
    });

    if (created) {
      console.log("Game was created!");
    } else {
      console.log("Game already exists!");
    }

    return game;
  } catch (error) {
    console.error(
      "Error in creating or finding game with riotGameId: " +
        riotGameId +
        " with error of: ",
      error
    );
    throw error;
  }
};
const saveGameData = async (gameData) => {
  console.log("saving participant data");
  try {
    const game = await Game.findOrCreate({
      where: { riotGameId: gameData.gameId },
      defaults: { riotGameId: gameData.gameId },
    });
    //Iterate through all participants in the game

    for (const participant of gameData.participants) {
      // check if summoner already exists
      const newSummoner = await verifySummoner(
        participant.summonerName,
        gameData.platformId.toLowerCase()
      );
      const summoner = await Summoner.findOrCreate({
        where: { id: participant.summonerId },
        defaults: {
          name: participant.summonerName,
          region: gameData.platformId.toLowerCase(),
          puuid: participant.puuid,
          accountId: newSummoner.accountId,
          id: participant.summonerId,
          profileIconId: participant.profileIconId,
          summonerLevel: newSummoner.summonerLevel,
        },
      });
      // check if participant already exists
      await GameSummoner.findOrCreate({
        where: {
          riotGameId: gameData.gameId,
          summonerId: participant.summonerId,
        },
        defaults: {
          teamId: participant.teamId,
          riotGameId: gameData.gameId,
          summonerId: participant.summonerId,
          championId: participant.championId,
          spell1Id: participant.spell1Id,
          spell2Id: participant.spell2Id,
          name: participant.summonerName,
          region: gameData.platformId.toLowerCase(),
        },
      });
    }
  } catch (error) {
    console.error("Error in saving game data with error of: ", error);
    throw error;
  }
};

const getUser = async (uid) => {
  try {
    const user = await User.findOne({
      where: { firebaseUID: uid },
    });
    if (user) {
      return user;
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error(
      "Error in finding user with uid" + uid + "with error of: ",
      error
    );
    throw error;
  }
};

const getSummoner = async (summonerName, region, summonerTag) => {
  if (!summonerName || !region || !summonerTag) {
    console.error(
      "Invalid parameters: summonerName, region, and summonerTag are required."
    );
    return null;
  }

  try {
    // Normalize region to lowercase for consistency
    const normalizedRegion = region.toLowerCase();

    // Attempt to find the summoner in the database
    let summoner = await Summoner.findOne({
      where: { name: summonerName, region: normalizedRegion, tag: summonerTag },
    });

    // If the summoner isn't found in the database, check with Riot API
    if (!summoner) {
      const riotSummoner = await verifySummoner(
        summonerName,
        normalizedRegion,
        summonerTag
      );

      // If the summoner is found in the Riot API, create a new record in the database
      if (riotSummoner) {
        summoner = await Summoner.create({
          name: summonerName,
          region: normalizedRegion,
          tag: summonerTag,
          ...riotSummoner,
        });
      } else {
        // If the summoner is not found in the Riot API, log the situation and return null
        console.log("Summoner not found in Riot API.");
        return null;
      }
    }

    // Return the found or newly created summoner
    return summoner;
  } catch (error) {
    console.error("Error finding or creating summoner:", error);
    return null; // Depending on your use case, you might want to throw the error instead
  }
};
const removeSubcription = async (uid, summonerName, region) => {
  try {
    console.log("DELETING USER SUBSCRIPTION");
    const user = await getUser(uid);
    const summoner = await getSummoner(summonerName, region);
    if (summoner && user) {
      const query = `DELETE FROM "UserSubscriptions" WHERE "userId" = $1 AND "summonerId" = $2`;
      await pool.query(query, [user.id, summoner.id]);
    } else {
      throw new Error("could not find user or summoner");
    }
  } catch {
    console.error(
      "Error in removing subscription with uid: " +
        uid +
        " summonerName: " +
        summonerName +
        " region: " +
        region +
        " with error of: ",
      error
    );
    throw error;
  }
};
const hasUserSubscribedToSummoner = async (uid, summonerName, region) => {
  try {
    const user = await getUser(uid);
    const summoner = await getSummoner(summonerName, region);
    // can i access properties of user here?
    if (summoner) {
      const query = `SELECT * FROM "UserSubscriptions" WHERE "userId" = $1 AND "summonerId" = $2`;
      const queryedUser = await pool.query(query, [user.id, summoner.id]);
      // check if queryedUser succesffuly got query back
      if (queryedUser.rows.length === 0) {
        return false;
      } else {
        console.log("USER: " + uid + "HAS SUBSCRIBED TO: " + summonerName);
        return true;
      }
    } else {
      return false;
    }
  } catch {
    console.error(
      "Error in checking if user: " +
        uid +
        " has subscribed or not with error of: " +
        error
    );
    throw error;
  }
};
const userSubscriptions = async (uid) => {
  try {
    const user = await getUser(uid);
    const userSubscriptions = await UserSubscriptions.findAll({
      where: { userId: user.id },
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

    return summoners;
  } catch (error) {
    console.error(
      "Error in getting user subscriptions with uid: " +
        uid +
        " with error of: ",
      error
    );
    throw error;
  }
};

module.exports = {
  hasUserSubscribedToSummoner,
  getUser,
  getSummoner,
  userSubscriptions,
  removeSubcription,
  makeGame,
  saveGameData,
};
