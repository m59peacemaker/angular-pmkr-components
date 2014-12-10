angular.module('pmkr.partition', [
  'pmkr.filterStabilize'
])

.filter('partition', [
  'filterStabilize',
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
