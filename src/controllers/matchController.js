const RecordedMatch = require("../database/models/recordedMatch");
const Summoner = require("../database/models/summoner");

exports.getRecordedMatch = async (req, res) => {
  const { matchId } = req.params;
  const { summonerId } = req.params;

  try {
    const recordedMatch = await RecordedMatch.findOne({
      where: { matchId: matchId, summonerId: summonerId },
    });
    if (recordedMatch) {
      res.status(200).send(recordedMatch);
    } else {
      res.status(404).send("No recorded match found");
    }
  } catch (error) {
    console.error("Error in getting recorded match: " + error);
    res.status(500).send("Error in getting recorded match: " + error);
  }
};
