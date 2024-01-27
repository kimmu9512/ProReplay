const NeekoManager = require("./NeekoManager");
const RiotApiManager = require("./RiotApiManager");

class ExternalApiManager {
  constructor() {
    this.riotApi = new RiotApiManager();
    this.neekoApi = new NeekoManager();
  }
}
