const axios = require("axios");
const {
  generateSpectateSummonerUrl,
  generateWatchGameUrl,
} = require("../utils/neekoApiEndPoints");
const { verifySummoner, isInGame } = require("./riotApi");
const { getSummoner } = require("../database/utils/dbHelpers");
const spectateSummoner = async (summonerName, region, summonerTag) => {
  const summoner = await getSummoner(summonerName, region, summonerTag);
  if (!summoner) {
    console.error("Summoner not found");
    return null;
  }
  const url = generateSpectateSummonerUrl(
    summonerName,
    summoner.puuid,
    summoner.region
  );
  try {
    const response = await axios.get(url);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error : " + error);
    throw error;
  }
};
const replaySh = async (gameId) => {
  const url = generateWatchGameUrl(gameId);
  console.log("url is : " + url);
  try {
    console.log(" Getting response data ");
    const response = await axios.get(url);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Unexpected response from replaySh : ", response);
    throw error;
  }
};

module.exports = {
  spectateSummoner,
  replaySh,
};
