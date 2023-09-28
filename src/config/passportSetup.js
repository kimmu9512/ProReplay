const passport = require("passport");
const User = require("../database/models/user.js");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const config = require("./index.js");

passport.use(User.createStrategy());
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  User.findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err, null);
    });
});
passport.use(new LocalStrategy(User.authenticate()));
passport.use(
  new GoogleStrategy(
    {
      clientID: config.googleClientID,
      clientSecret: config.googleClientSecret,
      callbackURL: "http://localhost:3000/login/auth/google/callback",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
      scope: ["profile", "email"], // Include the 'email' scope
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile);
      console.log("hello");
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        console.log("hello world");
        console.log(accessToken);
        return cb(err, user);
      });
    }
  )
);
