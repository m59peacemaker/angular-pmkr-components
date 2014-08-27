angular.module('pmkr.rethrowException')

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