# [**@phun-ky/angle**](https://github.com/phun-ky/angle) API Documentation

---

> Last updated 2025-07-22T17:46:18.883Z

## Functions

### angle()

```ts
function angle(cx, cy, ex, ey, normalize?): number;
```

Defined in:
[main.ts:24](https://github.com/phun-ky/angle/blob/main/src/main.ts#L24)

Returns the angle between two sets of coordinates.

#### Parameters

| Parameter    | Type      | Default value | Description                                                              |
| ------------ | --------- | ------------- | ------------------------------------------------------------------------ |
| `cx`         | `number`  | `undefined`   | The x-coordinate of the first point.                                     |
| `cy`         | `number`  | `undefined`   | The y-coordinate of the first point.                                     |
| `ex`         | `number`  | `undefined`   | The x-coordinate of the second point.                                    |
| `ey`         | `number`  | `undefined`   | The y-coordinate of the second point.                                    |
| `normalize?` | `boolean` | `true`        | If the angle output should be normalized to a value between 0° and 360°. |

#### Returns

`number`

The angle between the given coordinates.

#### Throws

Missing input for `angle`.

#### Throws

Parameters for `angle` do not have the required type.

#### Example

```ts
// Calculate the angle between two points
const angleValue = angle(0, 0, 3, 4);
console.log(angleValue); // 53.13
// Normalized
const angleValue = angle(0, 0, -3, -4, true);
console.log(angleValue); // 233.13
```

---

**Contributing**

Want to contribute? Please read the
[CONTRIBUTING.md](https://github.com/phun-ky/angle/blob/main/CONTRIBUTING.md)
and
[CODE_OF_CONDUCT.md](https://github.com/phun-ky/angle/blob/main/CODE_OF_CONDUCT.md)

**Sponsor me**

I'm an Open Source evangelist, creating stuff that does not exist yet to help
get rid of secondary activities and to enhance systems already in place, be it
documentation or web sites.

The sponsorship is an unique opportunity to alleviate more hours for me to
maintain my projects, create new ones and contribute to the large community
we're all part of :)

[Support me on GitHub Sponsors](https://github.com/sponsors/phun-ky).

---

This project created by [Alexander Vassbotn Røyne-Helgesen](http://phun-ky.net)
is licensed under a [MIT License](https://choosealicense.com/licenses/mit/).
