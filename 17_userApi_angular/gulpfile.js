var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('connect', function () {
  nodemon({
    script: 'server/server.js'
  , ext: 'js html'
  , env: { 'NODE_ENV': 'development' }
  })
})

gulp.task('serve', ['connect']);
