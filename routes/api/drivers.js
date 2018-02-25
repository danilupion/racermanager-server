const { F1 } = require('../../constants/championship');
const { Driver } = require('../../models');
const modelRestRouterFactory = require('../../utils/modelRestRouterFactory');

module.exports = modelRestRouterFactory({
  Model: Driver,
  bodyModelTransformation: model => ({
    ...model,
    championship: F1,
  }),
});
