const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const config = {
  googleClientID: process.env.CLIENT_ID,
  googleClientSecret: process.env.CLIENT_SECRET,
  riotKey: process.env.RIOT_KEY,
  firebaseSaFile: path.join(__dirname, "../../", process.env.FIREBASE_SA_FILE),
};
module.exports = config;
