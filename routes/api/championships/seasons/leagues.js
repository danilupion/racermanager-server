const express = require('express');

const { League } = require('../../../../models');
const jwtAuth = require('../../../../plugins/express/jwt-auth');

const router = new express.Router();

/**
 * Route: /api/championships/:championship/seasons/:season/leagues
 * Method: GET
 *
 * Retrieves the list of leagues the user belongs to
 */
router.get('/', jwtAuth, async (req, res) => {
  try {
    return res.send(
      await League.find({
        // eslint-disable-next-line no-underscore-dangle
        season: req.season._id,
        'users.user': req.user.id,
      })
    );
  } catch (err) {
    return res.errorHandler(err);
  }
});

module.exports = router;
