const hri = require('human-readable-ids');
const scorecards = require('../scorecards');


/**
 * Get all scorecards
 * @route GET /api/v1/scorecards
 */
exports.getScorecards = async (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  try {
    res.json(scorecards);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}

/**
 * Get scorecard by id
 * @route GET /api/v1/scorecards/:id
 */
exports.getScorecardById = async (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  try {
    const found = scorecards.some(scorecard => scorecard.id === req.params.id);
    if (found) {
      res.json(scorecards.filter(scorecard => scorecard.id === req.params.id)[0]);
    } else {
      res.status(400).json({ msg: `No scorecard with id of ${req.params.id}` });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}

/**
 * add a scorecard
 * @route POST /api/v1/scorecards
 */
exports.addScorecard = async (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  try {
    const newScorecard = {
      id: hri.humanReadableIds.random(),
      name: req.body.name,
      status: req.body.status,
      scorecard: req.body.scorecard,
      playerTotals: req.body.playerTotals,
      currentRound: req.body.currentRound
    }

    //check for incomplete scorecard
    if (!newScorecard.name || !newScorecard.scorecard || !newScorecard.playerTotals) {
      return res.status(400).json({ msg: 'Incomplete scorecard received. Please send scorecard name, a scoreard, and playerTotals' });
    }

    // add to server's scorecard array
    scorecards.push(newScorecard);

    // console.log(newScorecard);

    // TODO: consider having the server save the current scorecards to a local file

    // respond with newly created object
    res.location('/api/v1/scorecards/' + newScorecard.id);
    res.status(201).json(newScorecard);

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: `Server Error: ${error}`
    });
  }
}

/**
 * update a scorecard
 * @route PUT /api/v1/scorecards/:id
 */
exports.updateScorecard = async (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  try {
    const found = scorecards.some(scorecard => scorecard.id === req.params.id);

    if (found) {
      const newScorecard = req.body;

      scorecards.forEach(scorecard => {
        if (scorecard.id === req.params.id) {
          // update values that were in the body otherwise use old value
          scorecard.status = newScorecard.status || scorecard.status;
          scorecard.scorecard = newScorecard.scorecard || scorecard.scorecard;
          scorecard.playerTotals = newScorecard.playerTotals || scorecard.playerTotals;
          scorecard.currentRound = newScorecard.currentRound || scorecard.currentRound;

          //send response with updated obj
          res.json(scorecard);
          // console.log(scorecard);

          // push update to all sockets in this game room
          req.io.to(scorecard.id).emit('update-game', scorecard);

          // TODO: Consider saving the updated scorecards array to a file
        }
      });
    } else {
      res.status(400).json({ msg: `No scorecard with id of ${req.params.id}` });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}

/**
 * 
 * delete a scorecard
 * @route DELETE /api/v1/scorecards/:id
 * @returns 
 */
exports.deleteScorecard = async (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  try {
    const indexToRemove = scorecards.findIndex(scorecard => scorecard.id === req.params.id);

    if (indexToRemove != -1) {
      scorecards.splice(indexToRemove, 1);

      // TODO: Consider saving the updated scorecards array to a file

      res.status(204).send();

    } else {
      res.status(400).json({ msg: `No scorecard with id of ${req.params.id}` });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}


exports.optionsScorecard = async (req, res, next) => {
  // TODO: maybe review the headers in the request to make sure we want to serve this client
  try {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "GET, PUT");
    res.status(200).send();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}
