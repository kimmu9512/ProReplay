const axios = require("axios");
const config = require("../../config/index");
class RiotManager {
  constructor() {}
  // Private field: Mapping of region codes to Riot API clusters
  #regionMap = {
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
  // private method: Converts a region code to a Riot API cluster
  #getClusterFromRegion(region) {
    return this.#regionMap[region.toLowerCase()] || region.toLowerCase();
  }
  // private method using a private method and field
  #generateSummonerLookupUrl(name, region, summonerTag) {
    const cluster = this.#getClusterFromRegion(region);
    return `https://${cluster}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${summonerTag}?api_key=${config.riotKey}`;
  }

  #generateSummonerLookUpByPuuid(puuid, region) {
    region = region.toLowerCase();
    return `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${config.riotKey}`;
  }

  #generateSummonerStatusUrl(riotId, region) {
    region = region.toLowerCase();
    return `https://${region}.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${riotId}?api_key=${config.riotKey}`;
  }
  async getSummoner(summonerName, region, summonerTag) {
    try {
      const summonerUrl = this.#generateSummonerLookupUrl(
        summonerName,
        region,
        summonerTag
      );
      const summonerResponse = await axios.get(summonerUrl);
      console.log(summonerResponse.data);

      const puuidUrl = this.#generateSummonerLookUpByPuuid(
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
  }
  async isInGame(riotId, region) {
    const url = this.#generateSummonerStatusUrl(riotId, region);
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
      if (error.response && error.response.status === 404) {
        return { isInGameStatus: false, data: null };
      } else {
        console.error("Error during API call : " + error);
        return { isInGameStatus: false, data: null };
      }
    }
  }
}
