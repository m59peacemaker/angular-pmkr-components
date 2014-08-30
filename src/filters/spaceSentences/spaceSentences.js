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