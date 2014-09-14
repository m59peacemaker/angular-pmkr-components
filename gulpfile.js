var gulp          = require('gulp');
var templateCache = require('gulp-angular-templatecache');
var clean         = require('gulp-clean');
var concat        = require('gulp-concat');
var connect       = require('gulp-connect');
var header        = require('gulp-header');
var jade          = require('gulp-jade');
var karma         = require('karma').server;
var rename        = require('gulp-rename');
var sourcemaps    = require('gulp-sourcemaps');
var uglify        = require('gulp-uglify');
var gutil         = require('gulp-util');
var connectLiveReload = require('connect-livereload')({port: 35729});

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



gulp.task('default', ['watch']);
gulp.task('watch', [
  'connect',
  'tdd',
  'watch-components',
  'watch-demo'
]);



/*** BUILD ***/

gulp.task('build', [
  'components',
  'banner',
  'demo'
]);

gulp.task('banner', [
  'components'
], function() {
  return gulp.src('build/**/*.js')
  .pipe(header(banner.ml, banner.data))
  .pipe(gulp.dest('build'))
});



/*** CLEAN ***/

gulp.task('clean-build', function() {
  return gulp.src('build/*')
    .pipe(clean())
});

gulp.task('clean-demo', function() {
  return gulp.src('demo/*')
  .pipe(clean())
});



/*** SERVER ***/

gulp.task('connect', function() {
  connect.server({
    root: 'demo',
    fallback: 'demo/index.html',
    port: '59',
    livereload: {
      port: 35729
    },
    middleware: function(connect, opt) {
      return [
        connectLiveReload
      ];
    }
  });
});



/*** TESTING ***/

gulp.task('tdd', ['build'], function() {
  karma.start({
    configFile: __dirname+'/karma.conf.js'
  });
});



/*** COMPONENTS ***/

gulp.task('components', [
  'components-full',
  'components-min'
]);

gulp.task('watch-components', function() {
  return gulp.watch(['src/**/*.js', '!src/**/{tests,samples}/*.js'],
    ['components-full', 'components-min']
  );
});
gulp.task('components-full', function() {
  return gulp.src(['src/**/*.js', '!src/**/{tests,samples}/*.js'])
    .pipe(concat('components.js', {newLine: '\r\n\r\n'}))
    .pipe(gulp.dest('build'))
  ;
});
gulp.task('components-min', function() {
  return gulp.src(['src/**/*.js', '!src/**/{test,samples}/*.js'])
    .pipe(sourcemaps.init())
      .pipe(concat('components.min.js'))
      .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('build'))
  ;
});



/*** DEMO ***/

gulp.task('watch-demo', ['reload-demo'], function() {
  return gulp.watch(['build/components.js', 'src-demo/**/*.*', 'src/**/samples/**/*.*'], [
    'demo'
  ]);
});

gulp.task('reload-demo', function() {
  return gulp.watch('demo/**/*.*', function() {
    gulp.src('demo/**/*.*')
    .pipe(connect.reload())
    ;
  });
});

gulp.task('demo', [
  'demo-index-jade',
  'demo-js',
  'demo-templates',
  'demo-components'
]);

gulp.task('demo-components', function() {
  return gulp.src('build/components.js')
  .pipe(gulp.dest('demo'))
  ;
});

gulp.task('demo-index-jade', function() {
  return gulp.src('src-demo/index.jade')
  .pipe(jade())
  .pipe(gulp.dest('demo'))
  ;
})

gulp.task('demo-templates', function() {
  return gulp.src(['src/**/samples/*.jade'])
  .pipe(jade())
  .pipe(rename({dirname : 'tmpl'}))
  .pipe(templateCache('templates.js', {module:'pmkr.componentsDemo'}))
  .pipe(gulp.dest('demo'))
  ;
});

gulp.task('demo-js', function() {
  return gulp.src(['src-demo/index.js', 'src/**/samples/*.js'])
  .pipe(concat('index.js', {newLine: '\r\n\r\n'}))
  .pipe(gulp.dest('demo'))
  ;
});