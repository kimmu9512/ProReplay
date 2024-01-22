const express = require("express");
const router = express.Router();
const assetController = require("../controllers/assetsController");
router.get("/championLogo/:championId", assetController.getChampionLogo);
router.get("/championName/:championId", assetController.getChampionName);
router.get("/summonerSpellLogo/:spellId", assetController.getSummonerSpell);
router.get("/profileIcon/:iconId", assetController.getProfileIcon);
module.exports = router;
