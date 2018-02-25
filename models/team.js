const mongoose = require('mongoose');

const timestamps = require('../plugins/mongoose/timestamps');

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  countryCode: {
    type: String,
    required: true,
  },
  championship: {
    type: String,
    required: true,
  },
}, { collection: 'teams' })
  .plugin(timestamps);

const model = mongoose.model('Team', TeamSchema);

module.exports = model;
