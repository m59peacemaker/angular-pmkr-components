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