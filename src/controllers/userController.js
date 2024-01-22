const config = require("../config/index");
const User = require("../database/models/user");
const Summoner = require("../database/models/summoner");
const UserSubscription = require("../database/models/userSubscriptions");
const admin = require("../config/firebaseAdmin");
const { verifySummoner } = require("../services/riotApi");
const {
  auth,
  createUserWithEmailAndPassword,
} = require("../config/firebaseClient");
const {
  hasUserSubscribedToSummoner,
  getUser,
  getSummoner,
  userSubscriptions,
  removeSubcription,
} = require("../database/utils/dbHelpers");

// Firebase will handle the registration on the client side.
// This route is for storing additional user details in the database once register is successful in front end
exports.register_post = async (req, res) => {
  const { idToken, userData } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const [user, created] = await User.findOrCreate({
      where: { firebaseUID: uid },
      defaults: {
        firebaseUID: uid,
        displayName: userData.displayName,
        email: userData.email,
      },
    });
    if (created) {
    } else {
    }
    return res.json({ message: "Successfully registered", uid });
  } catch (error) {
    res.status(500).json({ error: "Authentication failed", error });
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
    console.log(idToken);
    res.json({
      message: "Successfully registered",
      uid: userCredential.user.uid,
    });
  } catch (error) {
    console.log("Error : " + error);
    res.status(500).json({ error: error.message });
  }
};

exports.google_login = async (req, res) => {
  console.log("Commencing Google login..");
  const provider = new admin.auth.GoogleAuthProvider();
  admin
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      console.log("google login success, welcome " + user.get); // This is your logged-in user
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.subscribeSummoner = async (req, res) => {
  // middleware will add user to req.user
  console.log("subscribing to summoner");
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
      const [newSummoner, created] = await Summoner.findOrCreate({
        where: { id: riotData.id },
        defaults: {
          summonerName: summonerName,
          region: region,
          puuid: riotData.puuid,
          accountId: riotData.accountId,
          id: riotData.id,
          profileIconId: riotData.profileIconId,
          summnerLevel: riotData.summonerLevel,
        },
      });

      const newUserSubscription = await UserSubscription.create({
        userId: user.id,
        summonerId: newSummoner.id,
      });
      res
        .status(200)
        .send(
          "User: " +
            user.displayName +
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
  console.log("unsubscribing summoner");
  try {
    firebaseUser = await req.user;
    const user = await getUser(firebaseUser.uid);
    const { summonerName, region } = req.body;
    if (
      await hasUserSubscribedToSummoner(user.firebaseUID, summonerName, region)
    ) {
      const currSummoner = await getSummoner(summonerName, region);
      console.log(Object.getOwnPropertyNames(user.__proto__));
      await removeSubcription(user.firebaseUID, summonerName, region);
      res
        .status(200)
        .send(
          "User: " +
            user.displayName +
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
    console.log(
      "Getting summoenrs user: " + firebaseUser.uid + "has subscribed:"
    );
    const summonerUserSubscribed = await userSubscriptions(firebaseUser.uid);
    summonerUserSubscribed.map((summoner) =>
      console.log("summoner: " + summoner.name)
    );

    res.status(200).send(summonerUserSubscribed);
  } catch (error) {
    console.error("Error in getting subscribed summoners: " + error);
    res.status(500).send("Error in getting subscribed summoners: " + error);
  }
};
exports.subscribptionStatus = async (req, res) => {
  try {
    firebaseUser = await req.user;

    const { summonerName, region } = req.params;
    console.log(
      "Getting subscription status of " +
        firebaseUser.uid +
        " -> " +
        summonerName
    );

    if (
      await hasUserSubscribedToSummoner(firebaseUser.uid, summonerName, region)
    ) {
      console.log("INDEED USER IS SUBSCRIBED TO SUMNMONER");
      res.status(200).send("true");
      return true;
    } else {
      res.status(200).send("false");
      return false;
    }
  } catch (error) {
    console.error("Error in getting subscription status: " + error);
    res.status(500).send("Error in getting subscription status: " + error);
  }
};
exports.getDisplayName = async (req, res) => {
  try {
    firebaseUser = await req.user;
    const user = await getUser(firebaseUser.uid);
    res.status(200).send(user.displayName);
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
    user.displayName = displayName;
    await user.save();
    console.log("Display name updated to : ", displayName);
    res.status(200).send("Display name updated");
  } catch (error) {
    console.error("Error in setting display name: " + error);
    res.status(500).send("Error in setting display name: " + error);
  }
};
