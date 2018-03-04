const { GrandPrix } = require('../../../models');
const modelRestRouterFactory = require('../../../utils/modelRestRouterFactory');
const { isAdminMiddlewaresArray: middlewares } = require('../../../plugins/express/isAdmin');

module.exports = modelRestRouterFactory({
  Model: GrandPrix,
  listAllQuery: req => ({ championship: req.championship }),
  middlewares,
  bodyModelTransformation: (model, req) => ({
    ...model,
    championship: req.championship,
  }),
});
