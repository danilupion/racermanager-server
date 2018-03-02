const { F1 } = require('../../constants/championship');
const { Team } = require('../../models');
const modelRestRouterFactory = require('../../utils/modelRestRouterFactory');
const { isAdminMiddlewaresArray: writeMiddlewares } = require('../../plugins/express/isAdmin');

module.exports = modelRestRouterFactory({
  Model: Team,
  writeMiddlewares,
  bodyModelTransformation: model => ({
    ...model,
    championship: F1,
  }),
});
