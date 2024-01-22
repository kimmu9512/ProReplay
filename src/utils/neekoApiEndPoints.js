const config = require("../config/index");
const generateSpectateSummonerUrl = (name, puuid, region) => {
  const domain = config.neekoDomain;
  const path = config.neekoRecord;
  region = region.toUpperCase();
  console.log("region is : " + region);
  const url = domain + path + "/" + name + "/" + puuid + "/" + region;
  console.log("generateSpectateSummonerUrl function has made the url: " + url);
  return url;
};
const generateWatchGameUrl = (gameId) => {
  const domain = config.neekoDomain;
  const path = config.neekoWatch;
  const url = domain + path + gameId;
  console.log("generateWatchGameUrl function has made the url: " + url);
  return url;
};
module.exports = {
  generateSpectateSummonerUrl,
  generateWatchGameUrl,
};
