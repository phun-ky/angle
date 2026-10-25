import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import fc from 'fast-check';

import { angle } from '../main';

// Any finite number: the type checks let NaN and infinities through, so they
// are covered by example tests instead
const coordinate = fc.double({ noNaN: true, noDefaultInfinity: true });
// Integers keep the arithmetic exact enough to compare angles closely
const integer = fc.integer({ min: -1_000_000, max: 1_000_000 });
const point = fc.tuple(integer, integer);
const distinct = fc
  .tuple(point, point)
  .filter(([[cx, cy], [ex, ey]]) => cx !== ex || cy !== ey);
/** The difference between two angles in degrees, between -180 and 180. */
const difference = (a: number, b: number) =>
  ((((a - b) % 360) + 540) % 360) - 180;
const TOLERANCE = 1e-9;

describe('angle properties', () => {
  it('is from 0 up to, but not including, 360 when normalized', () => {
    fc.assert(
      fc.property(coordinate, coordinate, coordinate, coordinate, (...c) => {
        const value = angle(c[0], c[1], c[2], c[3]);

        assert.ok(value >= 0 && value < 360, `got ${value}`);
        assert.ok(!Object.is(value, -0), 'got -0');
      })
    );
  });

  it('is between -180 and 180 when not normalized', () => {
    fc.assert(
      fc.property(coordinate, coordinate, coordinate, coordinate, (...c) => {
        const value = angle(c[0], c[1], c[2], c[3], false);

        assert.ok(value >= -180 && value <= 180, `got ${value}`);
      })
    );
  });

  it('gives the same direction normalized or not', () => {
    fc.assert(
      fc.property(coordinate, coordinate, coordinate, coordinate, (...c) => {
        const normalized = angle(c[0], c[1], c[2], c[3]);
        const raw = angle(c[0], c[1], c[2], c[3], false);

        assert.ok(Math.abs(difference(normalized, raw)) < TOLERANCE);
      })
    );
  });

  it('does not change when both points move by the same offset', () => {
    fc.assert(
      fc.property(distinct, point, ([[cx, cy], [ex, ey]], [dx, dy]) => {
        const moved = angle(cx + dx, cy + dy, ex + dx, ey + dy);

        assert.ok(
          Math.abs(difference(moved, angle(cx, cy, ex, ey))) < TOLERANCE
        );
      })
    );
  });

  it('turns by 180 when the two points swap', () => {
    fc.assert(
      fc.property(distinct, ([[cx, cy], [ex, ey]]) => {
        const there = angle(cx, cy, ex, ey);
        const back = angle(ex, ey, cx, cy);

        assert.ok(Math.abs(difference(back, there + 180)) < TOLERANCE);
      })
    );
  });

  it('does not change when the distance grows', () => {
    fc.assert(
      fc.property(
        point.filter(([x, y]) => x !== 0 || y !== 0),
        fc.integer({ min: 1, max: 1000 }),
        ([x, y], k) => {
          assert.ok(
            Math.abs(difference(angle(0, 0, k * x, k * y), angle(0, 0, x, y))) <
              TOLERANCE
          );
        }
      )
    );
  });

  it('throws a TypeError for any coordinate that is not a number', () => {
    fc.assert(
      fc.property(
        fc
          .anything()
          .filter((value) => typeof value !== 'number' && value !== undefined),
        fc.integer({ min: 0, max: 3 }),
        (value, index) => {
          const coordinates: unknown[] = [0, 0, 3, 4];

          coordinates[index] = value;
          assert.throws(
            // @ts-expect-error testing the wrong argument type
            () => angle(...coordinates),
            TypeError
          );
        }
      )
    );
  });
});

describe('angle edge cases', () => {
  it('returns 0 for a point just below the positive x axis (#149)', () => {
    assert.ok(Object.is(angle(0, 0, 1, -1e-300), 0));
    assert.ok(angle(0, 0, 1, -1e-300, false) < 0);
  });

  it('returns 0, not -0, for a point on the positive x axis with y -0 (#149)', () => {
    assert.ok(Object.is(angle(0, 0, 1, -0), 0));
    assert.ok(Object.is(angle(0, 0, 1, -0, false), -0));
  });

  it('returns 0 for two equal points', () => {
    assert.equal(angle(1, 1, 1, 1), 0);
  });

  it('lets NaN and infinite coordinates through', () => {
    assert.ok(Number.isNaN(angle(NaN, 0, 1, 1)));
    assert.equal(angle(0, 0, Infinity, 1), 0);
    assert.equal(angle(0, 0, Infinity, Infinity), 45);
    assert.ok(Number.isNaN(angle(Infinity, 0, Infinity, 0)));
  });
});
