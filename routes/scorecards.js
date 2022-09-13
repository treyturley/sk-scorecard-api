const express = require('express');
const router = express.Router();
const {
  getScorecards,
  getScorecardById,
  addScorecard,
  updateScorecard,
  deleteScorecard
} = require('../controllers/scorecards');


// GET scorecards and POST a scoreacard
router.route('/')
  .get(getScorecards)
  .post(addScorecard);

// GET/PUT/DELETE a scorecard by id
router.route('/:id')
  .get(getScorecardById)
  .put(updateScorecard)
  .delete(deleteScorecard);


module.exports = router;