const { get } = require("mongoose");
const config = require("../config/index");
// Mapping of region codes to Riot API clusters
const regionMap = {
  na1: "americas",
  br1: "americas",
  la1: "americas",
  la2: "americas",
  oc1: "americas",
  eun1: "europe",
  euw1: "europe",
  tr1: "europe",
  ru: "europe",
  jp1: "asia",
  kr: "asia",
  tw1: "asia",
};

// Converts a region code to a Riot API cluster
const getClusterFromRegion = (region) => {
  return regionMap[region.toLowerCase()] || region.toLowerCase();
};

const generateSummonerLookupUrl = (name, region, summonerTag) => {
  const cluster = getClusterFromRegion(region);
  // Generate the lookup URL
  const url = `https://${cluster}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${summonerTag}?api_key=${config.riotKey}`;
  return url;
};
const generateSummonerLookUpByPuuid = (puuid, region) => {
  region = region.toLowerCase();
  const url = `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${config.riotKey}`;
  return url;
};
const generateSummonerStatusUrl = (riotId, region) => {
  region = region.toLowerCase();
  const url = `https://${region}.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${riotId}?api_key=${config.riotKey}`;
  return url;
};
module.exports = {
  generateSummonerLookupUrl,
  generateSummonerStatusUrl,
  generateSummonerLookUpByPuuid,
};
