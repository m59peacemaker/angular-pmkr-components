angular.module('pmkr.stripTags', [])

.filter('stripTags', function () {

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
