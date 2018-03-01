const { User } = require('../../models/index');
const { Unauthorized } = require('../../error/httpStatusCodeErrors');

module.exports = (req, res, next) => {
  if (req.user && req.user.role === User.ROLES.admin) {
    return next();
  }

  return res.send(new Unauthorized());
};
