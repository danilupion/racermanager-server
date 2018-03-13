const express = require('express');

const { League, Season } = require('../../../models');
const { isAdminMiddlewaresArray } = require('../../../plugins/express/isAdmin');
const { NotFound } = require('../../../error/httpStatusCodeErrors');

const router = new express.Router();

const userJsonTransformation = (json) => {
  const { id } = json.user;
  // eslint-disable-next-line no-param-reassign
  delete json.user.id;
  // eslint-disable-next-line no-param-reassign
  delete json.user.password;

  return {
    money: json.money,
    ...json.user,
    userId: id,
  };
};

const leagueJsonTransformation = json => ({
  ...json,
  users: json.users.map(userJsonTransformation),
});

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
    }).populate('users.user');

    return res.send(
      leagues
        .map(league => league.toJSON())
        .map(leagueJsonTransformation)
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
      leagueJsonTransformation(
        (await League.create({
          season: await Season.findOne({ name: (new Date()).getFullYear().toString() }),
          name: req.body.name,
        })).toJSON()
      )
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
    req.league.save();
    await req.league.populate('users.user').execPopulate();

    return res.send(leagueJsonTransformation(await req.league.toJSON()));
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
    await req.league.populate(`users.${itemIndex}.user`).execPopulate();
    const user = req.league.users[itemIndex].toJSON();

    return res.send(userJsonTransformation(user));
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
