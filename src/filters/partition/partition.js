angular.module('pmkr.partition', [
  'pmkr.filterStabilize'
])

.filter('pmkr.partition', [
  'pmkr.filterStabilize',
  function(stabilize) {

    var filter = stabilize('pmkr.partition', function(arr, size) {

      var newArr = [];

      for (var i=0; i<arr.length; i+=size) {
        newArr.push(arr.slice(i, i+size));
      }

      return newArr;

    });

    return filter;

  }
])

;