"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { useCalmMotion } from "@/lib/useCalmMotion";

/*
 * The mark's three states, in its own 32×32 box. It starts as a small plain
 * square (direction), grows into a larger, firmer square (structure), then
 * resolves into a pill — the shape of the Ezers logo — (craft). Only size and
 * corner radius change, so every state is the same element.
 */
const STATES = [
  { width: 7, height: 7, rx: 0 },
  { width: 13, height: 13, rx: 1.5 },
  { width: 26, height: 9, rx: 4.5 },
];

/** Seconds for one pass across the team. Slow enough to go unnoticed at first. */
const PASS = 22;

type DriftMarkProps = {
  /** Horizontal across the portraits on desktop; vertical down the list on phones. */
  direction: "horizontal" | "vertical";
  className?: string;
};

/**
 * A single quiet mark that drifts through the team section and changes shape
 * as it passes each person. Purely atmospheric: hidden from assistive tech,
 * never over a face, not rendered at all when motion is reduced, and it only
 * starts once the portraits have finished arriving.
 */
export function DriftMark({ direction, className = "" }: DriftMarkProps) {
  const calm = useCalmMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const inView = useInView(trackRef, { once: true, margin: "-10% 0px" });
  const [length, setLength] = useState(0);
  const horizontal = direction === "horizontal";

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setLength(horizontal ? track.clientWidth : track.clientHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [horizontal]);

  const run = inView && length > 0 && !calm;
  // Enter just outside the track, pass each person's column, exit the far end.
  // Column centres sit at 1/6, 3/6 and 5/6 of the track.
  const travel = [-32, length / 6, length / 2, (length * 5) / 6, length + 32];
  const times = [0, 0.2, 0.5, 0.8, 1];
  const shape = (key: "width" | "height" | "rx") => [
    STATES[0][key],
    STATES[0][key],
    STATES[1][key],
    STATES[2][key],
    STATES[2][key],
  ];

  return (
    <div
      ref={trackRef}
      aria-hidden
      className={`pointer-events-none relative overflow-hidden ${className}`}
    >
      {run && (
        <motion.svg
          width={32}
          height={32}
          viewBox="0 0 32 32"
          className={`absolute ${horizontal ? "left-0 top-1/2 -mt-4" : "left-1/2 top-0 -ml-4"}`}
          initial={{ opacity: 0 }}
          animate={{
            [horizontal ? "x" : "y"]: travel,
            opacity: [0, 1, 1, 1, 0],
          }}
          transition={{
            duration: PASS,
            times,
            ease: "linear",
            repeat: Infinity,
            // Settles in only after the portraits have arrived.
            delay: 1.8,
          }}
        >
          <motion.rect
            className="fill-ink/25"
            width={STATES[0].width}
            height={STATES[0].height}
            rx={STATES[0].rx}
            initial={{
              width: STATES[0].width,
              height: STATES[0].height,
              rx: STATES[0].rx,
              x: 16 - STATES[0].width / 2,
              y: 16 - STATES[0].height / 2,
            }}
            animate={{
              width: shape("width"),
              height: shape("height"),
              rx: shape("rx"),
              x: shape("width").map((w) => 16 - w / 2),
              y: shape("height").map((h) => 16 - h / 2),
            }}
            transition={{ duration: PASS, times, ease: "easeInOut", repeat: Infinity, delay: 1.8 }}
          />
        </motion.svg>
      )}
    </div>
  );
}
