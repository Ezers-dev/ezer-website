"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useReducedMotion,
} from "motion/react";

type MarqueeProps = {
  children: ReactNode;
  /** Base pixels per second. Negative runs right-to-left. */
  speed?: number;
  className?: string;
};

/**
 * Infinite ticker that also responds to scroll velocity, so the rows
 * lean into the direction the page is moving.
 */
export function Marquee({ children, speed = 40, className }: MarqueeProps) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 300,
  });
  const velocityFactor = useTransform(smoothVelocity, [-1500, 1500], [-4, 4], {
    clamp: false,
  });

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    const track = trackRef.current;
    if (!track) return;

    // The content is duplicated once, so one half is a full loop.
    const loop = track.scrollWidth / 2;
    if (!loop) return;

    const move = (speed * delta) / 1000 + velocityFactor.get();
    let next = x.get() - move;

    if (next <= -loop) next += loop;
    if (next > 0) next -= loop;
    x.set(next);
  });

  return (
    <div className={`overflow-hidden ${className ?? ""}`}>
      <motion.div
        ref={trackRef}
        style={reduced ? undefined : { x }}
        className="flex w-max will-change-transform"
        aria-hidden={false}
      >
        {children}
        <span aria-hidden className="flex">
          {children}
        </span>
      </motion.div>
    </div>
  );
}
