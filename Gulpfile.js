const gulp = require('gulp');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const child = require('child_process');
const gutil = require('gulp-util');
const browserSync = require('browser-sync').create();
const browserify = require('browserify');
const through2 = require('through2');
const transform = require('vinyl-transform');
const uglify = require('gulp-uglify');

// var sourcemaps = require('gulp-sourcemaps');
// var source = require('vinyl-source-stream');
// var buffer = require('vinyl-buffer');
// var browserify = require('browserify');
// var watchify = require('watchify');
// var babel = require('babelify');


const cssFiles = 'css/**/*.?(s)css';
const jsFiles = 'js/**/*.js';
const siteRoot = '.';

gulp.task('css', () => {
  gulp.src(cssFiles)
  	.pipe(sass())
    .pipe(concat('all.css'))
    .pipe(gulp.dest('./'))
});

gulp.task('browserify', function () {
  var browserified = transform(function(filename) {
    var b = browserify(filename);
    return b.bundle();
  });

  return gulp.src(['./js/app.js'])
  	.pipe(through2.obj(function (file, enc, next){
            browserify(file.path)
                .bundle(function(err, res){
                    // assumes file.contents is a Buffer
                    file.contents = res;
                    next(null, file);
                });
    }))
    // .pipe(uglify())
    .pipe(gulp.dest('./'));
});

gulp.task('serve', () => {
  browserSync.init({
    files: [siteRoot + '/**'],
    port: 4000,
    server: {
      baseDir: siteRoot
    }
  });
  gulp.watch(cssFiles, ['css']);
  gulp.watch(jsFiles, ['browserify']);
  // watch();
});

gulp.task('default', ['css', 'browserify', 'serve']);
// gulp.task('default', ['css', 'jekyll', 'serve']);
