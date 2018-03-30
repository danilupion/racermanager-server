const express = require('express');

const { League, Season } = require('../../../models');
const { isAdminMiddlewaresArray } = require('../../../plugins/express/isAdmin');
const { NotFound } = require('../../../error/httpStatusCodeErrors');

const router = new express.Router();

router.param('league', async (req, res, next, leagueId) => {
  try {
    const league = await League.findOne({ _id: leagueId }).exec();

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
 * Route: /api/championships/:championship/leagues
 * Method: GET
 *
 * Retrieves the list of leagues
 */
router.get('/', ...isAdminMiddlewaresArray, async (req, res) => {
  try {
    const leagues = await League.find({
      season: {
        $in: (await Season.find({
          championship: req.championship,
          // eslint-disable-next-line no-underscore-dangle
        })).map(season => season._id),
      },
    });

    return res.send(
      await Promise.all(
        leagues.map(league => league.toJSON())
      )
    );
  } catch (err) {
    return res.errorHandler(err);
  }
});

/**
 * Route: /api/championships/:championship/leagues
 * Method: POST
 *
 * Creates a league
 */
router.post('/', ...isAdminMiddlewaresArray, async (req, res) => {
  try {
    return res.send(
      await (
        await League.create({
          season: await Season.findOne({ name: (new Date()).getFullYear().toString() }),
          name: req.body.name,
        })
      ).toJSON()
    );
  } catch (err) {
    return res.errorHandler(err);
  }
});

/**
 * Route: /api/championships/:championship/leagues
 * Method: PUT
 *
 * Updates a league
 */
router.put('/:league', ...isAdminMiddlewaresArray, async (req, res) => {
  try {
    req.league.name = req.body.name;
    await req.league.save();

    return res.send(await req.league.toJSON());
  } catch (err) {
    return res.errorHandler(err);
  }
});

/**
 * Route: /api/championships/:championship/leagues/:league
 * Method: DELETE
 *
 * Deletes a league
 */
router.delete('/:league', ...isAdminMiddlewaresArray, async (req, res) => {
  try {
    await req.league.remove();

    return res.status(204).end();
  } catch (err) {
    return res.errorHandler(err);
  }
});

/**
 * Route: /api/championships/:championship/leagues/:league/users
 * Method: POST
 *
 * Adds a user to a league
 */
router.post('/:league/users', ...isAdminMiddlewaresArray, async (req, res) => {
  try {
    req.league.users.push({
      user: req.body.user,
      money: req.body.money,
    });

    await req.league.save();

    const itemIndex = req.league.users.length - 1;
    
    return res.send((await req.league.toJSON()).users[itemIndex]);
  } catch (err) {
    return res.errorHandler(err);
  }
});

/**
 * Route: /api/championships/:championship/leagues/:league/users/:user
 * Method: POST
 *
 * Deletes a user from a league
 */
router.delete('/:league/users/:user', ...isAdminMiddlewaresArray, async (req, res) => {
  try {
    const user = req.league.users.find(candidate => candidate.user.equals(req.params.user));

    if (!user) {
      return res.errorHandler(new NotFound());
    }

    // eslint-disable-next-line no-underscore-dangle
    req.league.users.id(user._id).remove();
    await req.league.save();

    return res.status(204).end();
  } catch (err) {
    return res.errorHandler(err);
  }
});

module.exports = router;
