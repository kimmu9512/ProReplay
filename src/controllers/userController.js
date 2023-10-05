const passport = require("passport");
const User = require("../database/models/user");
const admin = require("../config/firebaseAdmin");
const { verifySummoner } = require("../services/riotApi");
const {
  auth,
  createUserWithEmailAndPassword,
} = require("../config/firebaseClient");
const {
  hasUserSubscribedToSummoner,
  getUser,
} = require("../database/utils/dbHelpers");
// Firebase will handle the registration on the client side.
// This route is for storing additional user details in the database once register is successful in front end
exports.register_post = async (req, res) => {
  const { idToken, additionalData } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    User.findOrCreate(
      { firebaseUID: uid, additionalData },
      function (err, user, created) {
        if (err) {
          // Handle the error if there's an issue during findOrCreate
          return res
            .status(500)
            .json({ error: "Database error: " + err.message });
        }

        // If there's no error, the user is either found or created
        if (created) {
          console.log("new User created", user);
        } else {
          console.log("existing User found", user);
        }
        return res.json({ message: "Successfully registered", uid });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Authentication failed" });
  }
};

// This route is for testing purposes only
exports.register_test = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const idToken = await userCredential.user.getIdToken();
    console.log("Received Token: " + idToken);
    res.json({
      message: "Successfully registered",
      uid: userCredential.user.uid,
    });
  } catch (error) {
    console.log("Error : " + error);
    res.status(500).json({ error: error.message });
  }
};

exports.subscribeSummoner = async (req, res) => {
  // middleware will add user to req.user
  try {
    firebaseUser = await req.user;
    const user = await getUser(firebaseUser.uid);
    const { summonerName, region } = req.body;
    const riotData = await verifySummoner(summonerName, region);
    if (
      await hasUserSubscribedToSummoner(user.firebaseUID, summonerName, region)
    ) {
      return res
        .status(400)
        .send("You are already subscribed to this summoner");
    } else {
      const newSummoner = {
        summonerName: summonerName,
        region: region,
        puuid: riotData.puuid,
        accountId: riotData.accountId,
        riotId: riotData.id,
      };
      user.subscribed.push(newSummoner);
      await user.save();
      res
        .status(200)
        .send(
          "User: " +
            user.additionalData.displayName +
            " subscribed to summoner: " +
            summonerName +
            " in region: " +
            region
        );
    }
  } catch (error) {
    console.error("Error in subscribing summoner: " + error);
    res.status(500).send("Error in subscribing summoner: " + error);
  }
};

exports.unSubscribeSummoner = async (req, res) => {
  try {
    firebaseUser = await req.user;
    const user = await getUser(firebaseUser.uid);
    const { summonerName, region } = req.body;
    if (
      await hasUserSubscribedToSummoner(user.firebaseUID, summonerName, region)
    ) {
      const index = user.subscribed.findIndex(
        (summoner) =>
          summoner.summonerName === summonerName && summoner.region === region
      );
      if (index != -1) {
        user.subscribed.splice(index, 1);
      }
      await user.save();
      res
        .status(200)
        .send(
          "User: " +
            user.additionalData.displayName +
            " unsubscribed to summoner: " +
            summonerName +
            " in region: " +
            region
        );
    } else {
      return res.status(400).send("You are not subscribed to this summoner");
    }
  } catch (error) {
    console.error("Error in unsubscribing summoner: " + error);
    res.status(500).send("Error in unsubscribing summoner: " + error);
  }
};

exports.getSubscribedSummoners = async (req, res) => {
  try {
    firebaseUser = await req.user;
    const user = await getUser(firebaseUser.uid);
    res.status(200).send(user.subscribed);
  } catch (error) {
    console.error("Error in getting subscribed summoners: " + error);
    res.status(500).send("Error in getting subscribed summoners: " + error);
  }
};

exports.getDisplayName = async (req, res) => {
  try {
    firebaseUser = await req.user;
    const user = await getUser(firebaseUser.uid);
    res.status(200).send(user.additionalData.displayName);
  } catch (error) {
    console.error("Error in getting display name: " + error);
    res.status(500).send("Error in getting display name: " + error);
  }
};

exports.setDisplayName = async (req, res) => {
  try {
    firebaseUser = await req.user;
    const user = await getUser(firebaseUser.uid);
    const { displayName } = req.body;
    user.additionalData.displayName = displayName;
    await user.save();
    res.status(200).send("Display name updated");
  } catch (error) {
    console.error("Error in setting display name: " + error);
    res.status(500).send("Error in setting display name: " + error);
  }
};
