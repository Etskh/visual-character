const gulp = require('gulp');
const less = require('gulp-less');
const minifyCSS = require('gulp-csso');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const webpack = require('webpack');

const webpackConfig = require('./webpack.config.js');

gulp.task('webpack', (callback) => {
  webpack(webpackConfig, (err) => {
    if (err) {
      throw new Error(err);
    }
    callback();
  });
});

gulp.task('server', () => {
  return gulp.src('src/server/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
});

gulp.task('icon', () => {
  return gulp.src('./src/client/assets/goblin-icon.png')
    .pipe(rename('favicon.png'))
    .pipe(gulp.dest('./public'));
});

gulp.task('less', () => {
  return gulp.src('./src/client/style/app.less')
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public'));
});

gulp.task('nodemon', ['webpack', 'less']);

gulp.task('default', ['server', 'less', 'webpack', 'icon']);
