var gulp = require('gulp');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var cleanCss = require('gulp-clean-css');
var server = require('gulp-server-livereload');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var imageMin = require('gulp-imagemin');
var imageResize = require('gulp-image-resize');
// var debug = require('gulp-debug');

gulp.task('styles', function () {
  gulp.src('src/**/*.{css,scss}')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCss({ compatibility: 'ie8' }))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('imageMin', function () {
  gulp.src('src/resources/img/*')
    .pipe(imageMin())
    .pipe(gulp.dest('src/resources/img/'));
});

var resizeImageTaskNames = [];

[ 1984, 992, 330, 660 ].forEach(function (size, index) {
  var imageSize = 'imageResize_' + size;
  gulp.task(imageSize, function () {
    var heroImage = 'src/resources/img/code.jpeg';
    var projectImages = [ 'src/resources/img/*.{jpeg,jpg}', '!' + heroImage ];
    var images;
    if (index < 2) {
      images = heroImage;
      imageResizeGulp (size, images);
    }
    else {
      images = projectImages;
      imageResizeGulp (size, images);
    }
  });
  resizeImageTaskNames.push(imageSize);
});

function imageResizeGulp(size, images) {
  gulp.src(images)
    .pipe(imageResize({
      width: size,
      height: size,
      quality: 0.5
    }))
    .pipe(rename( function (path) {
      path.basename += size;
    }))
    .pipe(gulp.dest('dist/img/'));
}

gulp.task('imageResize', resizeImageTaskNames);

gulp.task('cleanImg', function () {
  gulp.src('dist/img/', { read: false })
    .pipe(clean());
});

gulp.task('watch', function () {
  gulp.watch([ 'src/resources/scss/*.scss', 'src/vendors/css/*.css' ], [ 'styles' ]);
});

gulp.task('server', ['watch'], function () {
  var stream = gulp.src('./')
    .pipe(server({
      livereload: true,
      directoryListing: true,
      open: true
    }));
  return stream;
});

gulp.task('default', [ 'cleanImg', 'imageMin', 'imageResize', 'styles', 'watch', 'server' ]);
