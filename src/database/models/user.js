const mongoose = require("mongoose");
const findOrCreatePlugin = require("mongoose-findorcreate");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");
const userSchema = new mongoose.Schema({
  name: String,
  ign: String,
  ignid: String,
  username: String,
  password: String,
  googleId: String,
  subscribed: {
    type: [
      {
        id: String,
        accountId: {
          type: String,
          unique: true,
        },
        summonerName: String,
        region: String,
        puuid: String,
      },
    ],
    default: [],
  },
});
//plugin passport-local mongoose for autentication
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
const User = mongoose.model("User", userSchema);

module.exports = User;
