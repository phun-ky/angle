# Errors and edge cases

## What angle() throws

A missing coordinate throws a `SyntaxError`:

```javascript
import { angle } from '@phun-ky/angle';

try {
  angle(0, 0, 3);
} catch (error) {
  console.log(error.name); // SyntaxError
}
```

A coordinate that is not a number throws a `TypeError`:

```javascript
import { angle } from '@phun-ky/angle';

try {
  angle(0, '0', 3, 4);
} catch (error) {
  console.log(error.name); // TypeError
}
```

## What it lets through

`NaN` and `Infinity` are numbers, so they pass the checks:

```javascript
import { angle } from '@phun-ky/angle';

console.log(angle(NaN, 0, 1, 1)); // NaN
console.log(angle(0, 0, Infinity, 1)); // 0
console.log(angle(Infinity, 0, Infinity, 0)); // NaN
```

The `normalize` flag is not checked either: any truthy value normalizes, and any
falsy value except `undefined` does not.

Check the input, or the result with `Number.isFinite()`, when the coordinates
come from users. Stricter checks are considered for a 2.0; see the
[roadmap](https://github.com/phun-ky/angle/blob/main/ROADMAP.md).
