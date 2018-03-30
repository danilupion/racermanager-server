const mongoose = require('mongoose');

const normalizeJSON = require('../plugins/mongoose/normalizeJSON');
const timestamps = require('../plugins/mongoose/timestamps');

const TransactionItemSchema = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const LeagueTransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  transactionFee: {
    type: Number,
    required: true,
  },
  moneyBefore: {
    type: Number,
    required: true,
  },
  moneyAfter: {
    type: Number,
    required: true,
  },
  sales: {
    type: [TransactionItemSchema],
    required: true,
  },
  purchases: {
    type: [TransactionItemSchema],
    required: true,
  },
})
  .plugin(timestamps);

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
  transactions: [LeagueTransactionSchema],
}, { collection: 'leagues' })
  .plugin(timestamps)
  .index({ name: 1, season: 1 }, { unique: true });

const userJsonTransformation = json => ({
  money: json.money,
  points: 0, // TODO: calculate
  userId: json.user.id,
  username: json.user.username,
  email: json.user.email,
  drivers: !json.drivers || json.drivers.length === 0
    ? [null, null]
    : json.drivers,
});

LeagueSchema.set('toJSON', {
  transform: async (doc, json) => {
    /* eslint-disable no-param-reassign, no-underscore-dangle */
    json.id = json._id;
    delete json._id;
    delete json.__v;
    /* eslint-enable no-underscore-dangle */

    await doc.populate('users.user').execPopulate();

    json.users = doc.users.map(userJsonTransformation);
    json.transactions = json.transactions.map(transaction => ({
      created: transaction.created,
      userId: transaction.user,
      purchases: transaction.purchases.map(purchase => purchase.driver),
      sales: transaction.sales.map(sale => sale.driver),
    }));

    return json;
    /* eslint-enable no-param-reassign */
  },
});

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
