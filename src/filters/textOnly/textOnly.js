angular.module('pmkr.textOnly', [])

.filter('pmkr.textOnly', function () {

  var filter = function (str)  {

    var div = document.createElement('div');
    div.innerHTML = str;
    var text = div.textContent;
    text = text.replace(/(\w)([.!?]+)(\w)/gi, '$1$2 $3');

    return text;

  };

  return filter;

})

;