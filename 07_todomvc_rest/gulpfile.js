var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var wiredep = require('wiredep').stream;
var useref = require('gulp-useref');
var Server = require('karma').Server;
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');
var del = require('del');

var paths = {
    app: './app/',
    dist: './dist/',
    tmp: './.tmp/'
};

gulp.task('connect', function() {
    browserSync.init({
        server: {
            baseDir: [ paths.app, paths.tmp ]
        }
    });
});

gulp.task('watch', function() {
    gulp.watch(paths.app + 'styles/**/*.scss', ['sass']).on('change', browserSync.reload);
    gulp.watch(paths.app + 'styles/**/*.scss').on('change', browserSync.reload);
    gulp.watch(paths.app + 'index.html').on('change', browserSync.reload);
});

gulp.task('sass', function () {
    return gulp.src(paths.app + 'styles/main.scss')
        .pipe(sass())
        .pipe(gulp.dest(paths.tmp + 'styles'));
});

gulp.task('test', function (done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('bower', function(){
    gulp.src(paths.app + 'index.html')
        .pipe(wiredep())
        .pipe(gulp.dest(paths.app));
});

gulp.task('clean', function(cb) {
    return del([
        paths.tmp,
        paths.dist,
        '!' + paths.dist + 'deploy.json'   // this file is excluded
    ]);
});

gulp.task('html', ['sass'], function () {
    var assets = useref.assets({searchPath: ['./.tmp', './app']});
    return gulp.src(paths.app + 'index.html')
        .pipe(assets)
        //.pipe(gulpif('*.js', uglify()))
        //.pipe(gulpif('*.css', minify()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest(paths.dist));
});

gulp.task('serve:dist', ['html'], function () {
    browserSync.init({
        server: {
            baseDir: [ paths.dist ]
        }
    });
});

gulp.task('default', ['serve']);
gulp.task('serve', ['sass', 'watch', 'connect']);
gulp.task('build', ['sass', 'html']);
