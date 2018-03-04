const mongoose = require('mongoose');

const normalizeJSON = require('../plugins/mongoose/normalizeJSON');
const email = require('../plugins/mongoose/email');
const password = require('../plugins/mongoose/password');
const timestamps = require('../plugins/mongoose/timestamps');

const ROLES = {
  user: 'user',
  admin: 'admin',
};

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
    enum: Object.keys(ROLES).map(roleKey => ROLES[roleKey]),
    default: ROLES.user,
  },
}, { collection: 'users' })
  .plugin(normalizeJSON)
  .plugin(email)
  .plugin(password)
  .plugin(timestamps);

// TODO Probably for production autoIndex should be disabled as suggested by mongoose documentation

const model = mongoose.model('User', UserSchema);

model.ROLES = ROLES;

module.exports = model;
