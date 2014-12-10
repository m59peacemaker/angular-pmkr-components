angular.module('pmkr.slugify', [])

.filter('slugify', [
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
