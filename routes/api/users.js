const express = require('express');

const { InternalServerError } = require('../../error/httpStatusCodeErrors');
const { User } = require('../../models');
const { isAdminMiddlewaresArray } = require('../../plugins/express/isAdmin');

const router = new express.Router();

/**
 * Route: /api/users
 * Method: GET
 *
 * Retrieves the list of all users
 */
router.get('/', isAdminMiddlewaresArray, async (req, res) => {
  try {
    return res.send(
      (await User.find().exec())
        .map(user => user.toJSON({
          transform: (doc, json) => {
            const {
              __v,
              _id,
              password,
              ...values
            } = json;

            return {
              id: _id,
              ...values,
            };
          },
        })),
    );
  } catch (err) {
    return res.errorHandler(err);
  }
});

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
