const express = require('express');

const { Team } = require('../../models');

const router = new express.Router();

/**
 * Route: /api/teams
 * Method: GET
 *
 * Ge
 */
router.get('/', async (req, res) => {
  try {
    const teams = await Team.find();

    return res.send(teams);
  } catch (err) {
    return res.errorHandler(err);
  }
});

module.exports = router;
