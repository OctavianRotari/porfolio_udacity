var gulp = require('gulp');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var cleanCss = require('gulp-clean-css');
var server = require('gulp-server-livereload');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var imageResize = require('gulp-image-resize');
var cssImport = require('gulp-cssimport');
// var debug = require('gulp-debug');
var importOptions = { style: 'src/resources/scss/style.scss' };

gulp.task('styles', function () {
  gulp.src([ 'src/vendors/css/*.css', 'src/resources/scss/style.scss', 'src/resources/scss/media_queries.scss' ])
    .pipe(cssImport(importOptions))
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCss({ compatibility: 'ie8' }))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('dist/css/'));
});

var resizeImageTaskNames = [];

var containerSize = [
  {
    heroImage: [ 2340, 1170 ],
    projectImage: [ 390 , 780 ]
  },
  {
    heroImage: [ 970, 1940 ],
    projectImage: [ 323.33, 646.66 ]
  },
  {
    heroImage: [ 750, 1500 ],
    projectImage: [ 250, 500 ]
  }, {
    heroImage: [],
    projectImage: [ 740, 1480 ]
  }
];

containerSize.forEach(function (deviceSizes) {
  var heroImage = 'src/resources/img/code.jpeg';
  var projectImages = [ 'src/resources/img/*.{jpeg,jpg}', '!' + heroImage ];
  var images;
  var imageSize;
  deviceSizes.heroImage.forEach(function (size) {
    imageSize = 'imageResize' + size;
    gulp.task(imageSize, function () {
      images = heroImage;
      imageResizeGulp (size, images);
    });
    resizeImageTaskNames.push(imageSize);
  });
  deviceSizes.projectImage.forEach(function (size) {
    imageSize = 'imageResize' + size;
    gulp.task(imageSize, function () {
      images = projectImages;
      imageResizeGulp (size, images);
    });
    resizeImageTaskNames.push(imageSize);
  });
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

gulp.task('server', [ 'styles' ], function () {
  var stream = gulp.src('./')
    .pipe(server({
      livereload: true,
      directoryListing: true,
      open: true
    }));
  return stream;
});

gulp.task('default', [ 'cleanImg', 'imageResize', 'styles', 'watch', 'server' ]);
