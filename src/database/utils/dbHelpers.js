const User = require("../models/user");

const getUser = async (uid) => {
  try {
    const currUser = await User.findOne({ firebaseUID: uid });
    return currUser;
  } catch (error) {
    console.error(
      "Error in finding user with uid" + uid + "with error of: " + error
    );
  }
  throw error;
};
const hasUserSubscribedToSummoner = async (uid, summonerName, region) => {
  try {
    console.log("UID IS ", uid);
    const isSubscribed = await User.findOne({
      firebaseUID: uid,
      subscribed: {
        $elemMatch: {
          summonerName: summonerName,
          region: region,
        },
      },
    });
    console.log("SUBSCRIBED USER ", isSubscribed);
    if (isSubscribed) {
      console.log(
        "User: " +
          uid +
          " has subscribed to summoner, trying to delete: " +
          summonerName
      );
      return true;
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
};
