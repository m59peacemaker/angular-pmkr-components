angular.module('pmkr.offset', [])

.filter('offset', [
  function() {

    function filter(input, offset) {

      if (!input || !input.length) { return input; }

      offset = parseInt(offset, 10);
      return input.slice(offset);

    }

    return filter;

  }
])

;
