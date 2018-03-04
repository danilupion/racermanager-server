const mongoose = require('mongoose');

const normalizeJSON = require('../plugins/mongoose/normalizeJSON');
const timestamps = require('../plugins/mongoose/timestamps');

const ResultSchema = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true,
  },
  position: {
    type: Number,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  accumulatedPoints: {
    type: Number,
    required: true,
  },
  accumulatedFitness: {
    type: Number,
    required: true,
  },
})
  .plugin(normalizeJSON);

const SeasonGrandPrixSchema = new mongoose.Schema({
  circuit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Circuit',
    required: true,
  },
  grandPrix: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GrandPrix',
    required: true,
  },
  firstPracticeUTC: {
    type: Date,
    required: true,
  },
  secondPracticeUTC: {
    type: Date,
    required: true,
  },
  thirdPracticeUTC: {
    type: Date,
    required: true,
  },
  qualifyingUTC: {
    type: Date,
    required: true,
  },
  raceUTC: {
    type: Date,
    required: true,
  },
  results: [ResultSchema],
})
  .plugin(normalizeJSON)
  .plugin(timestamps);

const TeamDriverSchema = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true,
  },
  initialValue: {
    type: Number,
    required: true,
  },
})
  .plugin(normalizeJSON);

const SeasonTeamSchema = new mongoose.Schema({
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  countryCode: {
    type: String,
    required: true,
  },
  drivers: [TeamDriverSchema],
})
  .plugin(normalizeJSON);

const SeasonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  championship: {
    type: String,
    required: true,
  },
  grandsPrix: [SeasonGrandPrixSchema],
  teams: [SeasonTeamSchema],
}, { collection: 'seasons' })
  .plugin(normalizeJSON)
  .plugin(timestamps);

const model = mongoose.model('Season', SeasonSchema);

module.exports = model;
