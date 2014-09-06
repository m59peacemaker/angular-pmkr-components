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
    ;

  }
])

angular.module('pmkr.componentsDemo')

.controller('ValidateCustomController', function($scope, $q, $timeout) {

  $scope.user = {};
  $scope.originalValue = $scope.user.userName = 'randomGuy';

  // simulate $http call
  $scope.checkUserNameUnique = function(val) {
    var deferred = $q.defer();
    $timeout(function() {
      var isAvailable = !~$scope.takenUserNames.indexOf(val);
      deferred.resolve(isAvailable);
    }, 250);
    return deferred.promise;
  };

  $scope.gateUserNameUnique = function(val, $ngModel) {
    return !val || $ngModel.$pristine;
  };

  $scope.takenUserNames = [
    'm59',
    'SomeKittens',
    'Jhawins',
    'SterlingArcher',
    'rlemon',
    'Benjamin',
    'Florian',
    'phenom',
    'Loktar',
    'Zirak',
    'TehStrike'
  ];

})

;