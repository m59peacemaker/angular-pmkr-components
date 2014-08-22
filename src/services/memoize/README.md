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