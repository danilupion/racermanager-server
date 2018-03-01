const { F1 } = require('../../constants/championship');
const { Team } = require('../../models');
const modelRestRouterFactory = require('../../utils/modelRestRouterFactory');
const jwtAuth = require('../../plugins/express/jwt-auth');
const user = require('../../plugins/express/user');
const isAdmin = require('../../plugins/express/isAdmin');

module.exports = modelRestRouterFactory({
  Model: Team,
  writeMiddlewares: [jwtAuth, user, isAdmin],
  bodyModelTransformation: model => ({
    ...model,
    championship: F1,
  }),
});
