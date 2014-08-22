/*
pmkr.components v0.0.0
https://github.com/m59peacemaker/angular-pmkr-components
License: MIT
Author: Johnny Hauser
File created: 8.21.2014
*/

angular.module('pmkr.components.services', [
  'pmkr.debounce',
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