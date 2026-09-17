"use client";

import type { ReactNode } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import { BackCoverFace, DetailsFace, FrontCoverFace, PortraitFace, type BookPerson } from "./faces";
import { OPEN, STATEMENT, through, TURN_1, TURN_2, type Window } from "./timeline";

const SIZES = "(min-width: 1024px) 42vw, 90vw";
/** The cover, then each portrait but the last, flip away in turn. */
const FLIPS: readonly Window[] = [OPEN, TURN_1, TURN_2];
/** On small screens the back cover drops over the last plate. */
const CLOSING: Window = [0.8, 0.88];
const NEVER: Window = [2, 3];

type FlipProps = {
  window: Window;
  z: number;
  progress: MotionValue<number>;
  calm: boolean;
  children: ReactNode;
};

/** A page that flips up and away over its top edge. */
function Flip({ window, z, progress, calm, children }: FlipProps) {
  const turn = useTransform(progress, (p) => through(p, window));
  const rotateX = useTransform(turn, [0, 1], [0, calm ? 0 : 100]);
  const opacity = useTransform(turn, calm ? [0, 1] : [0.8, 0.9], [1, 0]);
  const shade = useTransform(turn, [0, 0.85], [0, calm ? 0 : 0.35]);

  return (
    <motion.div
      style={{ rotateX, opacity, zIndex: z, transformOrigin: "50% 0%" }}
      className="absolute inset-0 shadow-[0_24px_50px_-30px_rgb(11_16_19/0.4)] will-change-transform"
    >
      {children}
      <motion.div style={{ opacity: shade }} className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 to-ink/20" />
    </motion.div>
  );
}

type WordsProps = {
  person: BookPerson;
  index: number;
  count: number;
  progress: MotionValue<number>;
  spin: MotionValue<number>;
};

/**
 * The person's words. They arrive over the second half of the flip that
 * uncovers their portrait and leave over the first half of the next.
 */
function Words({ person, index, count, progress, spin }: WordsProps) {
  const [inStart, inEnd] = FLIPS[index];
  const [outStart, outEnd] = index < count - 1 ? FLIPS[index + 1] : CLOSING;
  const input = [(inStart + inEnd) / 2, inEnd, outStart, (outStart + outEnd) / 2];

  const fade = useTransform(progress, input, [0, 1, 1, 0]);
  const rise = useTransform(progress, input, [28, 0, 0, -28]);

  return (
    <motion.div style={{ opacity: fade, y: rise }} className="[grid-area:stack]">
      <DetailsFace person={person} index={index} count={count} spin={spin} bare />
    </motion.div>
  );
}

type TeamFlipProps = {
  people: BookPerson[];
  crops: string[];
  progress: MotionValue<number>;
  spin: MotionValue<number>;
  calm: boolean;
};

/**
 * Phones and tablets: the book stood on end. It opens on its cover; the cover
 * and then each plate flip up over the top edge to uncover the next person,
 * with their words below, and at the end the back cover comes down.
 */
export function TeamFlip({ people, crops, progress, spin, calm }: TeamFlipProps) {
  const count = people.length;
  const closing = useTransform(progress, (p) => through(p, CLOSING));
  const coverTilt = useTransform(closing, [0, 1], [calm ? 0 : -100, 0]);
  const coverOpacity = useTransform(closing, calm ? [0, 1] : [0.08, 0.2], [0, 1]);
  const statement = useTransform(progress, STATEMENT, [0, 1]);

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="relative aspect-[4/5] w-[min(100%,calc((100cqh-15rem)*0.8))] shrink-0 [perspective:1400px]">
        {people.map((person, index) => (
          <Flip key={person.name} window={FLIPS[index + 1] ?? NEVER} z={count - index} progress={progress} calm={calm}>
            <PortraitFace person={person} index={index} crop={crops[index % crops.length]} sizes={SIZES} />
          </Flip>
        ))}
        <Flip window={OPEN} z={count + 1} progress={progress} calm={calm}>
          <FrontCoverFace />
        </Flip>
        <motion.div
          style={{ rotateX: coverTilt, opacity: coverOpacity, zIndex: count + 2, transformOrigin: "50% 0%" }}
          className="absolute inset-0 will-change-transform [backface-visibility:hidden]"
        >
          <BackCoverFace reveal={statement} />
        </motion.div>
      </div>

      {/* The words, set straight on the page beneath. Held at a fixed height so
          the plate above doesn't move as they change. */}
      <div className="mt-4 grid h-[13rem] w-full max-w-[34rem] [grid-template-areas:'stack']">
        {people.map((person, index) => (
          <Words key={person.name} person={person} index={index} count={count} progress={progress} spin={spin} />
        ))}
      </div>
    </div>
  );
}
