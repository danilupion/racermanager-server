const fs = require('fs');
const path = require('path');

const express = require('express');

const { League } = require('../../../../../models/index');
const jwtAuth = require('../../../../../plugins/express/jwt-auth');
const { NotFound } = require('../../../../../error/httpStatusCodeErrors');

const router = new express.Router();

const userJsonTransformation = json => ({
  money: json.money,
  points: 0, // TODO: calculate
  userId: json.user.id,
  username: json.user.username,
  drivers: [null, null],
});

const leagueJsonTransformation = json => ({
  ...json,
  users: json.users.map(userJsonTransformation),
});

router.use('*', jwtAuth);

router.param('league', async (req, res, next, leagueId) => {
  try {
    const league = await League.findOne({
      _id: leagueId,
      // eslint-disable-next-line no-underscore-dangle
      season: req.season._id,
      'users.user': req.user.id,
    });

    if (!league) {
      return res.errorHandler(new NotFound());
    }

    req.league = league;
    return next();
  } catch (err) {
    return res.errorHandler(err);
  }
});

/**
 * Route: /api/championships/:championship/seasons/:season/leagues
 * Method: GET
 *
 * Retrieves the list of leagues the user belongs to
 */
router.get('/', async (req, res) => {
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

// Loop over files in this folder
fs.readdirSync(__dirname).forEach((file) => {
  const fileName = path.basename(file, path.extname(file));
  const filePath = path.join(__dirname, file);

  // Skip index.js
  if (__filename === filePath) {
    return;
  }

  // Register route with the same name as the file
  // eslint-disable-next-line import/no-dynamic-require, global-require
  router.use(`/:league/${fileName}`, require(`./${fileName}`));
});

module.exports = router;
