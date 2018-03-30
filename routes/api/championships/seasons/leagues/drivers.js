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
    const seasonJson = await req.season.toJSON();

    // eslint-disable-next-line no-underscore-dangle
    const leagueUser = req.league.users.find(candidate => candidate.user.equals(req.user._id));

    const broker = leagueUser.drivers.map(
      driverId => seasonJson.drivers.find(candidate => candidate.driverId.equals(driverId))
    ).reduce(
      (accumulated, driver) => accumulated + driver.price,
      leagueUser.money,
    );

    const tradeFee = Number.parseFloat((seasonJson.currentTradeFeePercentage * broker).toFixed(2));

    // Check that resulting trade fee equals what client provided (otherwise fee might have changed)
    if (req.body.tradeFee !== tradeFee) {
      return res.errorHandler(new BadRequest());
    }

    const wantedDrivers = req.body.drivers.map(
      driverId => seasonJson.drivers.find(candidate => candidate.driverId.equals(driverId))
    );

    const resultingMoney = Number.parseFloat(
      wantedDrivers.reduce(
        (accumulated, driver) => accumulated - driver.price,
        broker - tradeFee,
      ).toFixed(2)
    );

    // Check that resulting money equals what client provided (otherwise there might be a problem)
    if (req.body.resultingMoney !== resultingMoney) {
      return res.errorHandler(new BadRequest());
    }

    leagueUser.money = resultingMoney;
    leagueUser.drivers = req.body.drivers;

    await req.league.save();
    return res.send(req.league);
  } catch (err) {
    return res.errorHandler(err);
  }
});

module.exports = router;
