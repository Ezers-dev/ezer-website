"use client";

import type { ReactNode } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";

type LeafProps = {
  /** 0° flat on the side it starts on, 180° flat on the other side. */
  angle: MotionValue<number>;
  /** The page it starts as. It turns over the crease to the other side. */
  from: "left" | "right";
  /** Stacking at rest: [before the turn, after it]. */
  rest: readonly [number, number];
  /** Among pages turning at the same time, which went first (lower = first). */
  order?: number;
  front: ReactNode;
  back: ReactNode;
  /** Reduced motion: no turn, the faces cross-fade in place instead. */
  calm: boolean;
};

/**
 * One sheet of the book, printed on both sides, turning about the crease.
 *
 * The sheet darkens as it stands up off the page and lightens again as it
 * comes down, and its back is flipped so it reads correctly once turned.
 * While it moves it rides above every page at rest.
 */
export function Leaf({ angle, from, rest, order = 0, front, back, calm }: LeafProps) {
  const fromLeft = from === "left";
  const rotateY = useTransform(angle, (a) => (fromLeft ? a : -a));
  const zIndex = useTransform(angle, (a) => {
    if (a <= 0.01) return rest[0];
    if (a >= 179.99) return rest[1];
    // Standing up, the first page to go is nearest the viewer; coming down,
    // the last to go lands on top.
    return 70 + (a > 90 ? order : -order);
  });
  const frontShade = useTransform(angle, [0, 90], [0, 0.3]);
  const backShade = useTransform(angle, [90, 180], [0.3, 0]);
  // A soft highlight across the sheet as it passes upright, like light
  // catching a curve in the paper.
  const sheen = useTransform(angle, [30, 90, 150], [0, 0.16, 0]);
  const frontFade = useTransform(angle, [0, 90], [1, 0]);
  const backFade = useTransform(angle, [90, 180], [0, 1]);

  // Darker towards the crease on whichever side the face is on.
  const frontCrease = fromLeft ? "bg-gradient-to-l" : "bg-gradient-to-r";
  const backCrease = fromLeft ? "bg-gradient-to-r" : "bg-gradient-to-l";
  const startSide = fromLeft ? "left-0" : "left-1/2";
  const endSide = fromLeft ? "left-1/2" : "left-0";

  if (calm) {
    return (
      <>
        <motion.div style={{ opacity: frontFade, zIndex: rest[0] }} className={`absolute inset-y-0 w-1/2 ${startSide}`}>
          {front}
        </motion.div>
        <motion.div style={{ opacity: backFade, zIndex: rest[1] }} className={`absolute inset-y-0 w-1/2 ${endSide}`}>
          {back}
        </motion.div>
      </>
    );
  }

  return (
    <motion.div
      style={{ rotateY, zIndex, transformOrigin: fromLeft ? "100% 50%" : "0% 50%" }}
      className={`absolute inset-y-0 w-1/2 ${startSide} will-change-transform [transform-style:preserve-3d]`}
    >
      <div className="absolute inset-0 overflow-hidden [backface-visibility:hidden]">
        {front}
        <motion.div style={{ opacity: frontShade }} className={`pointer-events-none absolute inset-0 ${frontCrease} from-ink/80 to-ink/25`} />
        <motion.div style={{ opacity: sheen }} className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent" />
      </div>
      <div className="absolute inset-0 overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)]">
        {back}
        <motion.div style={{ opacity: backShade }} className={`pointer-events-none absolute inset-0 ${backCrease} from-ink/80 to-ink/25`} />
        <motion.div style={{ opacity: sheen }} className="pointer-events-none absolute inset-0 bg-gradient-to-l from-transparent via-white to-transparent" />
      </div>
    </motion.div>
  );
}
