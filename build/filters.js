/*
pmkr.components v0.0.0
https://github.com/m59peacemaker/angular-pmkr-components
License: MIT
Author: Johnny Hauser
File created: 8.29.2014
*/

angular.module('pmkr.components.filters', [
  'pmkr.offset',
  'pmkr.partition',
  'pmkr.shuffle',
  'pmkr.slugify',
  'pmkr.textOnly',
  'pmkr.limitEllipsis'
]);

angular.module('pmkr.limitEllipsis', [
  'pmkr.textOnly'
])

.filter('pmkr.limitEllipsis', [
  '$filter',
  function($filter) {

    var textOnly = $filter('pmkr.textOnly');

    var limitTo = $filter('limitTo');

    function filter(str, limit, ellipsis) {

      if (!str || !str.length) { return str; }

      ellipsis = ellipsis || '...';

      var text = textOnly(str);

      var limited = limitTo(text, limit);

      if (limited === text) {
        return limited;
      }

      return limited+ellipsis;

    }

    return filter;

  }
])

;

angular.module('pmkr.offset', [])

.filter('pmkr.offset', [
  function() {

    var filter = function(input, offset) {

      if (!input || !input.length) { return input; }

      offset = parseInt(offset, 10);
      return input.slice(offset);

    };

    return filter;

  }
])

;

angular.module('pmkr.partition', [
  'pmkr.filterStabilize'
])

.filter('pmkr.partition', [
  'pmkr.filterStabilize',
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

angular.module('pmkr.shuffle', [
  'pmkr.filterStabilize'
])

.filter('pmkr.shuffle', [
  'pmkr.filterStabilize',
  function(stabilize) {

    var filter = stabilize(function(input) {

      if (!input) { return input; }

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

angular.module('pmkr.slugify', [])

.filter('pmkr.slugify', [
  function() {

    var filter = function(str) {

      if (!str) { return str; }

      var slug = str
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '')
      ;

      return slug;

    };

    return filter;

  }
])

;

angular.module('pmkr.textOnly', [])

.filter('pmkr.textOnly', function () {

  var filter = function (str)  {

    if (!str) { return str; }

    var div = document.createElement('div');
    div.innerHTML = str;
    var text = div.textContent;
    text = text.replace(/(\w)([.!?]+)(\w)/gi, '$1$2 $3');

    return text;

  };

  return filter;

})

;