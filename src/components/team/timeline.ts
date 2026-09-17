import { easeInOut } from "motion/react";

/**
 * The team chapter's choreography, as windows of scroll progress through the
 * pinned track (0 → 1). Every page turns the same way, right to left, like a
 * book being read.
 */
export type Window = [number, number];

/** The closed book, then the front cover opens onto Ebenezer. */
export const OPEN: Window = [0.08, 0.22];
/** Ebenezer → Annie. */
export const TURN_1: Window = [0.34, 0.48];
/** Annie → Muiz. */
export const TURN_2: Window = [0.58, 0.72];
/** The last page turns, carrying the back cover, and the book is closed. */
export const CLOSE: Window = [0.8, 0.86];
/** The closed book slides back to the centre, and the back cover's words come up. */
export const CENTRE: Window = [0.855, 0.9];
export const STATEMENT: Window = [0.87, 0.92];

/** How far through a window `p` is, eased, 0 → 1. */
export function through(p: number, [start, end]: Window) {
  const t = Math.min(1, Math.max(0, (p - start) / (end - start)));
  return easeInOut(t);
}

/** A page's angle, 0° flat where it started to 180° flat on the other side. */
export function angleAt(p: number, window: Window) {
  return through(p, window) * 180;
}

/**
 * The shadow a turning page casts. On the side it leaves, the page it uncovers
 * darkens near the crease as the leaf lifts; on the side it lands, the page
 * below darkens as the leaf comes down over it.
 */
export function shadowLeaving(angle: number) {
  return angle > 0 && angle < 90 ? 0.22 * Math.sin((angle / 90) * Math.PI) : 0;
}
export function shadowLanding(angle: number) {
  return angle > 90 && angle < 180 ? 0.3 * Math.sin(((angle - 90) / 90) * Math.PI) : 0;
}

export { pad } from "@/lib/pad";
