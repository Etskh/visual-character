var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var path = require('path');

var paths = {
  scripts: ['assets/js/*.js'],
  images: ['assets/img/**/*.png'],
  styles: ['assets/style/*.less'],
};

// Not all tasks need to use streams
// A gulpfile is just another node program and you can use any package available on npm
gulp.task('clean', function() {
  // You can use multiple globbing patterns as you would with `gulp.src`
  return del(['build']);
});

gulp.task('scripts', function() {
  // Minify and copy all JavaScript (except vendor scripts)
  // with sourcemaps all the way down
  return gulp.src(paths.scripts)
    .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(concat('visual.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/'));
});


// Copy all static images
gulp.task('images', function() {
  return gulp.src(paths.images)
    // Pass in options to the task
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('public/img'));
});


// Lessify the less files
gulp.task('less', function () {
  return gulp.src('./assets/style/visual.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'assets', 'style') ]
    }))
    .pipe(gulp.dest('./public'));
});




// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.styles, ['less']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['clean', 'scripts', 'less', 'images']);
