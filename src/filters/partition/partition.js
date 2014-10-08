angular.module('pmkr.partition', [
  'pmkr.filterStabilize'
])

.filter('pmkr.partition', [
  'pmkr.filterStabilize',
  function(stabilize) {

    var filter = stabilize(function(input, size, partitionAmount) {

      if (!input || !size) {
        return input;
      }

      partitionAmount = (partitionAmount === undefined) ? input.length : partitionAmount*size;

      var newArr = [];

      for (var i = 0; i < partitionAmount; i+= size) {
        newArr.push(input.slice(i, i+size));
      }

      return newArr;

    });

    return filter;

  }
])

;
