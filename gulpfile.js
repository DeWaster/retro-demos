const path = require("path");
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const changed = require('gulp-changed');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const sourcemaps = require('gulp-sourcemaps');
const less = require('gulp-less');
const htmlmin = require('gulp-htmlmin');
const babel = require('gulp-babel');
const LessAutoprefix = require('less-plugin-autoprefix');
const size = require('gulp-size');
const plumber = require('gulp-plumber');
const browserify = require('browserify');
const babelify   = require('babelify');
const buffer     = require('vinyl-buffer');
const source     = require('vinyl-source-stream');
const gutil = require('gulp-util');
const jsonminify = require('gulp-jsonminify');
 
const autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });
const vendors = [
  './node_modules/pixi.js/dist/pixi.min.js',
  './src/filters/glow.min.js',
];

var src = './src';
var dest = './dist';

// Less to CSS 
gulp.task('less', function () {
  return gulp.src(src + '/less/**/*.less')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ],
      plugins: [autoprefix]
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dest + "/css"))
    .pipe(browserSync.stream());
});

gulp.task('js', function() {
  browserify({
    entries: './src/main.js',
    debug: true
  })
  .transform(babelify)
  .bundle()
  .on('error', err => {
    gutil.log("Browserify Error", gutil.colors.red(err.message))
  })
  .pipe(source('main.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init({loadMaps: true}))
  .pipe(sourcemaps.write('./maps'))
  .pipe(gulp.dest('./dist/js'))
  .pipe(browserSync.stream());
});

gulp.task('js:dist', function() {
  browserify({
    entries: './src/main.js',
    debug: true
  })
  .transform(babelify)
  .bundle()
  .on('error', err => {
    gutil.log("Browserify Error", gutil.colors.red(err.message))
  })
  .pipe(source('main.js'))
  .pipe(buffer())
  .pipe(gulp.dest('./dist/js'))
});

// JS compiling
gulp.task('js-vendor', function () {
  return gulp.src(vendors)
    .pipe(plumber())
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(dest + "/js"))
    .pipe(browserSync.stream());
});

// Html
gulp.task('html', function() {
  return gulp.src('src/*.html')
    .pipe(plumber())
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});

// Assets
gulp.task('assets', function() {
  return gulp.src('src/assets/**/*.{png,gif,jpg}')
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest('dist/assets/'))
    .pipe(browserSync.stream());
});

// Images
gulp.task('images', function() {
  return gulp.src('src/img/**/*.{png,gif,jpg}')
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img/'))
    .pipe(browserSync.stream());
});

// Start development server
gulp.task('serve', ['less', 'js-vendor', 'js', 'html', 'assets', 'images'], function() {
  browserSync.init({
    server: dest
  });
  gulp.watch(src + "/less/**/*.less", ['less']);
  gulp.watch(src + "/**/*.js", ['js']);
  gulp.watch(src + "/*.html", ['html']);
  gulp.watch(src + "/assets/**/*.{png,gif,jpg}", ['assets']);
  gulp.watch(src + "/img/**/*.{png,gif,jpg}", ['images']);
});

// preparing files for production
gulp.task('prod', ['js:dist', 'js-vendor', 'less', 'html', 'assets', 'images'], function() {
  
});