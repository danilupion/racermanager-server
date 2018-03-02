const mongoose = require('mongoose');

const timestamps = require('../plugins/mongoose/timestamps');

const DriverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  code: {
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
}, { collection: 'drivers' })
  .plugin(timestamps);

const model = mongoose.model('Driver', DriverSchema);

module.exports = model;
