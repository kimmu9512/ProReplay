const passport = require("passport");
const User = require("../database/models/user");
const admin = require("../config/firebaseAdmin");
const {
  auth,
  createUserWithEmailAndPassword,
} = require("../config/firebaseClient");
// Firebase will handle the registration on the client side.
// This route is for storing additional user details in the database.
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
