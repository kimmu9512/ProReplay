class GameManager {
  constructor(gameModel) {
    this.Game = gameModel;
  }
  async getGame(gameId) {
    try {
      const game = await this.Game.findOne({
        where: { riotGameId: gameId },
      });
      return game;
    } catch (error) {
      console.error(
        "Error in finding game with gameId" + gameId + "with error of: ",
        error
      );
      throw error;
    }
  }
  async createGame(gameId) {
    try {
      const game = await this.Game.create({
        riotGameId: gameId,
      });
    } catch (error) {
      console.error(
        "Error in creating game with gameId" + gameId + "with error of: ",
        error
      );
      throw error;
    }
  }
}
