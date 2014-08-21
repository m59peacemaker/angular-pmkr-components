# Text Only

Accepts a string and returns the string stripped of html tags. Inserts a space after common punctuation where stripping tags will typically result in poor formatting.

## Usage

```html
{{"<p>No! Don't take my html!</p><p>STAHP!</p>" | pmkr.text-only}}
<!-- No! Don't take my html! STAHP! -->
```