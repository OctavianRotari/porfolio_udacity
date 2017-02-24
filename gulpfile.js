var gulp = require('gulp');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var cleanCss = require('gulp-clean-css');
var server = require('gulp-server-livereload');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var imageMin = require('gulp-imagemin');
var imageResize = require('gulp-image-resize');
var debug = require('gulp-debug');

gulp.task('sass', function () {
  gulp.src('src/resources/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('src/tmp/'));
});

gulp.task('styles', [ 'sass' ], function () {
  var stream = gulp.src('src/**/*.css')
    .pipe(cleanCss({ compatibility: 'ie8' }))
    .pipe(debug({ title: 'styles:' }))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('dist/css/'));
  return stream;
});

gulp.task('imageMin', function () {
  gulp.src('src/resources/img/*')
    .pipe(imageMin())
    .pipe(gulp.dest('src/resources/img/'));
});

var resizeImageTaskNames = [];

[ 2340, 1170 ].forEach(function (size) {
  var imageSize = 'imageResize_' + size;
  gulp.task(imageSize, function () {
    gulp.src('src/resources/img/code.jpeg')
      .pipe(imageResize({
        width: size,
        height: size,
        quality: 0.5
      }))
      .pipe(rename( function (path) {
        path.basename += size;
      }))
      .pipe(gulp.dest('dist/img/'));
  });
  resizeImageTaskNames.push(imageSize);
});

gulp.task('imageResize', resizeImageTaskNames);

gulp.task('cleanImg', function () {
  gulp.src('dist/img/', { read: false })
    .pipe(clean());
});

gulp.task('watch', function () {
  gulp.watch([ 'src/resources/scss/*.scss', 'src/vendors/css/*.css' ], [ 'sass', 'styles' ]);
});

gulp.task('server', function () {
  gulp.src('./')
    .pipe(server({
      livereload: true,
      directoryListing: true,
      open: true
    }));
});

gulp.task('default', [ 'cleanImg', 'imageMin', 'imageResize', 'sass', 'styles', 'watch', 'server' ]);
