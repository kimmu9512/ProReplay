const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const connectDB = require("./config/db");
const proReplayPassport = require("./config/passportSetup");
const app = express();
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
app.use(proReplayPassport.initialize());
app.use(proReplayPassport.session());

// Database
connectDB();
console.log("connected to database");

app.use("/login", require("./routes/userRoutes"));
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
