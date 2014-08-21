angular.module('pmkr.shuffle', [
  'pmkr.filterStabilize'
])

.filter('pmkr.shuffle', [
  'pmkr.filterStabilize',
  function(stabilize) {

    var filter = stabilize('pmkr.shuffle', function(input) {

      if (typeof input === 'string') {
        input = input.split('');
        shuffle(input);
        return input.join('');
      } else {
        shuffle(input);
      }

    });

    // Fisher-Yates shuffle (https:github.com/coolaj86/knuth-shuffle)
    function shuffle(arr) {

      var currentIndex = arr.length;

      while (0 !== currentIndex) {

        var randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex-= 1;

        var temporaryValue = arr[currentIndex];
        arr[currentIndex] = arr[randomIndex];
        arr[randomIndex] = temporaryValue;
      }

      return arr;

    }

    return filter;

  }
])

;