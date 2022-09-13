const uuid = require('uuid');
const scorecards = require('../scorecards');


/**
 * Get all scorecards
 * @route GET /api/v1/scorecards
 */
exports.getScorecards = async (req, res, next) => {
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
  try {
    const found = scorecards.some(scorecard => scorecard.id === req.params.id);
    if (found) {
      res.json(scorecards.filter(scorecard => scorecard.id === req.params.id));
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
  try {
    const newScorecard = {
      id: uuid.v4(),
      name: req.body.name,
      gameStatus: "STARTED",
      scorecard: req.body.scorecard,
      playerTotals: req.body.playerTotals
    }

    //check for incomplete scorecard
    if (!newScorecard.name || !newScorecard.scorecard || !newScorecard.playerTotals) {
      return res.status(400).json({ msg: 'Incomplete scorecard received. Please send scorecard name, a scoreard, and playerTotals' });
    }

    // add to server's scorecard array
    scorecards.push(newScorecard);

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
  try {
    const found = scorecards.some(scorecard => scorecard.id === req.params.id);

    if (found) {
      const newScorecard = req.body;

      scorecards.forEach(scorecard => {
        if (scorecard.id === req.params.id) {
          // update values that were in the body otherwise use old value
          scorecard.gameStatus = newScorecard.gameStatus || scorecard.gameStatus;
          scorecard.scorecard = newScorecard.scorecard || scorecard.scorecard;
          scorecard.playerTotals = newScorecard.playerTotals || scorecard.playerTotals;

          //send response with updated obj
          res.json(scorecard);

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
