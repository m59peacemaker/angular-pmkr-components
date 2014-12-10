var gulp              = require('gulp');
var templateCache     = require('gulp-angular-templatecache');
var clean             = require('gulp-clean');
var concat            = require('gulp-concat');
var connect           = require('gulp-connect');
var header            = require('gulp-header');
var gulpJade          = require('gulp-jade');
var gulpBeautify      = require('gulp-jsbeautifier');
var rename            = require('gulp-rename');
var sourcemaps        = require('gulp-sourcemaps');
var template          = require('gulp-template');
var uglify            = require('gulp-uglify');
var gutil             = require('gulp-util');

var beautify          = require('js-beautify');
var connectLiveReload = require('connect-livereload')({port: 35729});
var glob              = require('glob');
var jade              = require('jade');
var karma             = require('karma').server;
var merge             = require('merge-stream');

var _                 = require('lodash');
var _s                = require('underscore.string'); _.mixin(_s.exports());

var fs                = require('fs');

var pkg               = require('./package.json');

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
  return gulp.src(['demo/*', '!demo/src', '!demo/.git'])
    .pipe(clean())
});



/*** SERVER ***/

gulp.task('connect', function() {
  connect.server({
    root: 'demo',
    fallback: 'demo/index.html',
    port: '1059',
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
  return gulp.watch(['src/**/*.js', '!src/**/{tests,samples}/**/*.js'],
    ['components-full', 'components-min']
  );
});
gulp.task('components-full', function() {
  return gulp.src(['src/**/*.js', '!src/**/{tests,samples}/**/*.js'])
    .pipe(concat('components.js', {newLine: '\r\n\r\n'}))
    .pipe(gulp.dest('build'))
  ;
});
gulp.task('components-min', function() {
  return gulp.src(['src/**/*.js', '!src/**/{test,samples}/**/*.js'])
    .pipe(sourcemaps.init())
      .pipe(concat('components.min.js'))
      .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('build'))
  ;
});



/*** DEMO ***/

gulp.task('watch-demo', ['reload-demo'], function() {

  gulp.watch('build/components.js', ['demo-components']);

  gulp.watch(['demo/src/index.jade', 'demo/src/index-js'], ['demo-index']);

  gulp.watch(['demo/src/page.jade', 'src/**/samples/**'], ['demo-pages']);

  gulp.watch('demo/**/*.*', function() {
    gulp.src('demo/**/*.*')
    .pipe(connect.reload())
    ;
  });

});

gulp.task('reload-demo', function() {
  return
});

gulp.task('demo', [
  'demo-components',
  'demo-index',
  'demo-pages'
]);

gulp.task('demo-components', function() {
  return gulp.src('build/components.js')
  .pipe(gulp.dest('demo'))
  ;
});

gulp.task('demo-index', function() {
  var tasks = [];

  tasks.push(gulp.src('demo/src/index.jade')
  .pipe(gulpJade({
    locals:{
      data: getDemoStructure(),
      _: _
    }
  }))
  .pipe(gulpBeautify({html: {
    indentSize: 2,
    unformatted: []
  }}))
  .pipe(rename('index.html'))
  .pipe(gulp.dest('demo'))
  );

  tasks.push(gulp.src('demo/src/index-js')
  .pipe(template({
    data: getDemoStructure(),
    _: _
  }))
  .pipe(rename('index.js'))
  .pipe(gulp.dest('demo'))
  );

  return merge(tasks);
});

gulp.task('demo-pages', function() {

  var components = {};
  _.forOwn(getDemoStructure(), function(componentsByType) {
    _.extend(components, componentsByType);
  });

  var pageTasks = [];
  var allJsTasks = [];

  _.forOwn(components, function(component, componentName) {
    if (!component.samples) { return; }
    pageTasks.push(createDemoPageTask(component, componentName));
    allJsTasks.push(createTaskForComponentJsSamples(component, componentName));
  });

  merge(allJsTasks)
  .pipe(concat('samples.js', {newLine: '\r\n\r\n'}))
  .pipe(gulp.dest('demo'))
  ;

  return merge(pageTasks, allJsTasks);

});

function createDemoPageTask(component, componentName) {
  return gulp.src('demo/src/page.jade')
  .pipe(gulpJade({
    pretty: true,
    locals:{
      componentName: componentName,
      component: component,
      samplesCode: getComponentSamplesCode(component.samples),
      _: _
    }
  }))
  .pipe(rename(componentName+'.html'))
  .pipe(gulp.dest('demo/pages'))
  ;
}

function createTaskForComponentJsSamples(component, componentName) {
  var componentJsStreams = component.samples.map(function(sample) {
    return gulp.src(sample.js)
    .pipe(template({
      moduleName: 'pmkr.componentsDemo',
      controllerName: 'pmkr.'+componentName+'.'+sample.name+'Controller'
    }))
    ;
  });
  return merge(componentJsStreams);
}

function getDemoStructure() {

  var structure = {};

  var componentTypeFolders = glob.sync('src/*/');
  componentTypeFolders.map(handleComponentTypeFolder);

  return structure;

  function handleComponentTypeFolder(componentTypeFolder) {
    var componentType = getLastSegment(componentTypeFolder);
    var componentFolders = glob.sync(componentTypeFolder+'*/');
    var components = componentFolders.map(handleComponentFolder);
    structure[componentType] = {}
    components.map(function(component) {
      structure[componentType][component.name] = component.files;
    });
  }

  function handleComponentFolder(componentFolder) {
    return {
      name: getLastSegment(componentFolder),
      files: {
        samples: getSamples(componentFolder),
        srcDir: componentFolder
      }
    };
  }

  function getSamples(componentFolder) {
    var samplesFolder = glob.sync(componentFolder+'**/samples/');
    if (!samplesFolder.length) { return null; }
    var subDirs = glob.sync(samplesFolder+'*/');
    if (!subDirs) { return []; }
    return !subDirs.length ? [getSingleSample(samplesFolder, 'default')] : getManySamples(subDirs);
  }

  function getSingleSample(folder, name) {
    return {
      name: name,
      jade: glob.sync(folder+'**/*.jade')[0],
      js: glob.sync(folder+'**/*.js')[0]
    };
  }

  function getManySamples(subDirs) {
    return subDirs.map(function(dir) {
      var name = getLastSegment(dir);
      return getSingleSample(dir, name);
    });
  }

  function getLastSegment(pathString) {
    var result = pathString.match(/\/([^/]+)\/$/);
    return result && result.length > 0 ? result[1] : '';
  }

}

function getComponentSamplesCode(samples) {
  return samples.map(function(sample) {
    var jadeFile = fs.readFileSync(sample.jade, 'utf8');
    var html = jade.render(jadeFile);
    var prettyHtml = beautify.html(html, {
      indent_size: 2,
      unformatted: []
    });
    return {
      html: prettyHtml,
      jade: jadeFile,
      js: fs.readFileSync(sample.js, 'utf8')
    };
  });
}
