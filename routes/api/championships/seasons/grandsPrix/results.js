const express = require('express');

const { isAdminMiddlewaresArray: writeMiddlewares } = require('../../../../../plugins/express/isAdmin');

const router = new express.Router();

/**
 * Route: /api/championships/:championship/seasons/:season/grandsPrix/:grandPrix/results
 * Method: PUT
 *
 * Retrieves a season team
 */
router.put('/', ...writeMiddlewares, async (req, res) => {
  try {
    req.grandPrix.results = req.body.results;

    await req.season.save();

    return res.send(req.grandPrix.results);
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
