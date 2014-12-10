angular.module('pmkr.limitEllipsis', [
  'pmkr.stripTags',
  'pmkr.spaceSentences'
])

.filter('limitEllipsis', [
  'limitToFilter',
  'stripTagsFilter',
  'spaceSentencesFilter',
  function(limitTo, stripTags, spaceSentences) {

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
