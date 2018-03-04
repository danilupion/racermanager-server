const mongoose = require('mongoose');

const normalizeJSON = require('../plugins/mongoose/normalizeJSON');
const timestamps = require('../plugins/mongoose/timestamps');

const DriverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
  .plugin(normalizeJSON)
  .plugin(timestamps)
  .index({ name: 1, championship: 1 }, { unique: true })
  .index({ code: 1, championship: 1 }, { unique: true });


const model = mongoose.model('Driver', DriverSchema);

module.exports = model;
