# Strip Tags

Accepts a string and returns the string stripped of html tags.

Stripping tags will result in the end of one element's text content to be joined to the beginning of the next with no space. Use the [spaceSentences][1] filter to add appropriate spacing.

## Usage

```html
{{"<p>No! Don't take my html!</p><p>STAHP!</p>" | pmkr.stripTags | pmkr.spaceSentences}}
<!-- No! Don't take my html! STAHP! -->

<!-- Allow span tag -->
{{"<p>A</p><span>B</span><i>C</i>" | pmkr.stripTags:'span'}}
<!-- A<span>B</span>C -->

<!-- Remove p,i tags -->
{{"<p>A</p><span>B</span><i>C</i>" | pmkr.stripTags:'p,i',true}}
<!-- A<span>B</span>C -->
```

### Parameters

#### tags

Type: `String`

A comma delimited list of html tag names to allow (default) or removed (see `disallow` parameter).

#### disallow

Type: `Boolean`
Default: `false`

When set to `true`, the `tags` parameter will refer to the tags that are to be removed, rather than allowed.

  [1]: https://github.com/m59peacemaker/angular-pmkr-components/tree/master/src/filters/spaceSentences