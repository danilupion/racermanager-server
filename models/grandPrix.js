const mongoose = require('mongoose');

const normalizeJSON = require('../plugins/mongoose/normalizeJSON');
const timestamps = require('../plugins/mongoose/timestamps');

const GrandPrixSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  countryCode: {
    type: String,
    required: true,
  },
  championship: {
    type: String,
    required: true,
  },
}, { collection: 'grandsPrix' })
  .plugin(normalizeJSON)
  .plugin(timestamps)
  .index({ name: 1, championship: 1 }, { unique: true });

const model = mongoose.model('GrandPrix', GrandPrixSchema);

module.exports = model;
