var gulp = require('gulp');
var gutil = require('gulp-util');
var clean = require('gulp-clean');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var header = require('gulp-header');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

var pkg = require('./package.json');

var banner = (function() {
  var tmpl = [
    'pmkr.components v<%= pkg.version %>',
    '<%= pkg.repository.url %>',
    'License: <%= pkg.license %>',
    'Author: <%= pkg.author.name %>',
    'File created: <%= gutil.date(now, "m.d.yyyy") %>'
  ].join('\n');
  var obj = {
    tmpl : tmpl,
    ml : ['/*',tmpl,'*/','\n'].join('\n'),
    html : ['<!--',tmpl,'-->','\n'].join('\n'),
    data : {pkg:pkg, gutil:gutil, now:new Date()}
  };
  return obj;
}());

gulp.task('default', [
  'build'
]);

gulp.task('build', [
  'filters',
  'services',
  'directives',
  'components',
  'banner'
]);

gulp.task('clean-build', function() {
  return gulp.src('build/**/*')
    .pipe(clean())
});

gulp.task('banner', [
  'components'
], function() {
  return gulp.src('**/*.js', {
    cwd: 'build',
    base:'build'
  })
    .pipe(header(banner.ml, banner.data))
    .pipe(gulp.dest('build'))
});

gulp.task('filters', [
  'filters-full',
  'filters-min'
]);

gulp.task('services', [
  'services-full',
  'services-min'
]);

gulp.task('directives', [
  'directives-full',
  'directives-min'
]);

gulp.task('components', [
  'components-full',
  'components-min'
]);

gulp.task('filters-full', function() {
  return gulp.src('src/filters/**/*.js')
    .pipe(concat('filters.js', {newLine: '\r\n\r\n'}))
    .pipe(gulp.dest('build'))
  ;
});

gulp.task('filters-min', function() {
  return gulp.src('src/filters/**/*.js')
    .pipe(sourcemaps.init())
      .pipe(concat('filters.min.js'))
      .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('build'))
  ;
});

gulp.task('services-full', function() {
  return gulp.src('src/services/**/*.js')
    .pipe(concat('services.js', {newLine: '\r\n\r\n'}))
    .pipe(gulp.dest('build'))
  ;
});

gulp.task('services-min', function() {
  return gulp.src('src/services/**/*.js')
    .pipe(sourcemaps.init())
      .pipe(concat('services.min.js'))
      .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('build'))
  ;
});

gulp.task('directives-full', function() {
  return gulp.src('src/directives/**/*.js')
    .pipe(concat('directives.js', {newLine: '\r\n\r\n'}))
    .pipe(gulp.dest('build'))
  ;
});

gulp.task('directives-min', function() {
  return gulp.src('src/directives/**/*.js')
    .pipe(sourcemaps.init())
      .pipe(concat('directives.min.js'))
      .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('build'))
  ;
});

gulp.task('components-full', function() {
  return gulp.src('src/**/*.js')
    .pipe(concat('components.js', {newLine: '\r\n\r\n'}))
    .pipe(gulp.dest('build'))
  ;
});

gulp.task('components-min', function() {
  return gulp.src('src/**/*.js')
    .pipe(sourcemaps.init())
      .pipe(concat('components.min.js'))
      .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('build'))
});