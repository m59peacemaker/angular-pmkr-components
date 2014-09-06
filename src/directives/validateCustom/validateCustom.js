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
          checkedValue : null,
          valid : null,
          invalid : null
        };
        // if opts.props is set, assign props to $scope
        opts.props && ($scope[opts.props] = props);

        setValidity(true);

        var gate = false;

        var debouncedFn = debounce(validate, opts.wait);
        var latestFn = debounce.latest(debouncedFn);

        $scope.$watch(function() {
          return $ngModel.$viewValue;
        }, valueChange);

        function setValidity(isValid) {
          $ngModel.$setValidity(opts.name, isValid);
          if (gate) {
            props.valid = props.invalid = null;
          } else {
            props.valid = !(props.invalid = !isValid);
          }
        }

        function validate(val) {
          if (gate) { return; }
          props.validating = true;
          return opts.fn(val);
        }

        function valueChange(val) {

          if (opts.gate && (gate = opts.gate(val, $ngModel))) {
            props.pending = props.validating = false;
            setValidity(true);
            return;
          }

          props.pending = true;
          props.valid = props.invalid = null;

          latestFn(val).then(function(isValid) {
            if (gate) { return; }
            props.checkedValue = val;
            setValidity(isValid);
            props.pending = props.validating = false;
          });

        }

      } // link

    }; // directive

    return directive;

  }
])

;