const gulp = require('gulp');
const config = require('./gulp/config');
const tasks = require('./gulp/tasks')(config);

// Helper tasks
gulp.task('build:backend', tasks.lint.backend);
gulp.task('watch:backend', tasks.server.watch);
gulp.task('build-and-watch:backend', gulp.series(tasks.lint.backend, tasks.server.watch));
