const { F1 } = require('../../constants/championship');
const { Circuit } = require('../../models');
const modelRestRouterFactory = require('../../utils/modelRestRouterFactory');
const { isAdminMiddlewaresArray: writeMiddlewares } = require('../../plugins/express/isAdmin');

module.exports = modelRestRouterFactory({
  Model: Circuit,
  writeMiddlewares,
  bodyModelTransformation: model => ({
    ...model,
    championship: F1,
  }),
});
