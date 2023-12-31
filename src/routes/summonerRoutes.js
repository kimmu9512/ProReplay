const express = require("express");
const router = express.Router();
const summonerController = require("../controllers/summonerController");
// unprotected routes (no token needed)
router.post("/inGame", summonerController.checkActiveGames);
router.get("/:summonerId/matches", summonerController.getMatches);
router.get("/:region/:summonerName", summonerController.getSummoner);
module.exports = router;
