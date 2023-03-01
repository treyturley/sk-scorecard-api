const mongoose = require('mongoose');
const { Schema } = mongoose;

const scorecardSchema = new Schema(
  {
    gameId: {
      type: String,
      required: true,
      immutable: true,
    },
    name: {
      type: String,
      required: true,
      immutable: true,
    },
    status: {
      type: String,
      enum: ['STARTED', 'FINISHED'],
      default: 'STARTED',
    },
    scorecard: [
      {
        playerName: String,
        roundNumber: Number,
        bid: Number,
        tricks: Number,
        bonus: Number,
        roundTotal: Number,
      },
    ],
    playerTotals: [
      {
        playerName: String,
        total: Number,
        currentBid: Number,
      },
    ],
    currentRound: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Scorecard', scorecardSchema);
