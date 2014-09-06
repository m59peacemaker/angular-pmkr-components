angular.module('pmkr.validateCustom', [
  'pmkr.debounce'
])

.directive('pmkrValidateCustom', [
  '$q',
  'pmkr.debounce',
  function($q, debounce) {

    var directive = {
      restrict: 'A',
      require: 'ngModel',
      // set priority so that other directives can change ngModel state ($pristine, etc) before gate function
      priority: 1,
      link: function($scope, $element, $attrs, $ngModel) {

        var opts = $scope.$eval($attrs.pmkrValidateCustom);

        // this reference is used as a convenience for $scope[opts.props]
        var props = {
          pending : false,
          validating : false,
          checkedValue : null
        };
        // if opts.props is set, assign props to $scope
        opts.props && ($scope[opts.props] = props);

        $ngModel.$setValidity(opts.name, true);

        var gate = false;

        var debouncedFn = debounce(validate, opts.wait);
        var latestFn = debounce.latest(debouncedFn);

        function validate(val) {
          if (gate) { return; }
          props.validating = true;
          return opts.fn(val);
        }

        function valueChange(val) {

          if (opts.gate && (gate = opts.gate(val, $ngModel))) {
            props.pending = props.validating = false;
            $ngModel.$setValidity(opts.name, true);
            return;
          }

          props.pending = true;

          latestFn(val).then(function(isValid) {
            if (gate) { return; }
            props.checkedValue = val;
            $ngModel.$setValidity(opts.name, isValid);
            props.pending = props.validating = false;
          });

        }

        $scope.$watch(function() {
          return $ngModel.$viewValue;
        }, valueChange);

      } // link

    }; // directive

    return directive;

  }
])

;