import type { ArtifactKind } from "./geometry";
import { FRAME_H, FRAME_W } from "./geometry";

const W = FRAME_W / 2;
const H = FRAME_H / 2;

/*
 * The inner drawing of each piece of work, centred on 0,0 inside an 88×70
 * frame. Thin ink lines with a single brand accent each, closer to a
 * studio thumbnail sketch than an icon.
 */
function Inner({ kind }: { kind: ArtifactKind }) {
  switch (kind) {
    case "logo":
      // A logo grid: four marks, one in the brand blue.
      return (
        <g>
          <circle cx={-18} cy={-13} r={8} className="fill-blue stroke-none" />
          <rect x={10} y={-21} width={16} height={16} rx={3} />
          <path d="M-18 5 L-9 21 H-27 Z" />
          <rect x={6} y={9} width={24} height={9} rx={4.5} />
          <path d="M0 -30 V30 M-40 0 H40" className="stroke-ink/20" />
        </g>
      );
    case "campaign":
      // A campaign poster: big headline bars, an image block, a call to action.
      return (
        <g>
          <rect x={-36} y={-27} width={34} height={42} className="fill-pink/15" />
          <path d="M6 -24 H34 M6 -15 H30 M6 -6 H24" strokeWidth={3.2} strokeLinecap="round" />
          <rect x={6} y={8} width={22} height={9} rx={4.5} className="fill-pink stroke-none" />
          <path d="M-36 23 H34" className="stroke-ink/30" />
        </g>
      );
    case "content":
      // A social post: avatar row, square image, engagement row.
      return (
        <g>
          <circle cx={-30} cy={-24} r={4} />
          <path d="M-22 -24 H0" className="stroke-ink/40" />
          <rect x={-34} y={-15} width={68} height={32} className="fill-green/15" />
          <path d="M-34 12 L-14 -4 L0 8 L14 -6 L34 12" />
          <path d="M-30 25 l3 -3 l3 3 M-18 25 h8 M22 25 h10" className="stroke-ink/60" />
        </g>
      );
    case "digital":
      // A website: browser bar, nav, hero, three columns.
      return (
        <g>
          <path d="M-44 -22 H44" />
          <circle cx={-37} cy={-28.5} r={1.8} className="fill-ink stroke-none" />
          <circle cx={-31} cy={-28.5} r={1.8} className="fill-ink stroke-none" />
          <circle cx={-25} cy={-28.5} r={1.8} className="fill-ink stroke-none" />
          <rect x={-36} y={-15} width={72} height={16} className="fill-blue/15" />
          <path d="M-30 -7 H6" strokeWidth={2.6} strokeLinecap="round" />
          <rect x={-36} y={8} width={21} height={18} />
          <rect x={-10.5} y={8} width={21} height={18} />
          <rect x={15} y={8} width={21} height={18} />
        </g>
      );
    case "type":
      // A type specimen.
      return (
        <g>
          <text
            x={-34}
            y={14}
            className="fill-ink stroke-none font-sans"
            style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.04em" }}
          >
            Aa
          </text>
          <path d="M-36 17 H36 M-36 -21 H36" className="stroke-orange" />
          <path d="M18 -12 H36 M18 -4 H32 M18 4 H36" className="stroke-ink/40" />
        </g>
      );
    case "document":
      // A strategy document with a checked objective.
      return (
        <g>
          <path d="M-30 -28 H18 L30 -16 V28 H-30 Z" />
          <path d="M18 -28 V-16 H30" />
          <path d="M-20 -14 H8 M-20 -4 H18 M-20 6 H14" className="stroke-ink/45" />
          <path d="M-20 18 l5 5 l10 -10" className="stroke-green" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    case "image":
      // An image frame: horizon, sun, mountains.
      return (
        <g>
          <rect x={-36} y={-27} width={72} height={54} className="fill-yellow/20" />
          <circle cx={18} cy={-11} r={7} className="fill-yellow stroke-none" />
          <path d="M-36 27 L-12 -2 L4 14 L16 4 L36 27" />
        </g>
      );
  }
}

/** Full artifact drawing: frame plus inner composition. */
export function ArtifactArt({ kind }: { kind: ArtifactKind }) {
  return (
    <g className="fill-none stroke-ink" strokeWidth={1.4}>
      <rect x={-W} y={-H} width={FRAME_W} height={FRAME_H} className="fill-paper" />
      <Inner kind={kind} />
    </g>
  );
}

export { Inner as ArtifactInner };
