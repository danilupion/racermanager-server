const express = require('express');
const fs = require('fs');
const path = require('path');

const { NotFound } = require('../../../error/httpStatusCodeErrors');
const CHAMPIONSHIPS = require('../../../constants/championships');

const router = new express.Router();

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
  router.use(`/:championship/${fileName}`, require(`./${fileName}`));
});

router.param('championship', (req, res, next, championship) => {
  if (!Object.values(CHAMPIONSHIPS).includes(championship)) {
    return res.errorHandler(new NotFound());
  }

  req.championship = championship;
  return next();
});

module.exports = router;
