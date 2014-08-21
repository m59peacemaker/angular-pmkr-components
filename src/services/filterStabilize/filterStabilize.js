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