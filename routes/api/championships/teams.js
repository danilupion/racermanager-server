const { Team } = require('../../../models');
const modelRestRouterFactory = require('../../../utils/modelRestRouterFactory');
const { isAdminMiddlewaresArray: writeMiddlewares } = require('../../../plugins/express/isAdmin');

module.exports = modelRestRouterFactory({
  Model: Team,
  listAllQuery: req => ({ championship: req.championship }),
  writeMiddlewares,
  bodyModelTransformation: (model, req) => ({
    ...model,
    championship: req.championship,
  }),
});
