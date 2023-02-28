const Scorecard = require('../models/scorecardModel');

/**
 * Retrieves the game details from the mongo DB for given game ID.
 * @param {*} gameId - the game Id to search for in the database.
 * @returns a mongoose query object. A query also has a .then() function, and thus can be used as a
 * promise which means this should be treated as a promise for our use cases.
 */
exports.getGameByGameId = (gameId) => {
  const query = Scorecard.where({ gameId: gameId });
  const scorecard = query.findOne();
  return scorecard;
};
