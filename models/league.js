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
  drivers: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Season',
    }],
    default: [],
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

const onlyUnique = (value, index, self) => self.indexOf(value) === index;

LeagueSchema.pre('save', function validate(next) {
  const users = this.users.map(item => item.user.toString());

  if (users.length > users.filter(onlyUnique).length) {
    return next(new Error('Duplicate user'));
  }

  return next();
});

const model = mongoose.model('League', LeagueSchema);

module.exports = model;
