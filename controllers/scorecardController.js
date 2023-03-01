const hri = require('human-readable-ids');
const asyncHandler = require('express-async-handler');

const Scorecard = require('../models/scorecardModel');
const { getGameByGameId } = require('../services/scorecardService');

let origin = process.env.CORS_ORIGIN;

/**
 * Get all scorecards
 * @route GET /v1/scorecards
 */
exports.getScorecards = asyncHandler(async (req, res, next) => {
  res.header('Access-Control-Allow-Origin', origin);
  const scorecards = await Scorecard.find({});
  res.json(scorecards);
});

/**
 * Get scorecard by gameId
 * @route GET /v1/scorecards/:gameId
 */
exports.getScorecardByGameId = asyncHandler(async (req, res, next) => {
  res.header('Access-Control-Allow-Origin', origin);

  const scorecard = await getGameByGameId(req.params.gameId);

  if (!scorecard) {
    res.status(404);
    throw new Error('Scorecard not found');
  }

  res.json(scorecard);
});

/**
 * add a scorecard
 * @route POST /v1/scorecards
 */
exports.addScorecard = asyncHandler(async (req, res, next) => {
  res.header('Access-Control-Allow-Origin', origin);

  const { name, status, scorecard, playerTotals, currentRound } = req.body;

  if (!name || !status || !scorecard || !playerTotals || !currentRound) {
    return res.status(400).json({
      msg: 'Incomplete scorecard received. Please send a complete scorecard with name, status, scorecard, playerTotals, and current round',
    });
  }

  const gameId = hri.humanReadableIds.random();

  const newScorecard = await Scorecard.create({
    gameId,
    name,
    status,
    scorecard,
    playerTotals,
    currentRound,
  });

  // respond with newly created object
  res.location('/api/sk-scorecard-api/v1/scorecards/' + newScorecard.gameId);
  res.status(201).json(newScorecard);
});

/**
 * update a scorecard
 * @route PUT /v1/scorecards/:gameId
 */
exports.updateScorecard = asyncHandler(async (req, res, next) => {
  res.header('Access-Control-Allow-Origin', origin);

  const updatedScorecard = await Scorecard.findOneAndUpdate(
    { gameId: req.params.gameId },
    { $set: req.body },
    { new: true }
  );

  if (!updatedScorecard) {
    res.status(404);
    throw new Error('Scorecard not found');
  }
  // push update to all sockets in this game room
  req.io.to(updatedScorecard.gameId).emit('update-game', updatedScorecard);

  res.json(updatedScorecard);
});

/**
 *
 * delete a scorecard
 * @route DELETE /v1/scorecards/:gameId
 * @returns
 */
exports.deleteScorecard = asyncHandler(async (req, res, next) => {
  res.header('Access-Control-Allow-Origin', origin);

  const deletedScorecard = await Scorecard.findOneAndDelete({
    gameId: req.params.gameId,
  });

  if (!deletedScorecard) {
    res.status(404);
    throw new Error('Scorecard not found');
  }

  res.status(204).send();
});

exports.optionsScorecard = asyncHandler(async (req, res, next) => {
  try {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET, PUT');
    res.status(200).send();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
});
