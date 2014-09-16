angular.module('<%= moduleName %>')

.controller('<%= controllerName %>', [
  '$scope',
  function($scope) {

    $scope.foo = $scope.originalValue = 'Test';
    $scope.opts = {caseSensitive:false};

  }
])

;