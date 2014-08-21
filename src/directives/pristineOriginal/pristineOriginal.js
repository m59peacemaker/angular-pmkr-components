angular.module('pmkr.pristineOriginal', [])

.directive('pmkrPristineOriginal', [
  function() {

    var directive = {
      restrict : 'A',
      require : 'ngModel',
      link: function($scope, $element, $atts, $ngModel) {

        var pristineVal = null;

        $scope.$watch(function() {
          return $ngModel.$viewValue;
        }, function(val) {
          // set pristineVal to newVal the first time this function runs
          if (pristineVal === null) {
            pristineVal = $ngModel.$isEmpty(val) ? '' : val.toString();
          }

          // newVal is the original value - set input to pristine state
          if (pristineVal === val) {
            $ngModel.$setPristine();
          }

        });

      }
    };

    return directive;

  }
])

;