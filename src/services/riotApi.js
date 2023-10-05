const axios = require("axios");
const { generateSummonerLookupUrl } = require("../utils/riotApiEndPoints");
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

module.exports = {
  verifySummoner,
};
