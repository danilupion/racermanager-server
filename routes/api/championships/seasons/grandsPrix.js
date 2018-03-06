const express = require('express');

const { NotFound } = require('../../../../error/httpStatusCodeErrors');
const { isAdminMiddlewaresArray: writeMiddlewares } = require('../../../../plugins/express/isAdmin');

const router = new express.Router();

router.param('grandPrix', (req, res, next, grandPrixId) => {
  try {
    const grandPrix = req.season.grandsPrix.id(grandPrixId);

    if (!grandPrix) {
      return res.errorHandler(new NotFound());
    }

    req.grandPrix = grandPrix;
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
    req.season.grandsPrix.push({
      grandPrix: req.body.grandPrixId,
      circuit: req.body.circuitId,
      practice1UTC: req.body.practice1UTC,
      practice2UTC: req.body.practice2UTC,
      practice3UTC: req.body.practice3UTC,
      qualifyingUTC: req.body.qualifyingUTC,
      raceUTC: req.body.raceUTC,
    });

    await req.season.save();

    const itemIndex = req.season.grandsPrix.length - 1;
    await Promise.all([
      req.season.populate(`grandsPrix.${itemIndex}.circuit`).execPopulate(),
      req.season.populate(`grandsPrix.${itemIndex}.grandPrix`).execPopulate(),
    ]);

    const item = req.season.grandsPrix[itemIndex].toJSON();
    const { grandPrix, circuit } = item;
    delete item.grandPrix;

    grandPrix.grandPrixId = grandPrix.id;
    delete grandPrix.id;

    circuit.circuitId = circuit.id;
    delete circuit.id;

    return res.send({
      ...grandPrix,
      ...item,
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
router.put('/:grandPrix', ...writeMiddlewares, async (req, res) => {
  try {
    req.grandPrix.grandPrix = req.body.grandPrixId;
    req.grandPrix.circuit = req.body.circuitId;
    req.grandPrix.practice1UTC = req.body.practice1UTC;
    req.grandPrix.practice2UTC = req.body.practice2UTC;
    req.grandPrix.practice3UTC = req.body.practice3UTC;
    req.grandPrix.qualifyingUTC = req.body.qualifyingUTC;
    req.grandPrix.raceUTC = req.body.raceUTC;

    await req.season.save();

    const itemIndex = req.season.grandsPrix.indexOf(req.grandPrix);
    await Promise.all([
      req.season.populate(`grandsPrix.${itemIndex}.circuit`).execPopulate(),
      req.season.populate(`grandsPrix.${itemIndex}.grandPrix`).execPopulate(),
    ]);

    const item = req.season.grandsPrix[itemIndex].toJSON();
    const { grandPrix, circuit } = item;
    delete item.grandPrix;

    grandPrix.grandPrixId = grandPrix.id;
    delete grandPrix.id;

    circuit.circuitId = circuit.id;
    delete circuit.id;

    return res.send({
      ...grandPrix,
      ...item,
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
router.delete('/:grandPrix', ...writeMiddlewares, async (req, res) => {
  try {
    req.grandPrix.remove();

    await req.season.save();
    return res.send();
  } catch (err) {
    return res.errorHandler(err);
  }
});

module.exports = router;
