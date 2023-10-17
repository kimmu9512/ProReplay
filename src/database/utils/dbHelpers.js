const User = require("../models/user");
const Summoner = require("../models/summoner");
const UserSubscriptions = require("../models/userSubscriptions");
const { pool, sequelize } = require("../../config/db");

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

const getSummoner = async (summonerName, region) => {
  try {
    const summoner = await Summoner.findOne({
      where: { summonerName: summonerName, region: region },
    });
    if (summoner) {
      return summoner;
    } else {
      console.log("hello world");
      return null;
    }
  } catch (error) {
    console.error(
      "Error in finding summoner with summonerName: " +
        summonerName +
        " and region: " +
        region +
        " with error of: ",
      error
    );
    console.log("could not find summoner but no problem");
    return null;
  }
};

const hasUserSubscribedToSummoner = async (uid, summonerName, region) => {
  try {
    console.log("UID IS ", uid);
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

module.exports = {
  hasUserSubscribedToSummoner,
  getUser,
  getSummoner,
};
