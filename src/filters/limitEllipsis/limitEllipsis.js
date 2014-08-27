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