const express = require("express");
const router = express.Router();
const summonerController = require("../controllers/summonerController");
// unprotected routes (no token needed)
router.post("/inGame", summonerController.checkActiveGames);
module.exports = router;
