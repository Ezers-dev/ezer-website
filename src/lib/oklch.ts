/**
 * Colour interpolation in OKLCH, for scroll-scrubbed colour changes.
 *
 * Mixing two brand colours channel-by-channel in RGB drags the midpoint
 * through grey — blue to pink goes via a dusty mauve, pink to green via
 * brown. OKLCH interpolates lightness, chroma and hue separately and takes
 * the short way round the hue wheel, so the midpoint stays as vivid as the
 * ends: blue to pink passes through violet, pink to green through gold.
 */

type Lch = { l: number; c: number; h: number };

function hexToLinear(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
}

export function hexToOklch(hex: string): Lch {
  const [r, g, b] = hexToLinear(hex);
  const l_ = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m_ = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s_ = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const A = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const B = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
  const h = (Math.atan2(B, A) * 180) / Math.PI;
  return { l: L, c: Math.hypot(A, B), h: h < 0 ? h + 360 : h };
}

/** A CSS oklch() string `t` of the way from `a` to `b`. */
export function mixOklch(a: Lch, b: Lch, t: number) {
  let dh = b.h - a.h;
  if (dh > 180) dh -= 360;
  if (dh < -180) dh += 360;
  const h = (a.h + dh * t + 360) % 360;
  const l = a.l + (b.l - a.l) * t;
  const c = a.c + (b.c - a.c) * t;
  return `oklch(${l.toFixed(4)} ${c.toFixed(4)} ${h.toFixed(2)})`;
}
