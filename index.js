angular.module('pmkr.componentsDemo', [
  'ui.router',
  'ui.bootstrap',
  'pmkr.components'
])

.config([
  '$urlRouterProvider',
  '$locationProvider',
  function($urlRouterProvider, $locationProvider) {
    //$locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
  }
])

.config([
  '$stateProvider',
  function($stateProvider) {

    $stateProvider
    .state('home', {
      url: '/'
    })
    
    .state('pristineOriginal', {
      url: '/pristine-original',
      templateUrl: 'pages/pristineOriginal.html'
    })
    
    .state('validateCustom', {
      url: '/validate-custom',
      templateUrl: 'pages/validateCustom.html'
    })
    
    ;

  }
])