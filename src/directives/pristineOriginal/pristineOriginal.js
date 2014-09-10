angular.module('pmkr.pristineOriginal', [])

.directive('pmkrPristineOriginal', [
  function() {

    var directive = {
      restrict : 'A',
      require : 'ngModel',
      link: function($scope, $element, $attrs, $ngModel) {

        var defaults = {
          caseSensitive: true
        };
        var opts = $scope.$eval($attrs.pmkrPristineOriginal);
        opts = angular.extend(defaults, opts);

        var pristineVal = null;

        $scope.$watch(function() {
          return $ngModel.$viewValue;
        }, function(val) {

          // set pristineVal to newVal the first time this function runs
          if (pristineVal === null) {
            pristineVal = $ngModel.$isEmpty(val) ? '' : val.toString();
          }

          // determine/set $pristine state
          var shouldBePristine;
          if (pristineVal === val) {
            shouldBePristine = true;
          } else if (!opts.caseSensitive && pristineVal.toLowerCase() === val.toLowerCase()) {
            shouldBePristine = true;
          }
          shouldBePristine && $ngModel.$setPristine();

        });

      }
    };

    return directive;

  }
])

;