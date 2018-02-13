const express = require('express');

const { InternalServerError } = require('../../error/httpStatusCodeErrors');
const { User } = require('../../models');

const router = new express.Router();

/**
 * Route: /api/users
 * Method: POST
 *
 * Creates a new user
 */
router.post('/', async (req, res) => {
  try {
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    if (!user) {
      return res.errorHandler(new InternalServerError());
    }

    return res.send(user);
  } catch (err) {
    return res.errorHandler(err);
  }
});

module.exports = router;
