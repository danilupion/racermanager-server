const path = require('path');
const eslint = require('gulp-eslint');
const gulp = require('gulp');

const perKeyTaskFactory = require('../utils/taskFactories/perKeyTaskFactory');
const objectPropertiesValidatorFactory = require('../utils/validators/objectPropertiesValidatorFactory');

const namespace = path.basename(__filename, path.extname(__filename));

module.exports = perKeyTaskFactory(
  namespace,
  config => () => gulp.src(config.src)
    .pipe(eslint(config.config))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError()),
  {
    configValidator: objectPropertiesValidatorFactory(['src', 'config']),
  }
);
