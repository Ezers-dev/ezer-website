/**
 * Geometry for the "An Idea That Crossed Borders" canvas, in an 800×800
 * viewBox. Continents are deliberately rough: a handful of points each,
 * smoothed, so they read as an editorial sketch of the Atlantic rather
 * than a map anyone would navigate by.
 */

export type Point = readonly [number, number];

export const VIEWBOX = 800;

/** Closed or open Catmull-Rom spline through the points, as cubic Béziers. */
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

// Clockwise from the tip of Alaska: the Arctic coast, the notch of Hudson
// Bay, Labrador, the eastern seaboard down to Florida, the Gulf, the tail
// of Central America, then back up the Pacific coast.
export const NORTH_AMERICA = smoothPath(
  [
    [40, 132], [80, 98], [140, 86], [200, 94], [260, 78], [318, 88],
    [348, 114], [340, 142], [370, 150], [404, 128], [420, 170], [398, 204],
    [372, 230], [358, 264], [346, 296], [336, 318], [342, 350], [326, 346],
    [312, 322], [278, 318], [252, 330], [246, 362], [262, 394], [280, 424],
    [262, 428], [230, 394], [198, 354], [168, 318], [140, 272], [116, 226],
    [96, 180], [64, 160],
  ],
  true,
);

// Clockwise from Morocco: the Mediterranean coast, the Red Sea, the Horn,
// down the east coast to the Cape, up the west coast to the Gulf of Guinea
// (Lagos sits on it), and out to the western bulge.
export const AFRICA = smoothPath(
  [
    [468, 392], [530, 372], [600, 378], [660, 392], [700, 420], [724, 466],
    [756, 494], [724, 538], [702, 600], [678, 680], [638, 752], [604, 742],
    [582, 682], [562, 604], [548, 552], [522, 512], [486, 504], [454, 490],
    [428, 460], [436, 424],
  ],
  true,
);

export const LAGOS: Point = [500, 486];
export const TORONTO: Point = [322, 236];

/** Cubic control points for the Lagos → Toronto journey. */
// Leaves Lagos westward over the Gulf of Guinea, arcs up through the open
// Atlantic between the two coasts, and comes in over the eastern seaboard.
const JOURNEY_CONTROLS: readonly Point[] = [LAGOS, [420, 470], [452, 250], TORONTO];

export const JOURNEY = `M${LAGOS[0]} ${LAGOS[1]} C${JOURNEY_CONTROLS[1][0]} ${JOURNEY_CONTROLS[1][1]}, ${JOURNEY_CONTROLS[2][0]} ${JOURNEY_CONTROLS[2][1]}, ${TORONTO[0]} ${TORONTO[1]}`;

/** Point on the journey at t ∈ [0, 1]. */
export function journeyPoint(t: number): Point {
  const [p0, p1, p2, p3] = JOURNEY_CONTROLS;
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return [
    a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0],
    a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1],
  ];
}

/** Problem → Strategy → Idea → Execution, branching out of the origin. */
// Each label sits on the side its lines don't pass through.
export const CHAIN: { label: string; at: Point; key?: boolean; labelSide: "right" | "below" | "above" }[] = [
  { label: "Problem", at: [452, 588], labelSide: "right" },
  { label: "Strategy", at: [350, 640], key: true, labelSide: "below" },
  { label: "Idea", at: [248, 632], labelSide: "below" },
  { label: "Execution", at: [158, 578], labelSide: "above" },
];

export const STRATEGY_NODE = CHAIN[1].at;

/** Every artifact is drawn in an 88×70 box centred on its position. */
export const FRAME_W = 88;
export const FRAME_H = 70;

export type ArtifactKind =
  | "logo"
  | "campaign"
  | "content"
  | "digital"
  | "type"
  | "document"
  | "image";

/*
 * Where each artifact lives. `home` is where it settles when first made;
 * `grid` is its cell in the resolved system at the end. Creative outputs
 * emerge from the Strategy node; the rest are left behind along the journey.
 */
export const ARTIFACTS: {
  kind: ArtifactKind;
  label: string;
  home: Point;
  homeScale: number;
  grid: Point;
  source: "strategy" | { journey: number };
}[] = [
  { kind: "logo", label: "Logo", home: [176, 470], homeScale: 1, grid: [150, 562], source: "strategy" },
  { kind: "campaign", label: "Campaign", home: [300, 486], homeScale: 1, grid: [250, 562], source: "strategy" },
  { kind: "content", label: "Content", home: [214, 728], homeScale: 1, grid: [350, 562], source: "strategy" },
  { kind: "digital", label: "Digital", home: [338, 736], homeScale: 1, grid: [450, 562], source: "strategy" },
  { kind: "type", label: "Typography", home: [396, 404], homeScale: 0.72, grid: [200, 652], source: { journey: 0.28 } },
  { kind: "document", label: "Strategy doc", home: [518, 292], homeScale: 0.72, grid: [300, 652], source: { journey: 0.56 } },
  { kind: "image", label: "Image", home: [112, 402], homeScale: 0.72, grid: [400, 652], source: { journey: 0.84 } },
];

/** Outline of the resolved system that the artifacts settle into. */
export const SYSTEM_FRAME = { x: 88, y: 510, w: 424, h: 194 };
