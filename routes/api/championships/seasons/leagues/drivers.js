const express = require('express');

const { BadRequest } = require('../../../../../error/httpStatusCodeErrors');
const user = require('../../../../../plugins/express/user');

const router = new express.Router();

/**
 * Route: /api/championships/:championship/seasons/:season/leagues/:league/drivers
 * Method: PUT
 *
 * Changes drivers for a user in a league
 */
router.put('/', user, async (req, res) => {
  try {
    // const seasonJson = await req.season.toJSON();

    /*
    if (req.body.tradeFee !== seasonJson.currentTradePercentageFee) {
      return res.errorHandler(new BadRequest());
    }
    */

    const userData = req.league.users.find(candidate => candidate.user.equals(req.user._id));

    // console.log(req.league, req.params, req.body);
    return res.send(req.league);
  } catch (err) {
    return res.errorHandler(err);
  }
});

module.exports = router;
