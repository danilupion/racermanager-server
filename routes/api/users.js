const express = require('express');

const { InternalServerError } = require('../../error/httpStatusCodeErrors');
const { User } = require('../../models');

const router = new express.Router();

/**
 * Route: /api/users
 * Method: POST
 *
 * Creates a nuew user
 */
router.post('/', async (req, res) => {
  try {
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    if (!user) {
      res.errorHandler(new InternalServerError());
    }

    res.send({ success: true });
  } catch (err) {
    res.errorHandler(err);
  }
});

module.exports = router;
