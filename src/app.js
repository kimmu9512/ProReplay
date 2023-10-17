const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const { connectDB, sequelize } = require("./config/db");
const app = express();
const { User } = require("./database/models/user");
const { Summoner } = require("./database/models/summoner");
const { UserSubscriptions } = require("./database/models/userSubscriptions");
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
app.listen(3001, () => {
  console.log("Server started on port 3000");
});
