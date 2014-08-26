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