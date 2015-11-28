'use strict';

var gulp = require('gulp')
var rename = require('gulp-rename')
var uglify = require('gulp-uglify')

var SRC = 'src/*.js'
var DIST = 'dist/'

gulp.task('minify', function() {
    return gulp.src([SRC])
        .pipe(gulp.dest(DIST))  // non-minified version
        .pipe(uglify())  // minify and rename to foo.min.js
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest(DIST));
});
