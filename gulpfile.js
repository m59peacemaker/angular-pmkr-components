var gulp = require('gulp');
var gutil = require('gulp-util');
var clean = require('gulp-clean');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var header = require('gulp-header');
var uglify = require('gulp-uglify');

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

gulp.task('default', ['build']);

gulp.task('build', [
  'components',
  'banner'
]);

gulp.task('clean-build', function() {
  return gulp.src('build/**')
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

gulp.task('services', function() {
  return gulp.src('src/services/**/*.js')
    .pipe(concat('services.js'))
    .pipe(uglify())
    .pipe(rename('services.min.js'))
    .pipe(gulp.dest('build'))
  ;
});

gulp.task('filters', function() {
  return gulp.src('src/filters/**/*.js')
    .pipe(concat('filters.js'))
    .pipe(uglify())
    .pipe(rename('filters.min.js'))
    .pipe(gulp.dest('build'))
  ;
});

gulp.task('directives', function() {
  return gulp.src('src/directives/**/*.js')
    .pipe(concat('directives.js'))
    .pipe(uglify())
    .pipe(rename('directives.min.js'))
    .pipe(gulp.dest('build'))
  ;
});

gulp.task('components', [
  'filters',
  'services',
  'directives'
], function() {
  return gulp.src(['src/components.js', 'build/**/*.min.js'])
    .pipe(concat('components.js'))
    .pipe(uglify())
    .pipe(rename('components.min.js'))
    .pipe(gulp.dest('build'))
});