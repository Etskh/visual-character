
const path = require('path');
const fs = require('fs');

const gulp = require('gulp');
const gutil = require('gulp-util');
const less = require('gulp-less');
const minifyCSS = require('gulp-csso');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const babel = require("gulp-babel");
const webpack = require('webpack');

gulp.task('webpack', (callback) => {
  webpack(require('./webpack.config.js'), (err, stats) => {
    callback();
  });
});

gulp.task('server', () => {
  return gulp.src("src/server/**/*.js")
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist"));
});

gulp.task('icon', () => {
  return gulp.src('./src/client/assets/goblin-head.png')
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

gulp.task('nodemon', ['webpack', 'server']);

gulp.task('default', ['server', 'less', 'webpack', 'icon']);
