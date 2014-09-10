angular.module('pmkr.componentsDemo')

.controller('PristineOriginalController', [
  '$scope',
  function($scope) {

    $scope.foo = $scope.originalValue = 'Test';
    $scope.opts = {caseSensitive:false};

  }
])

;