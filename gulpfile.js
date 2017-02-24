var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCss = require('gulp-clean-css');

gulp.task('sass', function () {
  gulp.src('src/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('styles', function () {
  gulp.src('dist/css/*.css')
  .pipe(cleanCss({ compatibility: 'ie8' }))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('watch', function () {
  gulp.watch('src/scss/*.scss', [ 'sass', 'styles' ]);
});

gulp.task('default', [ 'sass', 'styles', 'watch' ]);
