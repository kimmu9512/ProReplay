const axios = require("axios");
const {
  generateSummonerLookupUrl,
  generateSummonerStatusUrl,
} = require("../utils/riotApiEndPoints");
const verifySummoner = async (summonerName, region) => {
  const url = generateSummonerLookupUrl(summonerName, region);
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error : " + error);
    throw error;
  }
};
const isInGame = async (riotId, region) => {
  const url = generateSummonerStatusUrl(riotId, region);
  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      return true;
    }
    if (response.status === 404) {
      return false;
    }
    console.error(
      "Unexpected response from generateSummonerStatusUrl : ",
      response
    );
    return false;
  } catch (error) {
    if (error.response.status === 404) {
      return false;
    } else {
      console.error("Error during API call : " + error);
      return false;
    }
  }
};

module.exports = {
  verifySummoner,
  isInGame,
};
