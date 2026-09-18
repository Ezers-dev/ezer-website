"use client";

import type { ReactNode } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";

/** How many vertical strips a sheet bends through. */
const STRIPS = 7;
/**
 * How far the outer edge runs ahead of the spine mid-turn, in degrees. The
 * bend eases off as the sheet lands, so it always comes down flat.
 */
const CURL = 55;

type LeafProps = {
  /** 0° flat on the right, 180° flat on the left. */
  angle: MotionValue<number>;
  /** Stacking at rest: [before the turn, after it]. */
  rest: readonly [number, number];
  front: ReactNode;
  back: ReactNode;
  /** Reduced motion: no turn, the faces cross-fade in place instead. */
  calm: boolean;
};

type StripProps = {
  index: number;
  /** The whole sheet's turn, applied at the spine. */
  angle: MotionValue<number>;
  /** The extra turn each strip adds to the one before it. */
  bend: MotionValue<number>;
  front: ReactNode;
  back: ReactNode;
};

/**
 * One strip of a sheet, hinged on the strip before it. Each shows its own
 * slice of the front and back faces, so together they read as one page.
 */
function Strip({ index, angle, bend, front, back }: StripProps) {
  const spine = index === 0;
  const rotateY = useTransform(spine ? angle : bend, (a) => -a);
  // Each frame is 1px wider than its strip so neighbours overlap with no seam;
  // the slices are measured against the strip itself.
  const unit = "(100% - 1px)";
  const width = `calc(${unit} * ${STRIPS})`;

  return (
    <motion.div
      style={{ rotateY, transformOrigin: "0% 50%" }}
      className={`absolute inset-y-0 w-full [transform-style:preserve-3d] ${spine ? "left-0" : "left-full"}`}
    >
      <div className="absolute inset-y-0 left-0 w-[calc(100%+1px)] overflow-hidden [backface-visibility:hidden]">
        <div className="absolute inset-y-0" style={{ width, left: `calc(${unit} * ${-index})` }}>
          {front}
        </div>
      </div>
      {/* The back is mirrored, so this strip shows the slice from the other end. */}
      <div className="absolute inset-y-0 -left-px w-[calc(100%+1px)] overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)]">
        <div className="absolute inset-y-0" style={{ width, left: `calc(${unit} * ${-(STRIPS - 1 - index)} + 1px)` }}>
          {back}
        </div>
      </div>
      {index < STRIPS - 1 && <Strip index={index + 1} angle={angle} bend={bend} front={front} back={back} />}
    </motion.div>
  );
}

/**
 * One sheet of the book, printed on both sides, turning right to left about
 * the crease.
 *
 * Like paper, it doesn't turn as a board: the outer edge lifts first and the
 * sheet curves as it goes over, flattening again as it lands. The curve comes
 * from a chain of strips, each hinged on the last and turned a little further.
 * The sheet darkens as it stands up and lightens as it comes down, and rides
 * above every page at rest while it moves.
 */
export function Leaf({ angle, rest, front, back, calm }: LeafProps) {
  const zIndex = useTransform(angle, (a) => (a <= 0.01 ? rest[0] : a >= 179.99 ? rest[1] : 70));
  const bend = useTransform(angle, (a) => (CURL / (STRIPS - 1)) * Math.sin((a * Math.PI) / 180));
  const frontShade = useTransform(angle, [0, 90], [0, 0.3]);
  const backShade = useTransform(angle, [90, 180], [0.3, 0]);
  const frontFade = useTransform(angle, [0, 90], [1, 0]);
  const backFade = useTransform(angle, [90, 180], [0, 1]);
  const flatFront = useTransform<number, string>(angle, (a) => (a <= 0.01 ? "visible" : "hidden"));
  const flatBack = useTransform<number, string>(angle, (a) => (a >= 179.99 ? "visible" : "hidden"));
  const moving = useTransform<number, string>(angle, (a) => (a > 0.01 && a < 179.99 ? "visible" : "hidden"));

  if (calm) {
    return (
      <>
        <motion.div style={{ opacity: frontFade, zIndex: rest[0] }} className="absolute inset-y-0 left-1/2 w-1/2">
          {front}
        </motion.div>
        <motion.div style={{ opacity: backFade, zIndex: rest[1] }} className="absolute inset-y-0 left-0 w-1/2">
          {back}
        </motion.div>
      </>
    );
  }

  // Each face carries its own crease shading, darker towards the spine, so
  // the slices line up across the strips.
  const frontFace = (
    <div className="relative h-full">
      {front}
      <motion.div style={{ opacity: frontShade }} className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/80 to-ink/25" />
    </div>
  );
  const backFace = (
    <div className="relative h-full">
      {back}
      <motion.div style={{ opacity: backShade }} className="pointer-events-none absolute inset-0 bg-gradient-to-l from-ink/80 to-ink/25" />
    </div>
  );

  return (
    <motion.div
      style={{ zIndex }}
      className="absolute inset-y-0 left-1/2 w-1/2 [perspective:2800px] [perspective-origin:0%_50%]"
    >
      {/* At rest the sheet is flat, so it is drawn whole: strips only while it moves. */}
      <motion.div style={{ visibility: flatFront }} className="absolute inset-0">
        {front}
      </motion.div>
      <motion.div style={{ visibility: flatBack }} className="absolute inset-y-0 -left-full w-full">
        {back}
      </motion.div>
      <motion.div
        style={{ visibility: moving, width: `${100 / STRIPS}%` }}
        className="absolute inset-y-0 left-0 [transform-style:preserve-3d]"
      >
        <Strip index={0} angle={angle} bend={bend} front={frontFace} back={backFace} />
      </motion.div>
    </motion.div>
  );
}
