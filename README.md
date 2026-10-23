# @phun-ky/angle

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-green.svg)](http://makeapullrequest.com)
[![SemVer 2.0](https://img.shields.io/badge/SemVer-2.0-green.svg)](http://semver.org/spec/v2.0.0.html)
![npm version](https://img.shields.io/npm/v/@phun-ky/angle)
![issues](https://img.shields.io/github/issues/phun-ky/angle)
![license](https://img.shields.io/npm/l/@phun-ky/angle)
![size](https://img.shields.io/bundlephobia/min/@phun-ky/angle)
![npm](https://img.shields.io/npm/dm/%40phun-ky/angle)
![GitHub Repo stars](https://img.shields.io/github/stars/phun-ky/angle)
[![codecov](https://codecov.io/gh/phun-ky/angle/graph/badge.svg?token=VA91DL7ZLZ)](https://codecov.io/gh/phun-ky/angle)
[![build](https://github.com/phun-ky/angle/actions/workflows/check.yml/badge.svg)](https://github.com/phun-ky/angle/actions/workflows/check.yml)

## About

A JavaScript function to calculate the angle between two coordinates.

## Table of Contents<!-- omit from toc -->

- [@phun-ky/angle](#phun-kyangle)
  - [About](#about)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Usage](#usage)
    - [ES modules](#es-modules)
    - [CommonJS](#commonjs)
    - [Browser](#browser)
  - [API](#api)
    - [angle()](#angle)
  - [Contributing](#contributing)
  - [License](#license)
  - [Changelog](#changelog)
  - [Sponsor me](#sponsor-me)

## Requirements

Node.js 22 or later, or any browser or bundler that supports ES2022. Types are
included.

## Installation

```shell-session
npm i @phun-ky/angle
```

## Usage

`angle()` returns the angle in degrees from the first point to the second,
between 0 and 360. Pass `false` as the last argument to get a value between -180
and 180 instead.

### ES modules

```javascript
import { angle } from '@phun-ky/angle';

console.log(angle(0, 0, 3, 4).toFixed(2)); // 53.13
console.log(angle(0, 0, -3, -4).toFixed(2)); // 233.13
console.log(angle(0, 0, -3, -4, false).toFixed(2)); // -126.87
```

### CommonJS

```javascript
const { angle } = require('@phun-ky/angle');

console.log(angle(0, 0, 3, 4).toFixed(2)); // 53.13
```

### Browser

As an ES module:

```html
<script type="module">
  import { angle } from 'https://unpkg.com/@phun-ky/angle@1/dist/angle.esm.js';

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

## API

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

- `SyntaxError` if any of the coordinates is missing.
- `TypeError` if any of the coordinates is not a number.

#### Example

```ts
// The angle from (0, 0) to (3, 4)
console.log(angle(0, 0, 3, 4).toFixed(2)); // 53.13
// Normalized to between 0° and 360° (the default)
console.log(angle(0, 0, -3, -4).toFixed(2)); // 233.13
// Not normalized, between -180° and 180°
console.log(angle(0, 0, -3, -4, false).toFixed(2)); // -126.87
```

---

See the
[full API documentation](https://github.com/phun-ky/angle/blob/main/api/README.md).

## Contributing

Want to contribute? Please read the
[CONTRIBUTING.md](https://github.com/phun-ky/angle/blob/main/CONTRIBUTING.md)
and
[CODE_OF_CONDUCT.md](https://github.com/phun-ky/angle/blob/main/CODE_OF_CONDUCT.md)

## License

This project is licensed under the MIT License - see the
[LICENSE](https://github.com/phun-ky/angle/blob/main/LICENSE) file for details.

## Changelog

See the [CHANGELOG.md](https://github.com/phun-ky/angle/blob/main/CHANGELOG.md)
for details on the latest updates.

## Sponsor me

I'm an Open Source evangelist, creating stuff that does not exist yet to help
get rid of secondary activities and to enhance systems already in place, be it
documentation or web sites.

The sponsorship is an unique opportunity to alleviate more hours for me to
maintain my projects, create new ones and contribute to the large community
we're all part of :)

[Support me on GitHub Sponsors](https://github.com/sponsors/phun-ky).

p.s. **Ukraine is still under brutal Russian invasion. A lot of Ukrainian people
are hurt, without shelter and need help**. You can help in various ways, for
instance, directly helping refugees, spreading awareness, putting pressure on
your local government or companies. You can also support Ukraine by donating
e.g. to [Red Cross](https://www.icrc.org/en/donate/ukraine),
[Ukraine humanitarian organisation](https://savelife.in.ua/en/donate-en/#donate-army-card-weekly)
or
[donate Ambulances for Ukraine](https://www.gofundme.com/f/help-to-save-the-lives-of-civilians-in-a-war-zone).
