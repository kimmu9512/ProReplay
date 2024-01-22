const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const { connectDB, sequelize } = require("./config/db");
const app = express();
const { User } = require("./database/models/user");
const { Summoner } = require("./database/models/summoner");
const { UserSubscriptions } = require("./database/models/userSubscriptions");
const summonerController = require("./controllers/summonerController");
const cors = require("cors");
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
//YEs
// CORS OPTION FOR PRODUCTION
// const corsOptions = {
//   origin: "https://example.com",
//   optionsSuccessStatus: 200,
// };
// app.use(cors(corsOptions));
app.use(cors());
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

app.get("/", (req, res) => {
  console.log("Backend is running");

  res.send("Backend is running");
});
app.use("/login", require("./routes/userRoutes"));
app.use("/summoner", require("./routes/summonerRoutes"));
app.use("/assets", require("./routes/assetsRoutes"));
app.use("/game", require("./routes/gameRoutes"));
app.listen(3001, () => {
  console.log("Server started on port 3001");
  setInterval(async () => {
    try {
      console.log("Running scheduled check for active games");
      await summonerController.checkAllUserSubscriptions(); // Call the core logic function
    } catch (error) {
      console.error("Error during scheduled check for active games:", error);
    }
  }, 120000); // 120000 milliseconds = 2 minutes
});
