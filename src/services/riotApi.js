const axios = require("axios");
const {
  generateSummonerLookupUrl,
  generateSummonerStatusUrl,
  generateSummonerLookUpByPuuid,
} = require("../utils/riotApiEndPoints");
const verifySummoner = async (summonerName, region, summonerTag) => {
  try {
    const summonerUrl = generateSummonerLookupUrl(
      summonerName,
      region,
      summonerTag
    );
    const summonerResponse = await axios.get(summonerUrl);
    console.log(summonerResponse.data);

    const puuidUrl = generateSummonerLookUpByPuuid(
      summonerResponse.data.puuid,
      region
    );
    const puuidResponse = await axios.get(puuidUrl);

    // Add summonerName and region to puuidResponse for later use
    puuidResponse.data.name = summonerName;
    puuidResponse.data.region = region;
    puuidResponse.data.tag = summonerTag;
    return puuidResponse.data;
  } catch (error) {
    console.error("Error : " + error);
    throw error;
  }
};
const isInGame = async (riotId, region) => {
  const url = generateSummonerStatusUrl(riotId, region);
  try {
    const response = await axios.get(url);
    console.log(response.data);
    if (response.status === 200) {
      return { isInGameStatus: true, data: response.data };
    }
    if (response.status === 404) {
      return { isInGameStatus: false, data: null };
    }
    console.error(
      "Unexpected response from generateSummonerStatusUrl : ",
      response
    );
    return { isInGameStatus: false, data: null };
  } catch (error) {
    if (error.response.status === 404) {
      return { isInGameStatus: false, data: null };
    } else {
      console.error("Error during API call : " + error);
      return { isInGameStatus: false, data: null };
    }
  }
};

module.exports = {
  verifySummoner,
  isInGame,
};
