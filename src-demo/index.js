angular.module('pmkr.componentsDemo', [
  'ui.router',
  'pmkr.components'
])

.config([
  '$urlRouterProvider',
  '$locationProvider',
  function($urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
  }
])

.config([
  '$stateProvider',
  function($stateProvider) {

    $stateProvider
    .state('validateCustom', {url:'/validateCustom', controller:'ValidateCustomController', templateUrl: 'tmpl/userNameUnique.html'})
    .state('pristineOriginal', {url:'/pristineOriginal', controller:'PristineOriginalController', templateUrl: 'tmpl/pristineOriginal.html'})
    ;

  }
])