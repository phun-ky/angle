import { isNotNumber, isUndefined } from '@phun-ky/typeof';

/**
 * Returns the angle between two sets of coordinates.
 *
 * @param {number} cx - The x-coordinate of the first point.
 * @param {number} cy - The y-coordinate of the first point.
 * @param {number} ex - The x-coordinate of the second point.
 * @param {number} ey - The y-coordinate of the second point.
 * @param {boolean} [normalize=true] - If the angle output should be normalized to a value between 0° and 360°.
 * @throws {SyntaxError} Missing input for `angle`.
 * @throws {TypeError} Parameters for `angle` do not have the required type.
 * @returns {number} The angle between the given coordinates.
 * @example
 * ```ts
 * // Calculate the angle between two points
 * const angleValue = angle(0, 0, 3, 4);
 * console.log(angleValue); // 53.13
 * // Normalized
 * const angleValue = angle(0, 0, -3, -4, true);
 * console.log(angleValue); // 233.13
 * ```
 */
export const angle = (
  cx: number,
  cy: number,
  ex: number,
  ey: number,
  normalize = true
): number => {
  if (isUndefined(cx) || isUndefined(cy) || isUndefined(ex) || isUndefined(ey))
    throw new SyntaxError('Missing input for `angle`');

  if (isNotNumber(cx) || isNotNumber(cy) || isNotNumber(ex) || isNotNumber(ey))
    throw TypeError(
      `Parameters for \`angle\` do not have the required type. Requires number! Got: ${typeof cx} ${typeof cy} ${typeof ex} ${typeof ey}`
    );

  const dy = ey - cy;
  const dx = ex - cx;

  let theta = Math.atan2(dy, dx); // range [-PI, PI]

  theta *= 180 / Math.PI; // radians to degrees, range [-180, 180]

  if (normalize && theta < 0) theta += 360; // range [0, 360]

  return theta;
};
