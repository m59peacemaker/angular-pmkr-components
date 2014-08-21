# Filter Stabilize

## The problem:

A filter used in the view triggers another digest cycle. If the filtered value isn't stable (returns differently each time), an infinite digest loop will occur.

## Solutions:

The standard solution is to filter the data within the controller, thus avoiding the issue altogether. However, many people still find it nicer to be able to use unstable filters in the view.

The `filterStabilize` service stabilizes unstable filters by simply caching the filter result by the filter name and filter arguments and then returning the same previously filter result each time.

### Unstable filter:

```javascript
.filter('myFilter', [
  function() {

    return function(input) {
      return Math.random();
    };

  }
])
```

### Stabilized filter:

```javascript
.filter('myFilter', [
  'pmkr.filterStabilize',
  function(stabilize) {

    return stabilize('myFilter', function(input) {
      return Math.random();
    });

  }
])
```

### Refiltering:

Because the service is caching results according to the input arguments, passing an arbitrary argument will yield a new result.

```html
<!-- these two produce the same result -->
{{myData | myFilter}}
{{myData | myFilter}}
<!-- different result -->
{{myData | myFilter:anyValue}}
```

You can trigger a refilter by chaning the arbitrary argument.

```
{{myData | myFilter:abitraryArg}}

$scope.refilter = function() {
  $scope.arbitraryArg = Math.random();
};
```