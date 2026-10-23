[@phun-ky/angle](../index.md) / angle

# Function: angle()

```ts
function angle(
  cx: number,
  cy: number,
  ex: number,
  ey: number,
  normalize?: boolean
): number;
```

Defined in:
[main.ts:24](https://github.com/phun-ky/angle/blob/main/src/main.ts#L24)

Returns the angle between two sets of coordinates.

## Parameters

| Parameter    | Type      | Default value | Description                                                              |
| ------------ | --------- | ------------- | ------------------------------------------------------------------------ |
| `cx`         | `number`  | `undefined`   | The x-coordinate of the first point.                                     |
| `cy`         | `number`  | `undefined`   | The y-coordinate of the first point.                                     |
| `ex`         | `number`  | `undefined`   | The x-coordinate of the second point.                                    |
| `ey`         | `number`  | `undefined`   | The y-coordinate of the second point.                                    |
| `normalize?` | `boolean` | `true`        | If the angle output should be normalized to a value between 0° and 360°. |

## Returns

`number`

The angle between the given coordinates.

## Throws

If any of the coordinates is missing.

## Throws

If any of the coordinates is not a number.

## Example

```ts
// The angle from (0, 0) to (3, 4)
console.log(angle(0, 0, 3, 4).toFixed(2)); // 53.13
// Normalized to between 0° and 360° (the default)
console.log(angle(0, 0, -3, -4).toFixed(2)); // 233.13
// Not normalized, between -180° and 180°
console.log(angle(0, 0, -3, -4, false).toFixed(2)); // -126.87
```
