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