const mongoose = require('mongoose');

const normalizeJSON = require('../plugins/mongoose/normalizeJSON');
const timestamps = require('../plugins/mongoose/timestamps');

const LeagueUserSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  money: {
    type: Number,
    required: true,
  },
})
  .plugin(normalizeJSON);

const LeagueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  season: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Season',
    required: true,
  },
  users: [LeagueUserSchema],
}, { collection: 'leagues' })
  .plugin(normalizeJSON)
  .plugin(timestamps)
  .index({ name: 1, season: 1 }, { unique: true });

const model = mongoose.model('League', LeagueSchema);

module.exports = model;
