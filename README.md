# Angular Components

# Pristine Original

This directive returns an input element to `$pristine` state when its current value matches its original value.

## Usage:

```html
<input ng-model="myModel" pmkr-pristine-original>
```

# Validate Custom

A configurable directive to validate an input field using an asynchronous or synchronous function (service).

Directive priority: 1

Runs at priority 1 so that default priority (0) directives can set `ngModel` state before `gate` function runs.

## Dependencies

[pmkr.debounce][1]

## Usage

```html
<input
  name="my_input"
  ng-model="myInput"
  pmkr-validate-custom="{name:'my-validation', fn:validationFn, gate:validationGate, wait:500, props:'validationProps'}"
>
```

```javascript
// Note that this ought to be in a service and referenced to $scope. This is just for demonstration.
$scope.validationFn = function(value) {
  return $http.get(validationUrl+value).then(function(resp) {
    // use resp to determine if value valid
    return isValid; // true or false
  });
}

// The directive is gated off when this function returns true.
$scope.validationGate = function(value, $ngModel) {
  return !value || $ngModel.$pristine;
};
```

### Parameters

#### name

Type: `String`

The validation name. `$error._____`, `ng-invalid-_____`, etc.

#### fn

Type: `Function`
Parameters: value

Asynchronous or synchronous funcion that returns `true` or `false`. Return true if `value` is valid or false if invalid.

#### gate

Type: `Function`
Parameters: value, ngModel

Synchronous function that returns true or false. Return true if validation should be skipped.

#### wait

Type: `Number`

Amount of `ms` to debounce validation.

#### props

Type: 'String'

Name of the `$scope` property to which the directive will assign useful properties for updating the view.

- `pending` - `true` while debounce and validation are in progress.
- `validating` - `true` while the validation `fn` is in progress.
- `valid` - `true` when the field is valid AND `pending` is `false`.
- `invalid` - `true` when the field is invalid AND `pending` is `false`.
- `checkedValue` - the value that was validated

  [1]: https://github.com/m59peacemaker/angular-pmkr-components/tree/master/src/services/debounce

# Limit Ellipsis

Strips html tags from a string, limits string length to a given amount, and returns the string with an ellipsis if string was limited.

## Dependencies

- [textOnly][1] - Strips html tags

### Parameters

#### limit

Type: `Number`

Max length of the string. This parameter is passed on to Angular's `limitTo` filter internally.

#### ellipsis

Type: 'String'
Default: '...'

The suffix to be added to limited strings.

  [1]: https://github.com/m59peacemaker/angular-pmkr-components/tree/master/src/filters/textOnly

# Offset

Returns input sliced at the given offset.

```html
{{['a','b','c','d'] | pmkr.offset:2}}
<!-- ['c','d'] -->
```

# Partition

Accept an array or string and breaks them into arrays of the given size.

The `partition` filter is especially useful for generating rows and columns for a grid system as in Twitter Bootstrap.

## Dependencies

- [filterStabilize][1] - Prevents infinite digest cycles.

## Usage:

```html
<div ng-repeat="rows in [1,2,3,4,5] | pmkr.partition:3">
  <p>Row</p>
  <div ng-repeat="item in rows">{{item}}</div>
</div>
```

## Output:

```html
<div>
  <p>Row</p>
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
<div>
  <p>Row</p>
  <div>4</div>
  <div>5</div>
</div>
```

### Parameters

#### size

Type: `Number`

The partition size.

  [1]: https://github.com/m59peacemaker/angular-pmkr-components/tree/master/src/services/filterStabilize

# Shuffle

Randomly shuffles arrays and strings using the Fisher-Yates (knuth) shuffle.

This filter depends on the [filterStabilize][1] service to prevent infinite digest cycles.

See the [filterStabilize README][1] to understand how to reshuffle input or produce unique results when repeating input.

Credit to [coolaj86][2] for the shuffle function.

## Usage:

```html
{{[1,2,3] | pmkr.shuffle}}
{{'a string to jumble up' | pmkr.shuffle}}
```

  [1]: https://github.com/m59peacemaker/angular-pmkr-components/tree/master/src/services/filterStabilize
  [2]: https:github.com/coolaj86/knuth-shuffle

# Slugify

Accepts a string and returns a slug.

## Usage

```html
{{'Make me a slug! plz?' | pmkr.slugify}}
<!-- make-me-a-slug-plz -->
```

# Text Only

Accepts a string and returns the string stripped of html tags. Inserts a space after common punctuation where stripping tags will typically result in poor formatting.

## Usage

```html
{{"<p>No! Don't take my html!</p><p>STAHP!</p>" | pmkr.text-only}}
<!-- No! Don't take my html! STAHP! -->
```

# Debounce

## Usage:

```javascript
// standard debounce
var debouncedFn = debounce(fn, wait);

// call on the leading edge
var debouncedFn = debounce.immediate(fn, wait);

// resolve only for the most recent call
var latestFn = debounce.latest(fn);
```

The `debouncedFn` will return a promise. If the passed in function returns a promise, the promise will be passed through so that you can use it as usual:

```javascript
debouncedFn().then(resolved, rejected);
```

If the passed in function doesn't return a promise, access the returned value in `.then`:

```javascript
debouncedFn().then(function(result) {

});
```

# Filter Stabilize

Fixes filters that cause infinite digest cycles and passes a copy of the input so that it can be directly modified.

## Dependencies

- [memoize][1] - Memoization prevents most infinite digest cycles.

## The problem:

A filter used in the view triggers another digest cycle. If the filtered value isn't stable (returns differently each time), an infinite digest loop will occur.

## Solutions:

The standard solution is to filter the data within the controller, thus avoiding the issue altogether. However, many people still find it nicer to be able to use unstable filters in the view.

The `filterStabilize` service stabilizes unstable filters by passing a copy of the arguments to the filter function and by memozing the filter function. This prevents the original input from being modified and ensures that the filter outputs the same result given the same arguments.

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

### Parameters

#### filterFn

Type: `Function`

A function that transforms input.

  [1]: https://github.com/m59peacemaker/angular-pmkr-components/tree/master/src/services/memoize

# Memoize

## Usage

```javascript
  .service('myService', ['pmkr.memoize', function(memoize) {
    var memoizedFn = memoize(function() {
      // this function will return the same value when the same arguments are passed in.
    });
  }]);
```

### Parameters

#### fn

Type: `Function`

A function to be memoized

# Rethrow Exception

Decorates Angular's `$exceptionHandler` to rethrow exceptions so that you can see the browser's message that uses sourcemaps.

## Usage
```javascript
.config([
  'pmkr.rethrowExceptionProvider',
  function(rethrowExceptionProvider) {

    rethrowExceptionProvider.init();

  }
])
```