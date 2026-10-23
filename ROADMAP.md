# Roadmap

What angle intends to do, and not do, from October 2026 to October 2027. It's a
plan, not a promise: priorities can change, and changes to this file are made in
pull requests like any other. Individual pieces of work are tracked as
[GitHub issues](https://github.com/phun-ky/angle/issues), grouped in milestones.

## Planned

### Keeping 1.x stable

`angle()` works in Node.js (ES modules and CommonJS), bundlers, browsers and
TypeScript since 1.0.65, and every release is checked by installing the packed
package and calling it from each entry point. From here:

- **No breaking changes in 1.x.** The current major is supported as a whole and
  the previous one gets high and critical security fixes for 6 months; see the
  [security policy](SECURITY.md#supported-versions).
- **Deprecations before removals:** a deprecated API keeps working through one
  full major.

### Documentation

- **The documentation site** at <https://phun-ky.net/angle/>, with its API
  reference generated from the source, and every code example run against the
  packed package before it's published
  ([#117](https://github.com/phun-ky/angle/issues/117)).

### Project health

- **OpenSSF Best Practices:** the passing badge, then silver and OSPS Baseline
  ([#113](https://github.com/phun-ky/angle/issues/113)).
- **Releases that OpenSSF Scorecard recognises as signed**, with the provenance
  attached to each GitHub release
  ([#133](https://github.com/phun-ky/angle/issues/133)).
- **TypeScript 7**, once the tools the build and lint depend on support it
  ([#130](https://github.com/phun-ky/angle/issues/130)).
- **A second maintainer**, so that pull requests get a review from someone other
  than the author and access to the project doesn't rest on one person; see
  [governance](GOVERNANCE.md#continuity).

## Considered, not scheduled

Ideas that fit the project but have no date. Each would be discussed in an issue
first, and any breaking change waits for a 2.0 with an upgrading guide.

- **Stricter input checks:** rejecting `NaN` and infinite coordinates, and a
  `normalize` flag that must be a boolean. Today they pass through; see the
  [security policy](SECURITY.md#security-expectations).

## Not planned

- **Bundling runtime dependencies.** Runtime dependencies are declared and
  installed from npm, never bundled into the ES module or CommonJS builds; only
  the UMD build for script tags includes them.
- **Collecting data.** The package doesn't collect, store or send data anywhere.
