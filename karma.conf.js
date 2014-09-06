module.exports = function(config) {
  config.set({
    autoWatch: true,
    browsers: ['Chrome'],
    frameworks: ['jasmine'],
    files: [
      'vendor/angular/angular.js',
      'vendor/angular-mocks/angular-mocks.js',
      'build/components.js',
      'src/**/*.spec.js'
    ]
  });
};