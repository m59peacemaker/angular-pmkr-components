/*
pmkr.components v0.0.0
https://github.com/m59peacemaker/angular-pmkr-components
License: MIT
Author: Johnny Hauser
File created: 8.29.2014
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
  'pmkr.stripTags',
  'pmkr.spaceSentences',
  'pmkr.limitEllipsis'
]);

angular.module('pmkr.components.services', [
  'pmkr.debounce',
  'pmkr.memoize',
  'pmkr.filterStabilize',
  'pmkr.rethrowException'
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

        var valid = true; // field is initially valid
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

angular.module('pmkr.limitEllipsis', [
  'pmkr.textOnly'
])

.filter('pmkr.limitEllipsis', [
  '$filter',
  function($filter) {

    var textOnly = $filter('pmkr.textOnly');

    var limitTo = $filter('limitTo');

    function filter(str, limit, ellipsis) {

      if (!str || !str.length) { return str; }

      ellipsis = ellipsis || '...';

      var text = textOnly(str);

      var limited = limitTo(text, limit);

      if (limited === text) {
        return limited;
      }

      return limited+ellipsis;

    }

    return filter;

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

    var filter = stabilize(function(input, size) {

      if (!input || !size) {
        return input;
      }

      var newArr = [];

      for (var i = 0; i < input.length; i+= size) {
        newArr.push(input.slice(i, i+size));
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

    var filter = stabilize(function(input) {

      if (!input) { return input; }

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

      if (!str) { return str; }

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

angular.module('pmkr.spaceSentences', [])

.filter('pmkr.spaceSentences', [
  function() {

    function filter(str) {

      if (!str) { return str; }

      var spaced = str.replace(/(\w)([.!?]+)(\w)/gi, '$1$2 $3');

      return spaced;

    }

    return filter;

  }
])

;

angular.module('pmkr.stripTags', [])

.filter('pmkr.stripTags', function () {

  function stripTags(str, tags, disallow)  {

    if (!str) { return str; }

    tags = tags ? tags.split(',') : '';

    var regexp = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;

    var stripped = str.replace(regexp, function($0, $1) {
      var found = ~tags.indexOf($1.toLowerCase());
      var replace = disallow ? found : !found;
      var replacement = !replace ? $0 : '';
      return replacement;
    });

    return stripped;

  }

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

angular.module('pmkr.filterStabilize', [
  'pmkr.memoize'
])

.factory('pmkr.filterStabilize', [
  'pmkr.memoize',
  function(memoize) {

    function service(fn) {

      function filter() {
        var args = [].slice.call(arguments);
        // always pass a copy of the args so that the original input can't be modified
        args = angular.copy(args);
        // return the `fn` return value or input reference (makes `fn` return optional)
        var filtered = fn.apply(this, args) || args[0];
        return filtered;
      }

      var memoized = memoize(filter);

      return memoized;

    }

    return service;

  }
])

;

angular.module('pmkr.memoize', [])

.factory('pmkr.memoize', [
  function() {

    function service() {
      return memoizeFactory.apply(this, arguments);
    }

    function memoizeFactory(fn) {

      var cache = {};

      function memoized() {

        var args = [].slice.call(arguments);

        var key = JSON.stringify(args);

        var fromCache = cache[key];
        if (fromCache) {
          return fromCache;
        }

        cache[key] = fn.apply(this, arguments);

        return cache[key];

      }

      return memoized;

    } // end service function

    return service;

  }
])

;

angular.module('pmkr.rethrowException', [])

.provider('pmkr.rethrowException', [
  '$provide',
  function($provide) {

    this.init = function() {
      $provide.decorator('$exceptionHandler', [
        '$delegate',
        decorator
      ]);
    };

    function decorator($delegate) {

      function decorated(exception, cause) {
        $delegate(exception, cause);
        throw exception;
      }

      return decorated;

    }

    this.$get = function() {};

  }
])

;