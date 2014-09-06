var gulp          = require('gulp');
var templateCache = require('gulp-angular-templatecache');
var clean         = require('gulp-clean');
var concat        = require('gulp-concat');
var header        = require('gulp-header');
var jade          = require('gulp-jade');
var sourcemaps    = require('gulp-sourcemaps');
var uglify        = require('gulp-uglify');
var gutil         = require('gulp-util');

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
  'components',
  'samples',
  'banner'
]);

gulp.task('clean-build', function() {
  return gulp.src('build/*')
    .pipe(clean())
});

gulp.task('clean-demo', function() {
  return gulp.src('demo/*')
  .pipe(clean())
});

gulp.task('banner', [
  'components'
], function() {
  return gulp.src('build/**/*.js')
    .pipe(header(banner.ml, banner.data))
    .pipe(gulp.dest('build'))
});

gulp.task('components', [
  'components-full',
  'components-min'
]);

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
  ;
});

gulp.task('demo', [
  'demo-index-jade',
  'demo-js',
  'demo-templates'
]);

gulp.task('demo-index-jade', function() {
  return gulp.src('src-demo/index.jade')
    .pipe(jade())
    .pipe(gulp.dest('demo'))
  ;
})

gulp.task('demo-templates', function() {
  return gulp.src(['src/*/samples/*.jade'])
    .pipe(jade())
    .pipe(templateCache('templates.js', {module:'pmkr.componentsDemo'}))
    .pipe(gulp.dest('demo'))
  ;
});

gulp.task('demo-js', function() {
  return gulp.src(['src/*/src-demo/index.js', 'src/*/samples/*.js'])
    .pipe(concat('samples.js', {newLine: '\r\n\r\n'}))
    .pipe(gulp.dest('demo'))
  ;
});