const { F1 } = require('../../constants/championship');
const { Team } = require('../../models');
const modelRestRouterFactory = require('../../utils/modelRestRouterFactory');

module.exports = modelRestRouterFactory({
  Model: Team,
  bodyModelTransformation: model => ({
    ...model,
    championship: F1,
  }),
});
