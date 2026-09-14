/**
 * Geometry for the hero's morphing blob.
 *
 * Every shape is built the same way: 24 points around a centre, joined by a
 * closed Catmull-Rom spline converted to cubic Béziers. Because each path
 * has identical commands in identical order, the `d` attribute can be
 * interpolated number-for-number between any two states.
 *
 * One `progress` value (0 → 1) drives the character of the shape:
 *   0  rough — lopsided radii, points pushed off their angles
 *   1  resolved — a squircle, the rounded-square form the brand mark leans on
 * Each step also shifts the wobble's phase, so intermediate states are
 * distinct shapes rather than a straight blend between the two ends.
 */

const POINTS = 24;
const SIZE = 1000;
const CENTRE = SIZE / 2;

/** Radius of a squircle (superellipse, exponent 3.5) at a given angle. */
function squircleRadius(angle: number, radius: number) {
  const n = 3.5;
  const c = Math.abs(Math.cos(angle)) ** n;
  const s = Math.abs(Math.sin(angle)) ** n;
  return radius / (c + s) ** (1 / n);
}

function shapePoints(progress: number) {
  // Irregularity fades out slightly faster than the form resolves, so the
  // late states read as "nearly there" rather than still wobbling.
  const roughness = (1 - progress) ** 1.25;
  const phase = progress * 5.2;
  const rotation = progress * 0.26;

  return Array.from({ length: POINTS }, (_, i) => {
    const base = (i / POINTS) * Math.PI * 2;

    const wobble =
      0.55 * Math.sin(2 * base + 0.9 + phase) +
      0.35 * Math.sin(3 * base + 2.1 - phase * 0.7) +
      0.25 * Math.sin(5 * base + 4.3 + phase * 1.3);
    const drift = 0.16 * Math.sin(4 * base + 1.7 + phase);

    const angle = base + rotation + roughness * drift;
    const organic = 350 * (1 + roughness * 0.25 * wobble);
    const geometric = squircleRadius(base, 335);
    const radius = organic + (geometric - organic) * progress;

    return [
      CENTRE + Math.cos(angle) * radius,
      CENTRE + Math.sin(angle) * radius,
    ] as const;
  });
}

const fmt = (value: number) => value.toFixed(1);

function toPath(points: ReadonlyArray<readonly [number, number]>) {
  const count = points.length;
  const at = (i: number) => points[(i + count) % count];

  let d = `M${fmt(at(0)[0])} ${fmt(at(0)[1])}`;
  for (let i = 0; i < count; i++) {
    const [p0x, p0y] = at(i - 1);
    const [p1x, p1y] = at(i);
    const [p2x, p2y] = at(i + 1);
    const [p3x, p3y] = at(i + 2);
    const c1x = p1x + (p2x - p0x) / 6;
    const c1y = p1y + (p2y - p0y) / 6;
    const c2x = p2x - (p3x - p1x) / 6;
    const c2y = p2y - (p3y - p1y) / 6;
    d += `C${fmt(c1x)} ${fmt(c1y)} ${fmt(c2x)} ${fmt(c2y)} ${fmt(p2x)} ${fmt(p2y)}`;
  }
  return `${d}Z`;
}

export const BLOB_VIEWBOX = `0 0 ${SIZE} ${SIZE}`;

/** Five states, roughest to most resolved. */
export const blobStates = [0, 0.25, 0.5, 0.75, 1].map((p) =>
  toPath(shapePoints(p)),
);

/** A between-keyframes frame, shown when motion is reduced. */
export const blobStill = toPath(shapePoints(0.55));
