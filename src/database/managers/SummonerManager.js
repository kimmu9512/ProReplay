class SummonerManager {
  constructor(summonerModel, gameSummonerModel) {
    this.Summoner = summonerModel;
    this.GameSummoner = gameSummonerModel;
  }
  async getSummoner(summonerName, region, summonerTag) {
    try {
      // Normalize region to lowercase for consistency
      const normalizedRegion = region.toLowerCase();

      // Attempt to find the summoner in the database
      let summoner = await this.Summoner.findOne({
        where: {
          name: summonerName,
          region: normalizedRegion,
          tag: summonerTag,
        },
      });

      // If the summoner isn't found in the database, check with Riot API
      if (!summoner) {
        return null;
      } else {
        return summoner;
      }
      return summoner;
    } catch (error) {
      console.error("Error in getting summoner: ", error);
      throw error;
    }
  }
  async createSummoner(summonerName, region, summonerTag, riotData) {
    try {
      // Normalize region to lowercase for consistency
      const normalizedRegion = region.toLowerCase();
      summoner = await this.Summoner.create({
        name: summonerName,
        region: normalizedRegion,
        tag: summonerTag,
        ...riotData,
      });
      return summoner;
    } catch (error) {
      console.error("Error in creating summoner: ", error);
      throw error;
    }
  }
  async getGameSummoner(summonerId, gameId) {
    try {
      const gameSummoner = await this.GameSummoner.findOne({
        where: {
          summonerId: summonerId,
          riotGameId: gameId,
        },
      });
      if (!gameSummoner) {
        return null;
      } else {
        return gameSummoner;
      }
    } catch (error) {
      console.error("Error in getting game summoner: ", error);
      throw error;
    }
  }
  async createGameSummoner(summonerId, gameId, participant) {
    try {
      const gameSummoner = await this.GameSummoner.create({
        teamId: participant.teamId,
        riotGameId: gameId,
        summonerId: participant.summonerId,
        championId: participant.championId,
        spell1Id: participant.spell1Id,
        spell2Id: participant.spell2Id,
        name: participant.summonerName,
        region: participant.platformId.toLowerCase(),
      });
      return gameSummoner;
    } catch (error) {
      console.error("Error in creating game summoner: ", error);
      throw error;
    }
  }
  async getGameSummoners(gameId, summonerId) {
    try {
      let whereCondition = {};

      // Add gameId to the where condition if it's provided
      if (gameId) {
        whereCondition.riotGameId = gameId;
      }
      if (summonerId) {
        // If gameId is also provided, exclude this summonerId
        // Otherwise, just query based on summonerId
        whereCondition.summonerId = gameId
          ? { [Op.ne]: summonerId }
          : summonerId;
      }
      if (teamId) {
        whereCondition.teamId = teamId;
      }
      const gameSummoners = await this.GameSummoner.findAll({
        where: whereCondition,
      });
      return gameSummoners;
    } catch (error) {
      console.error("Error in getting game summoners: ", error);
      throw error;
    }
  }
}
