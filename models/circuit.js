const mongoose = require('mongoose');

const timestamps = require('../plugins/mongoose/timestamps');

const CircuitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
  championship: {
    type: String,
    required: true,
  },
}, { collection: 'circuits' })
  .plugin(timestamps)
  .index({ name: 1, championship: 1 }, { unique: true });

const model = mongoose.model('Circuit', CircuitSchema);

module.exports = model;
