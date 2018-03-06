const express = require('express');

const { NotFound } = require('../../../../error/httpStatusCodeErrors');
const { isAdminMiddlewaresArray: writeMiddlewares } = require('../../../../plugins/express/isAdmin');

const router = new express.Router();

router.param('driver', (req, res, next, driverId) => {
  try {
    const driver = req.season.drivers.id(driverId);

    if (!driver) {
      return res.errorHandler(new NotFound());
    }

    req.driver = driver;
    return next();
  } catch (err) {
    return res.errorHandler(err);
  }
});

/**
 * Route: /api/championships/:championship/seasons/:season/drivers
 * Method: POST
 *
 * Creates a season driver
 */
router.post('/', ...writeMiddlewares, async (req, res) => {
  try {
    req.season.drivers.push({
      driver: req.body.driverId,
      initialValue: req.body.initialValue,
    });

    await req.season.save();

    const itemIndex = req.season.drivers.length - 1;
    await req.season.populate(`drivers.${itemIndex}.driver`).execPopulate();

    const item = req.season.drivers[itemIndex].toJSON();
    item.driver.driverId = item.driver.id;
    delete item.driver.id;

    return res.send({
      ...item.driver,
      id: item.id,
      initialValue: item.initialValue,
    });
  } catch (err) {
    return res.errorHandler(err);
  }
});

/**
 * Route: /api/championships/:championship/seasons/:season/drivers/:driver
 * Method: PUT
 *
 * Retrieves a season driver
 */
router.put('/:driver', ...writeMiddlewares, async (req, res) => {
  try {
    req.driver.driver = req.body.driverId;
    req.driver.initialValue = req.body.initialValue;

    await req.season.save();

    const itemIndex = req.season.drivers.indexOf(req.driver);
    await req.season.populate(`drivers.${itemIndex}.driver`).execPopulate();

    const item = req.season.drivers[itemIndex].toJSON();
    item.driver.driverId = item.driver.id;
    delete item.driver.id;

    return res.send({
      ...item.driver,
      id: item.id,
      initialValue: item.initialValue,
    });
  } catch (err) {
    return res.errorHandler(err);
  }
});

/**
 * Route: /api/championships/:championship/seasons/:season/drivers/:driver
 * Method: DELETE
 *
 * Deletes a season driver
 */
router.delete('/:driver', ...writeMiddlewares, async (req, res) => {
  try {
    req.driver.remove();

    await req.season.save();
    return res.send();
  } catch (err) {
    return res.errorHandler(err);
  }
});

module.exports = router;
