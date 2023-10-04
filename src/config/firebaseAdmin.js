const admin = require("firebase-admin");
const config = require("./index");
const serviceAccount = require(config.firebaseSaFile);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
module.exports = admin;
