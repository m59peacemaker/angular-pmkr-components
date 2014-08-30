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