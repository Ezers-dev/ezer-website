"use client";

import type { ReactNode } from "react";
import { motion, type Variants } from "motion/react";
import { easeInOutQuart } from "@/lib/motion";

/**
 * Rope tucked above the viewport, so a drop or bounce never shows its end.
 * The pivot for the swing sits at the bottom of this hidden stretch, which
 * is the top edge of the screen, right under the nav bar.
 */
const OVERHANG = 700;

type Rope = {
  word: string;
  rope: "rope-jute" | "rope-cord" | "rope-heavy";
  sign: string;
  /** Horizontal anchor within the hero's content width. */
  anchor: string;
  /** Visible rope length from the top of the screen, set as --len. */
  length: string;
  /** Desktop length in px, which sets how slowly this rope swings. */
  swingLength: number;
  /** Sideways kick on landing, in degrees. Alternating sides feels natural. */
  kick: number;
};

/*
 * Lengths step down left to right — Look highest, Move lowest — so the
 * signs read as a staircase and the note under Move has open space beside
 * it. Move's length lives in --move-len on the layer, because the note is
 * positioned from it too. On desktop the note sits in the hero's content row
 * instead, so the hero measures that row and publishes its offset as
 * --note-top; Move's rope is sized to end just above it.
 */
const ropes: Rope[] = [
  {
    word: "Look",
    rope: "rope-jute",
    sign: "bg-blue-deep text-paper",
    anchor: "left-[22%] lg:left-[70%]",
    length: "[--len:100px] max-lg:[@media(max-height:700px)]:[--len:92px] lg:[--len:calc(var(--move-len)*0.36)]",
    swingLength: 250,
    kick: 6,
  },
  {
    word: "Sound",
    rope: "rope-cord",
    sign: "bg-pink-deep text-paper",
    anchor: "left-[52%] lg:left-[83%]",
    length: "[--len:146px] max-lg:[@media(max-height:700px)]:[--len:112px] lg:[--len:calc(var(--move-len)*0.66)]",
    swingLength: 370,
    kick: -5,
  },
  {
    word: "Move",
    rope: "rope-heavy",
    sign: "bg-green text-ink",
    anchor: "left-[81%] lg:left-[93%]",
    length: "[--len:var(--move-len)]",
    swingLength: 500,
    kick: 7,
  },
];

function dropVariants(rope: Rope): Variants {
  // A pendulum swings slower the longer it is: stiffness falls with length.
  const swingStiffness = 9000 / rope.swingLength;

  return {
    up: {
      y: "-100%",
      rotate: rope.kick,
      transition: {
        y: { duration: 0.55, ease: easeInOutQuart },
        rotate: { duration: 0 },
      },
    },
    down: {
      y: "0%",
      rotate: 0,
      transition: {
        // Heavy drop that overshoots and settles, as if the rope took the
        // sign's weight and stretched a touch.
        y: { type: "spring", stiffness: 115, damping: 13, mass: 1.15 },
        // Released with a sideways kick, then left to swing out.
        rotate: { type: "spring", stiffness: swingStiffness, damping: 2.6, mass: 1 },
      },
    },
  };
}

function signVariants(rope: Rope): Variants {
  return {
    up: { rotate: -rope.kick * 0.9, transition: { duration: 0 } },
    down: {
      rotate: 0,
      // The sign hangs from a single eyelet, so it lags the rope and swings
      // back against it before both settle.
      transition: { type: "spring", stiffness: 70, damping: 4.5, mass: 0.8, delay: 0.12 },
    },
  };
}

/**
 * Three signs lowered on three different ropes from under the nav bar, one
 * per step. `step` counts how many are down (0–3); raising it drops the next
 * one, lowering it hauls the last one back up. `note` is placed just under
 * the last sign below desktop widths.
 *
 * The ropes and signs are hidden from assistive tech and ignore the pointer;
 * whatever is passed as `note` carries the message in text. Reduced motion
 * is handled globally by MotionConfig, which turns the drops and swings into
 * instant state changes.
 */
export function HangingWords({ step, note }: { step: number; note?: ReactNode }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="relative mx-auto h-full w-full max-w-[1560px] px-5 sm:px-8 lg:px-12">
        <div className="relative h-full [--move-len:196px] [--note-gap:62px] max-lg:[@media(max-height:700px)]:[--move-len:132px] sm:[--note-gap:70px] lg:[--move-len:calc(var(--note-top,60svh)-92px)]">
          {ropes.map((rope, index) => {
            const down = step > index;
            return (
              <div
                key={rope.word}
                aria-hidden
                className={`absolute top-0 w-0 ${rope.anchor} ${rope.length}`}
              >
                <motion.div
                  initial="up"
                  animate={down ? "down" : "up"}
                  variants={dropVariants(rope)}
                  style={{ top: -OVERHANG, transformOrigin: `50% ${OVERHANG}px` }}
                  className="absolute left-0 flex -translate-x-1/2 flex-col items-center"
                >
                  {/* Idle drift once it has settled, a different tempo per
                      rope so the three never sway in step. */}
                  <motion.div
                    animate={down ? { rotate: [-0.7, 0.7] } : { rotate: 0 }}
                    transition={
                      down
                        ? {
                            duration: 2.6 + index * 0.55,
                            repeat: Infinity,
                            repeatType: "mirror",
                            ease: "easeInOut",
                            delay: 1.6,
                          }
                        : { duration: 0.3 }
                    }
                    style={{ transformOrigin: `50% ${OVERHANG}px` }}
                    className="flex flex-col items-center"
                  >
                    <span
                      className={`rope ${rope.rope} block`}
                      style={{ height: `calc(${OVERHANG}px + var(--len))` }}
                    />

                    <motion.div
                      variants={signVariants(rope)}
                      style={{ transformOrigin: "50% 0" }}
                      className="relative -mt-2 flex flex-col items-center"
                    >
                      {/* Where the rope meets the sign: a bound knot over a
                          metal eyelet. */}
                      <span
                        className={`rope ${rope.rope} relative z-20 -mb-3 block h-4 !w-3.5`}
                      />
                      <span
                        className={`pill relative flex items-center px-4 pb-2 pt-4 text-[1.2rem] font-extrabold leading-none tracking-[-0.03em] shadow-[0_16px_28px_-14px_rgb(11_16_19_/_0.45)] sm:text-[1.5rem] lg:px-7 lg:pb-3.5 lg:pt-6 lg:text-[2.25rem] ${rope.sign}`}
                      >
                        <span className="absolute left-1/2 top-1.5 z-10 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-ink/55 ring-2 ring-paper/70 lg:top-2 lg:h-3 lg:w-3" />
                        {rope.word}
                      </span>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>
            );
          })}

          {note && (
            <div className="absolute inset-x-0 top-[calc(var(--move-len)+var(--note-gap))] flex justify-end lg:hidden">
              {note}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
