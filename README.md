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
  - [Installation](#installation)
  - [Usage](#usage)
  - [API](#api)
    - [angle()](#angle)
  - [Development](#development)
  - [Contributing](#contributing)
  - [License](#license)
  - [Changelog](#changelog)
  - [Sponsor me](#sponsor-me)

## Installation

```shell-session
npm i --save @phun-ky/angle
```

## Usage

Either import and run the required functions:

```javascript
import { angle } from '@phun-ky/angle';

const angleValue = angle(0, 0, 3, 4);

console.log(angleValue); // 53.13
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

Full API documentation is available
[here](https://github.com/phun-ky/angle/blob/main/api/README.md).

## Development

```shell-session
// Build
$ npm run build
// Run dev
$ npm run dev
// Test
$ npm test
```

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

![Speccer banner, with logo and slogan: A zero dependency package to annotate or highlight elements](./public/angle-banner.png)

p.s. **Ukraine is still under brutal Russian invasion. A lot of Ukrainian people
are hurt, without shelter and need help**. You can help in various ways, for
instance, directly helping refugees, spreading awareness, putting pressure on
your local government or companies. You can also support Ukraine by donating
e.g. to [Red Cross](https://www.icrc.org/en/donate/ukraine),
[Ukraine humanitarian organisation](https://savelife.in.ua/en/donate-en/#donate-army-card-weekly)
or
[donate Ambulances for Ukraine](https://www.gofundme.com/f/help-to-save-the-lives-of-civilians-in-a-war-zone).
