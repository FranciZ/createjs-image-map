var gulp = require('gulp');
var serve = require('gulp-serve');
var domSrc = require('gulp-dom-src');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cheerio = require('gulp-cheerio');
var stripDebug = require('gulp-strip-debug');

gulp.task('serve', serve('./'));

gulp.task('build', function () {

    var _paths = [];

    return gulp.src([ './bower_components/EaselJS/lib/easeljs-0.8.2.min.js',
            './bower_components/PreloadJS/lib/preloadjs-0.6.2.min.js',
            './bower_components/hammerjs/hammer.min.js',
            './bower_components/gsap/src/minified/TweenLite.min.js',
            './js/marker.js',
            './js/map.js' ]
        )
        .pipe(concat('map.full.min.js'))
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});