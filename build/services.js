/*
pmkr.components v0.0.0
https://github.com/m59peacemaker/angular-pmkr-components
License: MIT
Author: Johnny Hauser
File created: 8.25.2014
*/

angular.module('pmkr.components.services', [
  'pmkr.debounce',
  'pmkr.memoize',
  'pmkr.filterStabilize'
]);

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