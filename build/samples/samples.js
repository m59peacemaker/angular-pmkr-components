/*
pmkr.components v0.0.0
https://github.com/m59peacemaker/angular-pmkr-components
License: MIT
Author: Johnny Hauser
File created: 9.3.2014
*/

angular.module('pmkr.componentsSamples', [
  'ui.router'
]);

angular.module('pmkr.componentsSamples')

.controller('ValidateCustomController', function($scope, $q, $timeout) {

  $scope.user.userName = 'myUserName';

  $scope.checkUserNameUnique = function(val) {
    var deferred = $q.defer();
    $timeout(function() {
      var isAvailable = !~getTakenUserNames.indexOf(val);
      deferred.resolve(isAvailable);
    }, 250);
    return deferred.promise;
  };

  $scope.userNameUniqueGate = function(val, $ngModel) {
    return !val || $ngModel.$pristine;
  };

  function getTakenUserNames() {
    var takenUserNames = [
      'm59peacemaker',
      'SomeKittens',
      'Jhawins',
      'SterlingArcher',
      'rlemon',
      'Benjamin',
      'Florian',
      'phenom',
      'Loktar',
      'Zirak'
    ];
    return takenUserNames;
  }

})

;