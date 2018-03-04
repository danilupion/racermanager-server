const express = require('express');

const { NotFound } = require('../../../../error/httpStatusCodeErrors');
const { isAdminMiddlewaresArray: writeMiddlewares } = require('../../../../plugins/express/isAdmin');

const router = new express.Router();

router.param('team', (req, res, next, teamId) => {
  try {
    const team = req.season.teams.id(teamId);

    if (!team) {
      return res.errorHandler(new NotFound());
    }

    req.team = team;
    return next();
  } catch (err) {
    return res.errorHandler(err);
  }
});

/**
 * Route: /api/championships/:championship/seasons/:season/teams
 * Method: POST
 *
 * Creates a season team
 */
router.post('/', ...writeMiddlewares, async (req, res) => {
  try {
    req.season.teams.push({
      team: req.body.teamId,
      name: req.body.name,
      countryCode: req.body.countryCode,
      drivers: req.body.driverIds,
    });

    await req.season.save();

    const team = req.season.teams[req.season.teams.length - 1].toJSON();
    team.teamId = team.team;
    delete team.team;

    const teamDrivers = [...team.drivers];
    delete team.drivers;
    team.driverIds = teamDrivers;

    return res.send(team);
  } catch (err) {
    return res.errorHandler(err);
  }
});

/**
 * Route: /api/championships/:championship/seasons/:season/teams/:team
 * Method: PUT
 *
 * Retrieves a season team
 */
router.put('/:team', ...writeMiddlewares, async (req, res) => {
  try {
    // eslint-disable-next-line no-underscore-dangle
    req.team.team = req.body.teamId;
    req.team.name = req.body.name;
    req.team.countryCode = req.body.countryCode;
    req.team.drivers = req.body.driverIds;

    await req.season.save();

    const team = req.team.toJSON();
    team.teamId = team.team;
    delete team.team;

    const teamDrivers = [...team.drivers];
    delete team.drivers;
    team.driverIds = teamDrivers;

    return res.send(team);
  } catch (err) {
    return res.errorHandler(err);
  }
});

/**
 * Route: /api/championships/:championship/seasons/:season/teams/:team
 * Method: DELETE
 *
 * Deletes a season team
 */
router.delete('/:team', ...writeMiddlewares, async (req, res) => {
  try {
    req.team.remove();

    await req.season.save();
    return res.send();
  } catch (err) {
    return res.errorHandler(err);
  }
});

module.exports = router;
