const express = require("express");
const router = express.Router();
const summonerController = require("../controllers/summonerController");
router.get("/replays/:gameId", summonerController.watchReplay);
module.exports = router;
