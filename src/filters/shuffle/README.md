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

  [1]: https://github.com/m59peacemaker/angular-pmkr-components/tree/master/services/filterStabilize
  [2]: https:github.com/coolaj86/knuth-shuffle