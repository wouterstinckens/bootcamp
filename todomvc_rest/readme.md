# TodoMVC refactor exercise

## Gulp

#### Put your paths into a config object

    .
    ├── .tmp
    │   ├── app.css
    │   └── app.js
    ├── dist
    │   ├── app.min.css
    │   ├── app.min.js
    │   └── index.html
    └── src
        ├── bower_components
        │   └── angular
        ├── styles
        |   └── app.scss
        ├── scripts
        |   └── app.ts
        ├── components
        ├── index.html
        └── shared

    var bases = {
        src: 'src/',
        dist: 'dist/',
        tmp: 'tmp/'
    };

    var paths = {
        scripts: ['scripts/**/*.js', '!scripts/libs/**/*.js'],
        styles: ['styles/**/*.scss'],
        html: ['index.html']
    };

#### Separate your generated stuff from your sources

```
    gulp.task('sass', function() {
        return gulp.src(bases.styles)
            .pipe(sass())
            .pipe(gulp.dest(bases.tmp))
            .pipe(browserSync.stream());
    });

	gulp.task('serve', ['babel', 'sass'], function () {
        browserSync.init({
            startPath: '/',
            server: [ bases.tmp, bases.src ]
        });
    });
```

#### serve also your dist folder

    gulp.task('serve:dist', ['build'], function () {
        browserSync.init({
            startPath: '/',
            server: bases.dist
        });
    });


#### clean your generated files

```
    var del = require('del');
    // instal with 'npm install --save del'

    gulp.task('clean', function(cb) {
        return del([
            bases.tmp + '**/*',
            bases.dist + '**/*',
            '!' + bases.dist + 'deploy.json'   // this file is excluded
        ]);
    });

    gulp.task('default', ['clean', 'build']);
```

## Javascript

#### NO GLOBALS

```
    var util = require('./util.js');
    class Todo {
        ..
    }
```
