const mongoose = require("mongoose");
const findOrCreatePlugin = require("mongoose-findorcreate");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");
const summonerSchema = new mongoose.Schema(
  {
    summonerName: { type: String, required: true },
    region: { type: String, required: true },
    puuid: { type: String, required: true },
    accountId: { type: String, required: true },
    riotId: { type: String, required: true },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema({
  firebaseUID: {
    type: String,
    unique: true,
    required: true,
  },
  additionalData: {
    displayName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  subscribed: {
    type: [summonerSchema],
    default: [],
  },
});
//plugin passport-local mongoose for autentication
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

userSchema.index(
  { firebaseUID: 1, "subscribed.summonerName": 1, "subscribed.region": 1 },
  { unique: true }
);
const User = mongoose.model("User", userSchema);

module.exports = User;
