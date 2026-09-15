export type Point = readonly [number, number];

/**
 * Closed or open Catmull-Rom spline through the points, as cubic Béziers.
 * Every path built from the same number of points has identical commands,
 * so two of them can be morphed number-for-number.
 */
export function smoothPath(points: readonly Point[], closed: boolean) {
  const n = points.length;
  const at = (i: number) =>
    closed ? points[(i + n) % n] : points[Math.max(0, Math.min(n - 1, i))];
  const f = (v: number) => v.toFixed(1);

  let d = `M${f(points[0][0])} ${f(points[0][1])}`;
  const segments = closed ? n : n - 1;
  for (let i = 0; i < segments; i++) {
    const [x0, y0] = at(i - 1);
    const [x1, y1] = at(i);
    const [x2, y2] = at(i + 1);
    const [x3, y3] = at(i + 2);
    d += `C${f(x1 + (x2 - x0) / 6)} ${f(y1 + (y2 - y0) / 6)} ${f(x2 - (x3 - x1) / 6)} ${f(y2 - (y3 - y1) / 6)} ${f(x2)} ${f(y2)}`;
  }
  return closed ? `${d}Z` : d;
}
