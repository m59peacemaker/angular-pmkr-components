angular.module('pmkr.componentsDemo')

.controller('pmkr.pristineOriginal.defaultController', [
  '$scope',
  function($scope) {

    $scope.foo = $scope.originalValue = 'Test';
    $scope.opts = {caseSensitive:false};

  }
])

;

angular.module('pmkr.componentsDemo')

.controller('pmkr.validateCustom.userNameUniqueController', function($scope, $q, $timeout) {

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

  $scope.urlUniqueOpts = {
    name: 'unique',
    fn: $scope.checkUserNameUnique,
    gate: $scope.gateUserNameUnique,
    wait: 500,
    props: 'userNameUnique'
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
    'TehStrike',
    'Wes',
    'SomeGuy'
  ];

})

;