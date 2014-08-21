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

  [1]: https://github.com/m59peacemaker/angular-pmkr-components/tree/master/services/debounce