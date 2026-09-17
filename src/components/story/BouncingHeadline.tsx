"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  easeInOut,
  motion,
  useInView,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useCalmMotion } from "@/lib/useCalmMotion";

/*
 * One brand colour per word, in the tones this project uses for text on
 * paper: the pure orange, green and yellow are too light to read at any
 * size, so each word takes the readable version of its brand colour.
 */
const WORD_COLOURS = [
  "#0071b0", // blue
  "#d6004a", // pink
  "#5e9234", // green
  "#c2521a", // orange
  "#9a7400", // yellow
  "#0071b0", // blue again for the last word, which stays blue and keeps the circle
];

/** The words' own colour, before the ball touches them and after scrolling on. */
const INK = "#0b1013";

/**
 * "seen." is always this blue, circle and all, whatever the scroll or the
 * ball is doing: it is the word the whole statement lands on.
 */
export const SEEN_BLUE = "#0071b0";

/*
 * The hand-drawn ring around "seen.", in a 220×100 box that overhangs the
 * word by 14% each side and 10% top and bottom. It goes once round, overlaps
 * past its start the way a pen does, and finishes on the right-hand side
 * travelling downward — so the line that later runs down to "Origin" can
 * pick up exactly where the pen left off.
 */
export const RING = {
  path: "M70 20 C 130 4, 200 10, 212 42 C 222 72, 170 94, 110 94 C 50 94, 10 76, 16 50 C 22 22, 90 8, 150 12 C 190 16, 214 36, 206 70",
  box: { width: 220, height: 100 },
  inset: { x: 0.14, y: 0.1 },
  /** Where the pen stops, and the direction it was travelling. */
  end: { x: 206, y: 70 },
  heading: { x: -8, y: 34 },
} as const;

/** Drop between one step and the next, in ems of the headline size. */
const STEP = 0.62;

const BALL = 22;

/*
 * Scroll progress through the pinned opening (0 → 1). The steps close into a
 * line over the first half, and the colours fade back to ink a little behind
 * them, so the last thing to settle is the colour.
 */
const ALIGN: [number, number] = [0.05, 0.5];
const FADE: [number, number] = [0.1, 0.55];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type WordProps = {
  word: string;
  index: number;
  count: number;
  progress: MotionValue<number>;
  lit: boolean;
  shown: boolean;
  calm: boolean;
  setRef: (el: HTMLSpanElement | null) => void;
};

function Word({ word, index, count, progress, lit, shown, calm, setRef }: WordProps) {
  // Staircase: the first word highest, the last lowest, centred on the line.
  const offset = (index - (count - 1) / 2) * STEP;
  const y = useTransform(progress, ALIGN, [`${offset}em`, "0em"], { ease: easeInOut });
  const colour = useTransform(progress, FADE, [WORD_COLOURS[index % WORD_COLOURS.length], INK]);
  const last = index === count - 1;

  return (
    <motion.span
      ref={setRef}
      initial={false}
      animate={{ opacity: shown ? 1 : 0 }}
      transition={{ duration: calm ? 0 : 0.45, delay: calm ? 0 : index * 0.09, ease: "easeOut" }}
      // Until the ball lands here the word keeps its own colour; after that
      // the colour is scrubbed by scroll, back to ink and out again. The last
      // word is the exception: it stays blue throughout.
      style={{ y, color: last ? SEEN_BLUE : lit ? colour : undefined }}
      // Marks the last word so the line out of its circle can find it.
      data-seen={last || undefined}
      className="relative inline-block will-change-transform"
    >
      {word}
      {last && (
        // The hand-drawn ring, sketched once the ball lands here, stroked in
        // the word's blue.
        <svg
          aria-hidden
          viewBox="0 0 220 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute -inset-x-[14%] -inset-y-[10%] h-[120%] w-[128%] overflow-visible"
        >
          <motion.path
            d={RING.path}
            className="fill-none stroke-current"
            strokeWidth={2.2}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: lit ? 1 : 0 }}
            transition={{ duration: calm ? 0 : 1.1, ease: [0.65, 0, 0.35, 1] }}
          />
        </svg>
      )}
    </motion.span>
  );
}

type BouncingHeadlineProps = {
  words: string[];
  /** Scroll progress through the pinned opening, 0 → 1. */
  progress: MotionValue<number>;
  className?: string;
};

/**
 * The section's statement. On arrival the words step in as a staircase and a
 * ball bounces down it, lighting each word in a brand colour as it lands.
 * Scrolling on closes the steps into one centred line and fades the colours
 * back to ink; scrolling back reverses both.
 *
 * With reduced motion the ball never appears, and the line simply follows the
 * progress it is given.
 */
export function BouncingHeadline({ words, progress, className = "" }: BouncingHeadlineProps) {
  const calm = useCalmMotion();
  const holderRef = useRef<HTMLHeadingElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const inView = useInView(holderRef, { once: true, margin: "-25% 0px" });
  const [lit, setLit] = useState(-1);
  const [ballOn, setBallOn] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scaleX = useMotionValue(1);
  const scaleY = useMotionValue(1);
  const opacity = useMotionValue(0);

  const shown = calm || inView;

  useEffect(() => {
    if (calm) {
      const frame = requestAnimationFrame(() => setLit(words.length - 1));
      return () => cancelAnimationFrame(frame);
    }
    if (!inView) return;

    let cancelled = false;

    // Where the ball rests on top of word `i`, measured fresh each hop: the
    // words may already be moving if the visitor keeps scrolling.
    const spotFor = (i: number) => {
      const holder = holderRef.current!;
      const base = holder.getBoundingClientRect();
      const r = wordRefs.current[i]!.getBoundingClientRect();
      return { x: r.left - base.left + r.width / 2 - BALL / 2, y: r.top - base.top - BALL };
    };

    const run = async () => {
      // Fonts settle the line; the words step in before the first bounce.
      await document.fonts?.ready;
      await sleep(words.length * 90 + 350);
      if (cancelled || !holderRef.current) return;

      const first = spotFor(0);
      x.set(first.x - 140);
      y.set(first.y - 240);
      opacity.set(1);
      setBallOn(true);

      for (let i = 0; i < words.length; i++) {
        if (cancelled) return;
        const from = { x: x.get(), y: y.get() };
        const to = spotFor(i);
        const rise = Math.min(170, Math.max(70, Math.abs(to.x - from.x) * 0.5));
        const hop = 0.44;

        await Promise.all([
          animate(x, to.x, { duration: hop, ease: "linear" }).finished,
          animate(y, [from.y, Math.min(from.y, to.y) - rise, to.y], {
            duration: hop,
            times: [0, 0.42, 1],
            // Slowing into the apex, then gathering speed into the landing.
            ease: ["easeOut", "easeIn"],
          }).finished,
        ]);
        if (cancelled) return;

        setLit(i);
        // A short squash on impact, then back to round.
        animate(scaleY, [1, 0.72, 1], { duration: 0.26, times: [0, 0.25, 1], ease: "easeOut" });
        animate(scaleX, [1, 1.22, 1], { duration: 0.26, times: [0, 0.25, 1], ease: "easeOut" });
      }

      if (cancelled) return;
      // Off the bottom step, and gone.
      const end = { x: x.get(), y: y.get() };
      await Promise.all([
        animate(x, end.x + 220, { duration: 0.7, ease: "linear" }).finished,
        animate(y, [end.y, end.y - 130, end.y + 280], { duration: 0.7, times: [0, 0.4, 1], ease: ["easeOut", "easeIn"] }).finished,
        animate(opacity, 0, { duration: 0.7, ease: "easeIn" }).finished,
      ]);
      if (!cancelled) setBallOn(false);
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [calm, inView, words.length, x, y, scaleX, scaleY, opacity]);

  return (
    <h2 ref={holderRef} className={`relative ${className}`}>
      {words.map((word, index) => (
        <span key={word + index}>
          <Word
            word={word}
            index={index}
            count={words.length}
            progress={progress}
            lit={index <= lit}
            shown={shown}
            calm={calm}
            setRef={(el) => {
              wordRefs.current[index] = el;
            }}
          />
          {index < words.length - 1 && " "}
        </span>
      ))}

      {ballOn && (
        <motion.span
          aria-hidden
          style={{ x, y, scaleX, scaleY, opacity, width: BALL, height: BALL }}
          className="pill absolute left-0 top-0 block origin-bottom will-change-transform"
          // The ball carries the colour it is about to leave behind.
          animate={{ backgroundColor: WORD_COLOURS[Math.min(lit + 1, WORD_COLOURS.length - 1)] }}
          transition={{ duration: 0.3 }}
        />
      )}
    </h2>
  );
}
