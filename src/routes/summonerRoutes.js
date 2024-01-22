const express = require("express");
const router = express.Router();
const summonerController = require("../controllers/summonerController");
// unprotected routes (no token needed)
router.get("/replay/:gameId", summonerController.watchReplay);

router.post("/inGame", summonerController.checkActiveGames);
router.get(
  "/:region/:summonerName/:summonerTag",
  summonerController.getSummonerByRegionAndName
);
// TODO: check if this function is actually used
router.get(
  "/gameId/:region/:summonerName/:summonerTag",
  summonerController.getGameIdBySummonerNameAndRegion
);
router.get(
  "/gameCard/:gameId/:region/:SummonerName/:summonerTag",
  summonerController.getGameCardWithGameIdAndSummoner
);
router.get(
  "/gameCard/:region/:summonerName/:summonerTag",
  summonerController.getAllGameCardsForSummoner
);
router.get(
  "/startRecording/:region/:summonerName/:summonerTag",
  summonerController.startRecording
);

module.exports = router;
