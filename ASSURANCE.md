# Assurance Case

Why the [security expectations](SECURITY.md#security-expectations) of
`@phun-ky/angle` hold, what they rest on, and where they don't hold yet. It is
kept short because the package is small: one pure function, one runtime
dependency by the same maintainer, and a build and release pipeline.

## What is being protected

- **Users of the package:** their applications must get a correct number or a
  clear error from `angle()`, and nothing else: no network, file system or
  global side effects, no code run from input.
- **The published package:** what users install from npm or load from a CDN must
  be exactly what this repository built, with nothing added on the way.
- **The repository and its release pipeline:** the source, the workflows and the
  credentials that publish releases.

## Threat model

| Threat                               | Where                                                            | How it is countered                                                                                                                                                                                                                                                                                     |
| ------------------------------------ | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A tampered or substituted release    | npm, CDNs                                                        | Releases are built and published only from GitHub Actions with npm trusted publishing (no long-lived token) and carry Sigstore-signed provenance, verifiable with `npm audit signatures`; each GitHub release has a CycloneDX SBOM                                                                      |
| A malicious or vulnerable dependency | The runtime dependency, development dependencies, GitHub Actions | One runtime dependency, by the same maintainer, declared and installed from npm (not bundled into the module builds); `npm audit` blocks releases on high or critical runtime advisories; dependency review blocks pull requests; Dependabot proposes updates weekly; Actions are pinned to commit SHAs |
| A malicious change to the source     | Pull requests                                                    | Pull requests only, with required checks (tests, lint, packaging, dependency review, CodeQL, the DCO) on `main`; no force pushes or deletion of `main`                                                                                                                                                  |
| Abuse of CI credentials              | Workflows                                                        | Read-only default permissions in every workflow, write only per job; pull requests from forks get no secrets; no untrusted value is interpolated into a script; secret scanning with push protection                                                                                                    |
| Unexpected input                     | Callers of `angle()`                                             | Missing coordinates throw a `SyntaxError`, coordinates that are not numbers a `TypeError`; the remaining gaps are listed under [Known gaps](#known-gaps)                                                                                                                                                |

## Trust boundaries

1. **Caller to `angle()`:** the arguments come from the application, which may
   pass user input. `angle()` checks that the four coordinates are present and
   numbers, does arithmetic on them, and returns a number. It keeps no state and
   calls nothing outside itself and `@phun-ky/typeof`.
2. **Repository to npm:** only the publish workflow, after a merge to `main` and
   the release guard, can publish, through npm trusted publishing.
3. **npm or CDN to the user:** the user's package manager or browser fetches the
   package; provenance and the npm registry's integrity hashes link it to this
   repository and build.

## Secure design principles

- **Economy of mechanism:** one function, a few lines, no options beyond one
  flag.
- **Fail-safe defaults:** missing or non-number coordinates throw instead of
  returning a value.
- **Least privilege:** the function has no side effects; CI tokens are read-only
  by default and write only where a job needs it.
- **Open design:** everything is public, including the release pipeline and this
  document.
- **No dynamic code:** no `eval`, `new Function` or loading of code.
- **Minimal dependencies:** one runtime dependency, by the same maintainer,
  declared, and checked in CI not to be bundled into the module builds.

## Common weaknesses countered

| Weakness                                           | Status                                                                          |
| -------------------------------------------------- | ------------------------------------------------------------------------------- |
| CWE-94 code injection                              | No dynamic code anywhere in the package                                         |
| CWE-1321 prototype pollution                       | No objects are built from input; the function only reads its number arguments   |
| CWE-20 improper input validation                   | Presence and type of every coordinate are checked; ranges are not (see below)   |
| CWE-829 inclusion from an untrusted control sphere | One declared runtime dependency, provenance on releases, Actions pinned to SHAs |
| CWE-494 download of code without integrity check   | npm verifies integrity hashes; releases carry signed provenance                 |

## Known gaps

- **Range checks:** `NaN` and `Infinity` are numbers, so they pass the type
  checks, and the result can be `NaN`. The `normalize` flag is not checked.
  Stricter checks are considered for a 2.0 in the [roadmap](ROADMAP.md).
- **Edge results:** the normalized angle can be exactly `360` or `-0` for points
  on or just below the positive x axis
  ([#149](https://github.com/phun-ky/angle/issues/149)).
- **One maintainer:** pull requests by the maintainer get no second review, and
  access to the repository and the package rests on one person; see
  [governance](GOVERNANCE.md#continuity).
- **Tags are not signed;** releases are verified through npm provenance instead.
