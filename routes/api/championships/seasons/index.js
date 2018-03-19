const express = require('express');
const fs = require('fs');
const path = require('path');

const { Season } = require('../../../../models');
const { NotFound, InternalServerError } = require('../../../../error/httpStatusCodeErrors');

const router = new express.Router();

router.param('season', async (req, res, next, seasonName) => {
  try {
    const season = await Season.findOne({
      name: seasonName,
      championship: req.championship,
    });

    if (!season) {
      return res.errorHandler(new NotFound());
    }

    req.season = season;
    return next();
  } catch (err) {
    return res.errorHandler(err);
  }
});

/**
 * Route: /api/championships/:championship/seasons/:season
 * Method: GET
 *
 * Retrieves a season
 */
router.get('/:season', async (req, res) => {
  try {
    await Promise.all([
      req.season.populate('teams.team').execPopulate(),
      req.season.populate('drivers.driver').execPopulate(),
      req.season.populate('grandsPrix.circuit').execPopulate(),
      req.season.populate('grandsPrix.grandPrix').execPopulate(),
    ]);

    const season = req.season.toJSON();

    const drivers = [...season.drivers];
    season.drivers = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const { id, driver, initialValue } of drivers) {
      driver.driverId = driver.id;
      delete driver.id;

      season.drivers.push({
        ...driver,
        id,
        initialValue,
        points: 0, // TODO: Calculate points
        fitness: 0, // TODO: Calculate fitness
        value: initialValue, // TODO: calculate current value with results + fitness + team factor
      });
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const team of season.teams) {
      team.teamId = team.team.id;
      team.code = team.team.name;
      team.bonus = 0; // TODO: Calculate team bonus
      delete team.team;

      const teamDrivers = [...team.drivers];
      delete team.drivers;
      team.driverIds = teamDrivers;
    }

    const grandsPrix = [...season.grandsPrix];
    season.grandsPrix = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const item of grandsPrix) {
      const { grandPrix, circuit } = item;
      delete item.grandPrix;

      grandPrix.grandPrixId = grandPrix.id;
      delete grandPrix.id;

      circuit.circuitId = circuit.id;
      delete circuit.id;

      season.grandsPrix.push({
        ...grandPrix,
        ...item,
      });
    }

    return res.send(season);
  } catch (err) {
    return res.errorHandler(new InternalServerError(err));
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
  router.use(`/:season/${fileName}`, require(`./${fileName}`));
});


module.exports = router;
