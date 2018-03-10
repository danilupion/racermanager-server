const { League, Season } = require('../../../models');
const modelRestRouterFactory = require('../../../utils/modelRestRouterFactory');
const { isAdminMiddlewaresArray: middlewares } = require('../../../plugins/express/isAdmin');

module.exports = modelRestRouterFactory({
  Model: League,
  listAllQuery: async req => ({
    season: {
      $in: (await Season.find({
        championship: req.championship,
        // eslint-disable-next-line no-underscore-dangle
      })).map(season => season._id),
    },
  }),
  middlewares,
  bodyModelTransformation: async (model) => {
    const season = await Season.findOne({ name: (new Date()).getFullYear().toString() });
    return {
      ...model,
      season,
    };
  },
});
