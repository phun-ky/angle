# Usage

## ES modules

```javascript
import { angle } from '@phun-ky/angle';

console.log(angle(0, 0, 3, 4).toFixed(2)); // 53.13
```

## CommonJS

```javascript
const { angle } = require('@phun-ky/angle');

console.log(angle(0, 0, 3, 4).toFixed(2)); // 53.13
```

## Browser

As an ES module, from a CDN that resolves its dependency:

```html
<script type="module">
  import { angle } from 'https://cdn.jsdelivr.net/npm/@phun-ky/angle@1/+esm';

  console.log(angle(0, 0, 3, 4).toFixed(2)); // 53.13
</script>
```

To load `dist/angle.esm.js` directly instead, map its dependency,
`@phun-ky/typeof`, with an import map:

```html
<script type="importmap">
  {
    "imports": {
      "@phun-ky/typeof": "https://cdn.jsdelivr.net/npm/@phun-ky/typeof@3/dist/typeof.js"
    }
  }
</script>
<script type="module">
  import { angle } from 'https://cdn.jsdelivr.net/npm/@phun-ky/angle@1/dist/angle.esm.js';

  console.log(angle(0, 0, 3, 4).toFixed(2)); // 53.13
</script>
```

Or as a script, which sets a global `angle`:

```html
<script src="https://unpkg.com/@phun-ky/angle@1"></script>
<script>
  console.log(angle.angle(0, 0, 3, 4).toFixed(2)); // 53.13
</script>
```

## Normalizing

By default the angle is normalized to between 0 and 360. Pass `false` as the
last argument to get the angle between -180 and 180 instead:

```javascript
import { angle } from '@phun-ky/angle';

console.log(angle(0, 0, -3, -4).toFixed(2)); // 233.13
console.log(angle(0, 0, -3, -4, false).toFixed(2)); // -126.87
```

## Directions

With `y` pointing up, as in mathematics:

```javascript
import { angle } from '@phun-ky/angle';

console.log(angle(0, 0, 1, 0)); // 0, to the right
console.log(angle(0, 0, 0, 1)); // 90, up
console.log(angle(0, 0, -1, 0)); // 180, to the left
console.log(angle(0, 0, 0, -1)); // 270, down
```

On a screen, where `y` grows downwards, the same numbers turn clockwise: `90`
points down and `270` points up.
