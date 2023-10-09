const config = require("../config/index");
const generateSummonerLookupUrl = (name, region) => {
  const url = `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${config.riotKey}`;
  return url;
};
const generateSummonerStatusUrl = (riotId, region) => {
  const url = `https://${region}.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${riotId}?api_key=${config.riotKey}`;
  return url;
};
module.exports = {
  generateSummonerLookupUrl,
  generateSummonerStatusUrl,
};
