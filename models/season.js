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
  initialPrice: {
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
  .plugin(timestamps)
  .index({ name: 1, championship: 1 }, { unique: true });

SeasonSchema.set('toJSON', {
  transform: async (doc, json) => {
    /* eslint-disable no-param-reassign, no-underscore-dangle */
    json.id = json._id;
    delete json._id;
    delete json.__v;
    /* eslint-enable no-underscore-dangle */

    await Promise.all([
      doc.populate('teams.team').execPopulate(),
      doc.populate('drivers.driver').execPopulate(),
      doc.populate('grandsPrix.circuit').execPopulate(),
      doc.populate('grandsPrix.grandPrix').execPopulate(),
    ]);

    json.drivers = [];
    json.teams = [];
    json.grandsPrix = [];

    json.currentTradePercentageFee = 0.05; // TODO: Calculate properly

    const drivers = [...doc.drivers];

    // eslint-disable-next-line no-restricted-syntax
    for (const driverDoc of drivers) {
      const { id, driver: driverJson, initialPrice } = driverDoc.toJSON();
      driverJson.driverId = driverJson.id;
      delete driverJson.id;

      json.drivers.push({
        ...driverJson,
        id,
        initialPrice,
        points: 0, // TODO: Calculate points
        fitness: 0, // TODO: Calculate fitness
        price: initialPrice, // TODO: calculate current value with results + fitness + team factor
      });
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const teamDoc of doc.teams) {
      const teamJson = teamDoc.toJSON();
      teamJson.teamId = teamJson.team.id;
      teamJson.code = teamJson.team.name;
      teamJson.championship = teamJson.team.championship;
      teamJson.bonus = 0; // TODO: Calculate team bonus
      delete teamJson.team;

      const teamDrivers = [...teamJson.drivers];
      delete teamJson.drivers;
      teamJson.driverIds = teamDrivers;

      json.teams.push(teamJson);
    }

    const grandsPrix = [...doc.grandsPrix];

    // eslint-disable-next-line no-restricted-syntax
    for (const grandPrixDoc of grandsPrix) {
      const grandPrixJson = grandPrixDoc.toJSON();
      const { id, grandPrix, circuit } = grandPrixJson;
      delete grandPrixJson.grandPrix;

      grandPrixJson.grandPrixId = grandPrix.id;
      delete grandPrixJson.id;

      circuit.circuitId = circuit.id;
      delete circuit.id;

      json.grandsPrix.push({
        ...grandPrix,
        ...grandPrixJson,
        id,
      });
    }

    return json;
    /* eslint-enable no-param-reassign */
  },
});

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
