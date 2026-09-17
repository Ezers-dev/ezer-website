"use client";

import { useEffect, useState, type RefObject } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import { offsetWithin, type Point } from "@/lib/offset";
import { RING, SEEN_BLUE } from "./BouncingHeadline";

type Geometry = {
  left: number;
  top: number;
  width: number;
  height: number;
  line: string;
  arrow: string;
};

type OriginLinkProps = {
  /** 0 → 1 as the visitor scrolls from the opening down to the heading. */
  progress: MotionValue<number>;
  /** The positioned section both ends live in; the line is drawn in its space. */
  sectionRef: RefObject<HTMLElement | null>;
  /** The pinned opening's scroll track, and the sticky screen inside it. */
  trackRef: RefObject<HTMLDivElement | null>;
  stageRef: RefObject<HTMLDivElement | null>;
  /** The word the arrow points at. */
  targetRef: RefObject<HTMLElement | null>;
};

const round = (value: number) => Math.round(value * 10) / 10;

/**
 * A blue line that carries on from the circle around "seen.", sweeps down
 * the page and ends in an arrow pointing at "Origin".
 *
 * The line only draws once the opening has let go of the screen, and from
 * then on both ends sit still relative to the section — so it is measured
 * once in section space (and again on resize) rather than every frame.
 * Offsets are used throughout because they ignore the words' transforms.
 */
export function OriginLink({ progress, sectionRef, trackRef, stageRef, targetRef }: OriginLinkProps) {
  const [geometry, setGeometry] = useState<Geometry | null>(null);

  const draw = useTransform(progress, [0, 0.9], [0, 1]);
  // Hidden while nothing is drawn, so the round cap doesn't leave a dot.
  const lineOpacity = useTransform(progress, [0, 0.02], [0, 1]);
  const arrowOpacity = useTransform(progress, [0.86, 0.96], [0, 1]);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const stage = stageRef.current;
    const target = targetRef.current;
    if (!section || !track || !stage || !target) return;

    const measure = () => {
      const seen = stage.querySelector<HTMLElement>("[data-seen]");
      if (!seen) return;

      // Where the sticky screen rests once the opening has finished pinning.
      // The stage's own offset can't be used: being sticky, it reports wherever
      // it is stuck right now.
      const trackAt = offsetWithin(track, section);
      const stageTop = trackAt.y + track.offsetHeight - stage.offsetHeight;
      const seenAt = offsetWithin(seen, stage);

      // Pick up exactly where the ring's pen stopped: its end point, mapped
      // from the ring's box (which overhangs the word) onto the page.
      const ringLeft = -RING.inset.x * seen.offsetWidth;
      const ringTop = -RING.inset.y * seen.offsetHeight;
      const perUnitX = (seen.offsetWidth * (1 + 2 * RING.inset.x)) / RING.box.width;
      const perUnitY = (seen.offsetHeight * (1 + 2 * RING.inset.y)) / RING.box.height;
      const start: Point = {
        x: trackAt.x + seenAt.x + ringLeft + RING.end.x * perUnitX,
        y: stageTop + seenAt.y + ringTop + RING.end.y * perUnitY,
      };
      // ...and carry on in the direction it was travelling.
      const headX = RING.heading.x * perUnitX;
      const headY = RING.heading.y * perUnitY;
      const headLength = Math.hypot(headX, headY);
      // Arrive just right of "Origin", level with the middle of the letters.
      const targetAt = offsetWithin(target, section);
      const end: Point = {
        x: targetAt.x + target.offsetWidth + 18,
        y: targetAt.y + target.offsetHeight * 0.55,
      };

      const across = start.x - end.x;
      const down = end.y - start.y;
      // Leave along the ring's own heading (so there is no kink where the two
      // meet), then come in level from the right, so the arrow points
      // straight at the word.
      const reach = down * 0.55;
      const c1: Point = {
        x: start.x + (headX / headLength) * reach,
        y: start.y + (headY / headLength) * reach,
      };
      const c2: Point = { x: end.x + Math.max(140, across * 0.45), y: end.y };

      const pad = 24;
      const left = Math.min(start.x, end.x, c1.x, c2.x) - pad;
      const top = Math.min(start.y, end.y) - pad;
      const right = Math.max(start.x, c1.x, c2.x) + pad;
      const bottom = Math.max(start.y, end.y, c1.y, c2.y) + pad;

      const local = (p: Point) => `${round(p.x - left)} ${round(p.y - top)}`;
      const tip = { x: end.x - left, y: end.y - top };

      setGeometry({
        left,
        top,
        width: right - left,
        height: bottom - top,
        line: `M${local(start)} C${local(c1)} ${local(c2)} ${local(end)}`,
        arrow: `M${round(tip.x + 15)} ${round(tip.y - 10)} L${round(tip.x)} ${round(tip.y)} L${round(tip.x + 15)} ${round(tip.y + 10)}`,
      });
    };

    let frame = requestAnimationFrame(measure);
    // Webfonts change word widths; measure again once they are in.
    document.fonts?.ready.then(() => {
      frame = requestAnimationFrame(measure);
    });
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    });
    observer.observe(section);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [sectionRef, trackRef, stageRef, targetRef]);

  if (!geometry) return null;

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${geometry.width} ${geometry.height}`}
      width={geometry.width}
      height={geometry.height}
      className="pointer-events-none absolute z-20 overflow-visible"
      style={{ left: geometry.left, top: geometry.top }}
    >
      <motion.path
        d={geometry.line}
        fill="none"
        stroke={SEEN_BLUE}
        strokeWidth={2.2}
        strokeLinecap="round"
        style={{ pathLength: draw, opacity: lineOpacity }}
      />
      <motion.path
        d={geometry.arrow}
        fill="none"
        stroke={SEEN_BLUE}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ opacity: arrowOpacity }}
      />
    </svg>
  );
}
