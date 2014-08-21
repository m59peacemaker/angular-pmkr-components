angular.module('pmkr.slugify', [])

.filter('pmkr.slugify', [
  function() {

    var filter = function(str) {
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