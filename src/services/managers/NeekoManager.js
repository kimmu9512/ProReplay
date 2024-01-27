const config = require("../../config/index");
const axios = require("axios");
class NeekoManager {
  #domain;
  constructor() {
    this.#domain = config.neekoDomain;
  }
  #generateShUrl(gameId) {
    const path = config.neekoWatch;
    const url = this.#domain + path + gameId;
    return url;
  }
  #generateSpectateSummonerUrl(name, puuid, region) {
    const path = config.neekoRecord;
    region = region.toUpperCase();
    const url = this.#domain + path + "/" + name + "/" + puuid + "/" + region;

    return url;
  }
  async spectateSummoner(summoner) {
    if (!summoner) {
      console.error("Summoner not found");
      return null;
    }
    const url = this.#generateSpectateSummonerUrl(
      summoner.name,
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
  }
  async getReplaySh(gameId) {
    const url = this.#generateShUrl(gameId);
    try {
      console.log(" Getting response data ");
      const response = await axios.get(url);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Unexpected response from replaySh : ",
        error.response || error
      );
      throw error;
    }
  }
}
