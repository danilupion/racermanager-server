const express = require('express');

const { League } = require('../../../../models');
const jwtAuth = require('../../../../plugins/express/jwt-auth');

const router = new express.Router();

const userJsonTransformation = json => ({
  money: json.money,
  userId: json.user.id,
  username: json.user.username,
  drivers: [null, null],
});

const leagueJsonTransformation = json => ({
  ...json,
  users: json.users.map(userJsonTransformation),
});

/**
 * Route: /api/championships/:championship/seasons/:season/leagues
 * Method: GET
 *
 * Retrieves the list of leagues the user belongs to
 */
router.get('/', jwtAuth, async (req, res) => {
  try {
    return res.send(
      (await League.find({
        // eslint-disable-next-line no-underscore-dangle
        season: req.season._id,
        'users.user': req.user.id,
      }).populate('users.user'))
        .map(league => league.toJSON())
        .map(leagueJsonTransformation)
    );
  } catch (err) {
    return res.errorHandler(err);
  }
});

module.exports = router;
