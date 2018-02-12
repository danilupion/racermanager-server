const gulp = require('gulp');
const clean = require('gulp-clean');

/**
 * @param {string|[string]} paths
 * @param {boolean} force
 */
module.exports = (paths, force = true) => () => gulp.src(paths, { read: false })
  .pipe(clean({ force }));
