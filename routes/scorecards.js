const express = require('express');
const router = express.Router();
const {
  getScorecards,
  getScorecardByGameId,
  addScorecard,
  updateScorecard,
  deleteScorecard,
  optionsScorecard,
} = require('../controllers/scorecards');

// GET scorecards and POST a scoreacard
router
  .route('/v1/scorecards')
  .get(getScorecards)
  .post(addScorecard)
  .options(optionsScorecard);

// GET/PUT/DELETE a scorecard by gameId
router
  .route('/v1/scorecards/:gameId')
  .get(getScorecardByGameId)
  .put(updateScorecard)
  .delete(deleteScorecard)
  .options(optionsScorecard);

module.exports = router;
