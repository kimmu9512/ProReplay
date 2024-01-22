const championFull = require("../assets/ddragon/patch/data/en_US/championFull.json");
const summonerSpells = require("../assets/ddragon/patch/data/en_US/summoner.json");
const summonerSpellsMap = {};
Object.keys(summonerSpells.data).forEach((key) => {
  const spell = summonerSpells.data[key];
  summonerSpellsMap[spell.key] = spell.id;
});
const path = require("path");
const fs = require("fs");
exports.getChampionName = async (req, res) => {
  const championId = req.params.championId;
  const championName = championFull.keys[championId];
  res.status(200).json({ championName });
};
exports.getChampionLogo = async (req, res) => {
  const championId = req.params.championId;
  const championName = championFull.keys[championId];
  const logoPath = path.join(
    __dirname,
    "..",
    "assets",
    "ddragon",
    "patch",
    "img",
    "champion",
    `${championName}.png`
  );
  // Read the logo using a stream
  const logoStream = fs.createReadStream(logoPath);
  logoStream.on("open", () => {
    res.set("Content-Type", "image/jpeg"); // Set the correct content type
    res.set("Content-Disposition", "inline"); // Image will be displayed in the browser rather than downloaded
    logoStream.pipe(res); // Pipe the stream to the response
  });
  // Handle errors
  logoStream.on("error", (error) => {
    res.status(404).send("Image not found");
  });
};
exports.getSummonerSpell = async (req, res) => {
  const spellId = req.params.spellId;
  console.log("spellId: " + spellId);
  console.log("Spell name is " + summonerSpellsMap[spellId]);

  const spellName = summonerSpellsMap[spellId];
  const spellPath = path.join(
    __dirname,
    "..",
    "assets",
    "ddragon",
    "patch",
    "img",
    "spell",
    `${spellName}.png`
  );
  // Read the logo using a stream
  const spellStream = fs.createReadStream(spellPath);
  spellStream.on("open", () => {
    res.set("Content-Type", "image/jpeg"); // Set the correct content type
    res.set("Content-Disposition", "inline"); // Image will be displayed in the browser rather than downloaded
    spellStream.pipe(res); // Pipe the stream to the response
  });
  // Handle errors
  spellStream.on("error", (error) => {
    res.status(404).send("Image not found");
  });
};
exports.getProfileIcon = async (req, res) => {
  const iconId = req.params.iconId;
  console.log("iconId: " + iconId);
  const iconPath = path.join(
    __dirname,
    "..",
    "assets",
    "ddragon",
    "patch",
    "img",
    "profileicon",
    `${iconId}.png`
  );
  // Read the logo using a stream
  const iconStream = fs.createReadStream(iconPath);
  iconStream.on("open", () => {
    res.set("Content-Type", "image/jpeg"); // Set the correct content type
    res.set("Content-Disposition", "inline"); // Image will be displayed in the browser rather than downloaded
    iconStream.pipe(res); // Pipe the stream to the response
  });
  // Handle errors
  iconStream.on("error", (error) => {
    res.status(404).send("Image not found");
  });
};
