const { User } = require('../../models');
const { Unauthorized } = require('../../error/httpStatusCodeErrors');

/**
 * Middleware that replaces user from jwt with user from database
 * @param {Request} req
 * @param {Response} res
 * @param {function} next
 * @return {Promise}
 */
module.exports = (req, res, next) => {
  if (req.user && req.user.id) {
    return User.findOne({ _id: req.user.id })
      .then((user) => {
        req.user = user;

        next();
      })
      .catch(res.errorHandler);
  }

  throw new Unauthorized();
};
