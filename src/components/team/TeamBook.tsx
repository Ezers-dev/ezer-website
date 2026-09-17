"use client";

import { easeInOut, motion, useTransform, type MotionValue } from "motion/react";
import { BackCoverFace, DetailsFace, FrontCoverFace, PortraitFace, type BookPerson } from "./faces";
import { Leaf } from "./Leaf";
import {
  angleAt,
  CENTRE,
  CLOSE,
  OPEN,
  shadowLanding,
  shadowLeaving,
  STATEMENT,
  TURN_1,
  TURN_2,
  type Window,
} from "./timeline";

const SIZES = "(min-width: 1024px) 42vw, 90vw";

/*
 * Stacking. The book is a pile of sheets on the right that turn over, one by
 * one, onto a pile on the left: on the right the top sheet has the highest
 * index, on the left the most recently landed does. A sheet in motion rides
 * above them all (70+), with the crease and cast shadows just under it.
 */
const Z = { block: 1, shade: 65, crease: 66 } as const;

/** Every sheet, in the order it turns. */
const TURNS: readonly Window[] = [OPEN, TURN_1, TURN_2, CLOSE];

const mid = ([start, end]: Window) => (start + end) / 2;

function useAngle(progress: MotionValue<number>, window: Window) {
  return useTransform(progress, (p) => angleAt(p, window));
}

type TeamBookProps = {
  people: BookPerson[];
  crops: string[];
  /** Progress through the pinned track, 0 → 1. */
  progress: MotionValue<number>;
  /** The registration marks' rotation. */
  spin: MotionValue<number>;
  calm: boolean;
};

/**
 * The desktop book. It arrives closed, on its orange cover, and scroll turns
 * every page from right to left, as a book is read:
 *
 * - The cover opens onto Ebenezer: his portrait on the inside of the cover,
 *   his words on the page beneath.
 * - Each following page carries the next portrait on its back and uncovers
 *   the next person's words: Annie, then Muiz.
 * - Then the last page turns, carrying the back cover, and the closed book
 *   slides back to the centre.
 *
 * Written for the three people in the studio.
 */
export function TeamBook({ people, crops, progress, spin, calm }: TeamBookProps) {
  const [ebenezer, annie, muiz] = people;
  const count = people.length;

  const open = useAngle(progress, OPEN);
  const turn1 = useAngle(progress, TURN_1);
  const turn2 = useAngle(progress, TURN_2);
  const close = useAngle(progress, CLOSE);

  // Shadows cast onto the pages beneath whichever sheets are moving.
  const leftShadow = useTransform(progress, (p) => (calm ? 0 : castShadow(p, true)));
  const rightShadow = useTransform(progress, (p) => (calm ? 0 : castShadow(p, false)));

  // Closed, the book is just its right half, so it is shifted a page's width
  // to the left to sit centred. It glides to the middle as it opens, and back
  // the other way once it closes.
  const x = useTransform(progress, [OPEN[0], OPEN[1], CENTRE[0], CENTRE[1]], ["-25%", "0%", "0%", "25%"], {
    ease: easeInOut,
  });
  // The left-hand block and the crease exist only while the book is open.
  const leftBlock = useTransform(progress, [mid(OPEN), OPEN[1]], [0, 1]);
  const rightBlock = useTransform(progress, [CLOSE[0], mid(CLOSE)], [1, 0]);
  const crease = useTransform(progress, [mid(OPEN), OPEN[1], CLOSE[0], mid(CLOSE)], [0, 1, 1, 0]);
  const statement = useTransform(progress, STATEMENT, [0, 1]);

  // Sheet i (0 = the cover) rests at 50 - i on the right and 20 + i once over.
  const rest = (i: number) => [50 - i, 20 + i] as const;

  return (
    <motion.div data-team-book style={{ x }} className="relative aspect-[8/5] w-[min(100cqw,160cqh)] [perspective:2800px]">
      {/* The page blocks: paper, a hint of thickness at the outer edges. */}
      <motion.div
        style={{ zIndex: Z.block, opacity: leftBlock }}
        className="absolute inset-y-0 left-0 w-1/2 bg-paper shadow-[-1px_1px_0_#e4e1da,-2px_2px_0_#f6f5f2,-3px_3px_0_#dedad2,-4px_4px_0_#f1efe9,0_40px_70px_-40px_rgb(11_16_19/0.4)]"
      />
      <motion.div
        style={{ zIndex: Z.block, opacity: rightBlock }}
        className="absolute inset-y-0 left-1/2 w-1/2 bg-paper shadow-[1px_1px_0_#e4e1da,2px_2px_0_#f6f5f2,3px_3px_0_#dedad2,4px_4px_0_#f1efe9,0_40px_70px_-40px_rgb(11_16_19/0.4)]"
      />

      <Leaf
        angle={open}
        rest={rest(0)}
        calm={calm}
        front={<FrontCoverFace />}
        back={<PortraitFace person={ebenezer} index={0} crop={crops[0]} sizes={SIZES} />}
      />
      <Leaf
        angle={turn1}
        rest={rest(1)}
        calm={calm}
        front={<DetailsFace person={ebenezer} index={0} count={count} spin={spin} />}
        back={<PortraitFace person={annie} index={1} crop={crops[1]} sizes={SIZES} />}
      />
      <Leaf
        angle={turn2}
        rest={rest(2)}
        calm={calm}
        front={<DetailsFace person={annie} index={1} count={count} spin={spin} />}
        back={<PortraitFace person={muiz} index={2} crop={crops[2]} sizes={SIZES} />}
      />

      {/* The last page carries the back cover, and closes the book. */}
      <Leaf
        angle={close}
        rest={rest(3)}
        calm={calm}
        front={<DetailsFace person={muiz} index={2} count={count} spin={spin} />}
        back={<BackCoverFace reveal={statement} />}
      />

      {/* Cast shadows, from the crease outwards. */}
      <motion.div
        style={{ zIndex: Z.shade, opacity: leftShadow }}
        className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-l from-ink via-ink/40 to-transparent"
      />
      <motion.div
        style={{ zIndex: Z.shade, opacity: rightShadow }}
        className="pointer-events-none absolute inset-y-0 left-1/2 w-1/2 bg-gradient-to-r from-ink via-ink/40 to-transparent"
      />

      {/* The crease: still, and barely there. */}
      <motion.div
        style={{ zIndex: Z.crease, opacity: crease }}
        className="pointer-events-none absolute inset-y-0 left-1/2 w-[9%] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgb(11_16_19/0.07)_42%,rgb(11_16_19/0.14)_50%,rgb(11_16_19/0.05)_58%,transparent)]"
      />
    </motion.div>
  );
}

/** The shadow on one side of the book at progress `p`. Every sheet starts on the right. */
function castShadow(p: number, onLeft: boolean) {
  let total = 0;
  for (const window of TURNS) {
    const a = angleAt(p, window);
    total += onLeft ? shadowLanding(a) : shadowLeaving(a);
  }
  return Math.min(total, 0.35);
}
