const { F1 } = require('../../constants/championship');
const { Driver } = require('../../models');
const modelRestRouterFactory = require('../../utils/modelRestRouterFactory');
const { isAdminMiddlewaresArray: writeMiddlewares } = require('../../plugins/express/isAdmin');

module.exports = modelRestRouterFactory({
  Model: Driver,
  writeMiddlewares,
  bodyModelTransformation: model => ({
    ...model,
    championship: F1,
  }),
});
