const express = require('express');
const router = express.Router();
const {
  getScorecards,
  getScorecardById,
  addScorecard,
  updateScorecard,
  deleteScorecard,
  optionsScorecard
} = require('../controllers/scorecards');


// GET scorecards and POST a scoreacard
router.route('/v1/scorecards')
  .get(getScorecards)
  .post(addScorecard)
  .options(optionsScorecard);

// GET/PUT/DELETE a scorecard by id
router.route('/v1/scorecards/:id')
  .get(getScorecardById)
  .put(updateScorecard)
  .delete(deleteScorecard)
  .options(optionsScorecard);


module.exports = router;