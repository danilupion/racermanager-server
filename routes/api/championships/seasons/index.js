const express = require('express');
const fs = require('fs');
const path = require('path');

const { Season } = require('../../../../models');
const { NotFound, InternalServerError } = require('../../../../error/httpStatusCodeErrors');

const router = new express.Router();

router.param('season', async (req, res, next, seasonName) => {
  try {
    const season = await Season.findOne({ name: seasonName });

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
    await req.season.populate('teams.team').execPopulate();
    return res.send(req.season);
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
