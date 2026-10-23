# Getting started

`angle()` returns the angle in degrees from one point to another.

## Requirements

Node.js 22 or later, or any browser or bundler that supports ES2022. Types are
included.

## Installation

```sh
npm i @phun-ky/angle
```

## Your first angle

```javascript
import { angle } from '@phun-ky/angle';

console.log(angle(0, 0, 3, 4).toFixed(2)); // 53.13
```

The first two arguments are the `x` and `y` of the point you measure from, the
next two the point you measure to. The angle is measured from the positive `x`
axis, counterclockwise when `y` points up.

## Next steps

- [Usage](./usage): ES modules, CommonJS, the browser, and the `normalize` flag.
- [Errors and edge cases](./errors): what `angle()` throws, and what it lets
  through.
- [Reference](../api/functions/angle): the full API.
