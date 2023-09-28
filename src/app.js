require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/proreplayDB');
app.use(
    session({
      secret: 'DOG',
      resave: false,
      saveUninitialized: false,
    })
  );

app.use(passport.initialize());
app.use(passport.session());
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
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/login/auth/google/callback',
      userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
      scope: ['profile', 'email'], // Include the 'email' scope
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile);
      console.log('hello');
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        console.log('hello world');
        console.log(accessToken);
        return cb(err, user);
      });
    }
  )
);