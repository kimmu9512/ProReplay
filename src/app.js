const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const { connectDB, sequelize } = require("./config/db");
const app = express();
const { User } = require("./database/models/user");
const { Summoner } = require("./database/models/summoner");
const { UserSubscriptions } = require("./database/models/userSubscriptions");
// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "DOG",
    resave: false,
    saveUninitialized: false,
  })
);

// Database
connectDB();
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database table created/connected");
  })
  .catch((error) => {
    console.error("Error creating tables: ", error);
  });
app.use("/login", require("./routes/userRoutes"));
app.use("/summoner", require("./routes/summonerRoutes"));
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
