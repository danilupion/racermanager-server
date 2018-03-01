const mongoose = require('mongoose');

const timestamps = require('../plugins/mongoose/timestamps');

const CircuitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  countryCode: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
}, { collection: 'circuits' })
  .plugin(timestamps);

const model = mongoose.model('Circuit', CircuitSchema);

module.exports = model;
