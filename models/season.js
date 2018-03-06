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
  practice1UTC: {
    type: Date,
    required: true,
  },
  practice2UTC: {
    type: Date,
    required: true,
  },
  practice3UTC: {
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

const SeasonDriverSchema = new mongoose.Schema({
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
  drivers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
  }],
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
  drivers: [SeasonDriverSchema],
}, { collection: 'seasons' })
  .plugin(normalizeJSON)
  .plugin(timestamps)
  .index({ name: 1, championship: 1 }, { unique: true });

const onlyUnique = (value, index, self) => self.indexOf(value) === index;

SeasonSchema.pre('save', function validate(next) {
  const drivers = this.drivers.map(item => item.driver.toString());
  const teams = this.teams.map(item => item.team.toString());

  if (drivers.length > drivers.filter(onlyUnique).length) {
    return next(new Error('Duplicate driver'));
  }

  if (teams.length > teams.filter(onlyUnique).length) {
    return next(new Error('Duplicate team'));
  }
  return next();
});

const model = mongoose.model('Season', SeasonSchema);

module.exports = model;
