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