const gulp = require('gulp');

/**
 * @param {string|[string]} sources
 * @param {string} target
 */
module.exports = (sources, target) => () => gulp.src(sources)
  .pipe(gulp.dest(target));
