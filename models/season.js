const mongoose = require('mongoose');

const timestamps = require('../plugins/mongoose/timestamps');

const SeasonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  from: {
    type: Date,
    required: true,
  },
  to: {
    type: Date,
    required: true,
  },
  championship: {
    type: String,
    required: true,
  },
}, { collection: 'seasons' })
  .plugin(timestamps);

const model = mongoose.model('Season', SeasonSchema);

module.exports = model;
