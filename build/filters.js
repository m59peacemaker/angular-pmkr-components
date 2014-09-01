/*
pmkr.components v0.0.0
https://github.com/m59peacemaker/angular-pmkr-components
License: MIT
Author: Johnny Hauser
File created: 9.1.2014
*/

angular.module('pmkr.components.filters', [
  'pmkr.offset',
  'pmkr.partition',
  'pmkr.shuffle',
  'pmkr.slugify',
  'pmkr.stripTags',
  'pmkr.spaceSentences',
  'pmkr.limitEllipsis'
]);

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

    function filter(str) {

      if (!str) { return str; }

      var slug = str
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '')
      ;

      return slug;

    }

    return filter;

  }
])

;

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

angular.module('pmkr.offset', [])

.filter('pmkr.offset', [
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

angular.module('pmkr.limitEllipsis', [
  'pmkr.stripTags',
  'pmkr.spaceSentences'
])

.filter('pmkr.limitEllipsis', [
  '$filter',
  function($filter) {

    var stripTags = $filter('pmkr.stripTags');
    var spaceSentences = $filter('pmkr.spaceSentences');
    var limitTo = $filter('limitTo');

    function filter(str, limit, ellipsis) {

      if (!str || !str.length) { return str; }

      ellipsis = ellipsis || '...';

      var text = spaceSentences(stripTags(str));

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

angular.module('pmkr.stripTags', [])

.filter('pmkr.stripTags', function () {

  function filter(str, tags, disallow)  {

    if (!str) { return str; }

    tags = tags ? tags.split(',') : '';

    var regexp = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;

    var stripped = str.replace(regexp, function($0, $1) {
      var found = ~tags.indexOf($1.toLowerCase());
      var replace = disallow ? found : !found;
      var replacement = !replace ? $0 : '';
      return replacement;
    });

    return stripped;

  }

  return filter;

})

;