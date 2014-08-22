/*
pmkr.components v0.0.0
https://github.com/m59peacemaker/angular-pmkr-components
License: MIT
Author: Johnny Hauser
File created: 8.21.2014
*/

angular.module('pmkr.components', [
  'pmkr.components.filters',
  'pmkr.components.services',
  'pmkr.components.directives'
]);

angular.module('pmkr.components.directives', [
  'pmkr.pristineOriginal',
  'pmkr.validateCustom'
]);

angular.module('pmkr.components.filters', [
  'pmkr.offset',
  'pmkr.partition',
  'pmkr.shuffle',
  'pmkr.slugify',
  'pmkr.textOnly'
]);

angular.module('pmkr.components.services', [
  'pmkr.debounce',
  'pmkr.filterStabilize'
]);

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
        var props = {};
        opts.props && ($scope[opts.props] = props);

        var valid;
        var gate = false;

        $ngModel.$validators[opts.name] = function() {
          return valid;
        };

        var debouncedFn = debounce(validate, opts.wait);
        var latestFn = debounce.latest(debouncedFn);

        function validate(val) {
          if (gate) { return; }
          props.validating = true;
          return opts.fn(val);
        }

        function valueChange(val) {

          props.valid = props.invalid = false;

          if (opts.gate && (gate = opts.gate(val, $ngModel))) {
            props.pending = props.validating = false;
            return;
          }

          props.pending = true;

          latestFn(val).then(function(isValid) {
            if (gate) { return; }
            props.checkedValue = val;
            valid = props.valid = isValid;
            props.invalid = !valid;
            $ngModel.$validate();
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

angular.module('pmkr.offset', [])

.filter('pmkr.offset', [
  function() {

    var filter = function(input, offset) {
      if (!input || !input.length) { return input; }
      offset = parseInt(offset, 10);
      return input.slice(offset);
    };

    return filter;

  }
])

;

angular.module('pmkr.partition', [
  'pmkr.filterStabilize'
])

.filter('pmkr.partition', [
  'pmkr.filterStabilize',
  function(stabilize) {

    var filter = stabilize('pmkr.partition', function(arr, size) {

      var newArr = [];

      for (var i=0; i<arr.length; i+=size) {
        newArr.push(arr.slice(i, i+size));
      }

      return newArr;

    });

    return filter;

  }
])

;

angular.module('pmkr.shuffle', [
  'pmkr.filterStabilize'
])

.filter('pmkr.shuffle', [
  'pmkr.filterStabilize',
  function(stabilize) {

    var filter = stabilize('pmkr.shuffle', function(input) {

      if (typeof input === 'string') {
        input = input.split('');
        shuffle(input);
        return input.join('');
      } else {
        shuffle(input);
      }

    });

    // Fisher-Yates shuffle (https:github.com/coolaj86/knuth-shuffle)
    function shuffle(arr) {

      var currentIndex = arr.length;

      while (0 !== currentIndex) {

        var randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex-= 1;

        var temporaryValue = arr[currentIndex];
        arr[currentIndex] = arr[randomIndex];
        arr[randomIndex] = temporaryValue;
      }

      return arr;

    }

    return filter;

  }
])

;

angular.module('pmkr.slugify', [])

.filter('pmkr.slugify', [
  function() {

    var filter = function(str) {
      var slug = str
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '')
      ;
      return slug;
    };

    return filter;

  }
])

;

angular.module('pmkr.textOnly', [])

.filter('pmkr.textOnly', function () {

  var filter = function (str)  {

    var div = document.createElement('div');
    div.innerHTML = str;
    var text = div.textContent;
    text = text.replace(/(\w)([.!?]+)(\w)/gi, '$1$2 $3');

    return text;

  };

  return filter;

})

;

angular.module('pmkr.debounce', [])

.factory('pmkr.debounce', [
  '$timeout',
  '$q',
  function($timeout, $q) {

    var service = function() {
      return debounceFactory.apply(this, arguments);
    };
    service.immediate = function() {
      return debounceImmediateFactory.apply(this, arguments);
    };
    service.latest = function() {
      return debounceLatestFactory.apply(this, arguments);
    };

    function debounceFactory(fn, wait) {

      var timeoutPromise;

      function debounced() {

        var deferred = $q.defer();

        var context = this;
        var args = arguments;

        $timeout.cancel(timeoutPromise);

        timeoutPromise = $timeout(function() {
          deferred.resolve(fn.apply(context, args));
        }, wait);

        return deferred.promise;

      }

      return debounced;

    }

    function debounceImmediateFactory(fn, wait) {

      var timeoutPromise;

      function debounced() {

        var deferred = $q.defer();

        var context = this;
        var args = arguments;

        if (!timeoutPromise) {
          deferred.resolve(fn.apply(context, args));
          // return here?
        }

        $timeout.cancel(timeoutPromise);
        timeoutPromise = $timeout(function() {
          timeoutPromise = null;
        }, wait);

        return deferred.promise;

      }

      return debounced;

    }

    function debounceLatestFactory(fn) {

      var latestArgs;

      function debounced() {

        var args = latestArgs = JSON.stringify(arguments);

        var deferred = $q.defer();

        fn.apply(this, arguments).then(function(res) {
          if (latestArgs === args) {
            deferred.resolve(res);
          }
        }, function(res) {
          if (latestArgs === args) {
            deferred.reject(res);
          }
        });

        return deferred.promise;

      }

      return debounced;

    }

    return service;

  }
])

;

angular.module('pmkr.filterStabilize', [])

.factory('pmkr.filterStabilize', [
  function() {

    var cache = {};

    var service = function(filterName, filterFn) {

      // create a stabilized filter that calls the passed in filterFn
      var filter = function() {

        // copy arguments to new array as to not modify arguments object
        var args = [];
        for (var i=0; i<arguments.length; ++i) {
          args.push(arguments[i]);
        }

        var input = args[0];

        if (!input) { return input; }

        cache[filterName] = cache[filterName] || {};

        var key = JSON.stringify(args);
        var fromCache = cache[filterName][key];
        if (fromCache) {
          return fromCache;
        }

        // replace input with copy - never modify input
        args[0] = angular.copy(input);

        // filtered = filterFn's return value, or the input copy if no return value
        // filterFn can return new data or modify the original (returning original is optional)
        var filtered = filterFn.apply(this, args) || args[0];

        // cache result according to all arguments - allows unique identifier to be passed in
        cache[filterName][key] = filtered;

        // return the new or copied filtered input
        return filtered;

      };

      // return the stabilized filter
      return filter;

    }; // end service function

    return service;

  }
])

;