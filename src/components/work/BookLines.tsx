"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import type { MarkColour } from "@/data/clients";
import { offsetWithin, type Point } from "@/lib/offset";
import { useCalmMotion } from "@/lib/useCalmMotion";

/** The readable tone of each brand colour, as used for text on paper. */
export const MARK_HEX: Record<MarkColour, string> = {
  pink: "#d6004a",
  green: "#5e9234",
  blue: "#0071b0",
  // The book cover's own orange, so the line and word match it.
  orange: "#f96b2a",
};

/**
 * Where each side's lines leave the book, as a share of its height. The line
 * to the higher word leaves lower down and swings less; the one to the lower
 * word leaves higher and swings wider, so each pair nests without crossing.
 */
const EXITS = [0.66, 0.34];
/** When each line starts and finishes drawing, as a share of the scroll between. */
const DRAW: [number, number][] = [
  [0, 0.78],
  [0.08, 0.86],
  [0.04, 0.82],
  [0.12, 0.9],
];
const round = (value: number) => Math.round(value * 10) / 10;

type Line = { d: string; arrow: string; colour: MarkColour };
type Geometry = { left: number; top: number; width: number; height: number; lines: Line[] };

/**
 * Four lines from the closed team book into the Our Work headline: two leave
 * its left side for the marked words on the left of the headline, two leave
 * its right side for those on the right. They draw as the visitor scrolls
 * from the book down to the headline, each in the colour of the word it lands
 * on, and each word takes that colour as its line arrives.
 *
 * Desktop only, where the book is. Placed in a positioned wrapper around both
 * sections; everything is measured in that wrapper's space, from offsets, so
 * the words' and book's transforms don't throw it out.
 */
export function BookLines() {
  const calm = useCalmMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const [geometry, setGeometry] = useState<Geometry | null>(null);
  const range = useRef<[number, number]>([0, 1]);
  const marksRef = useRef<HTMLElement[]>([]);

  const { scrollY } = useScroll();
  const progress = useTransform(scrollY, (y) => {
    if (calm) return 1;
    const [start, end] = range.current;
    return Math.min(1, Math.max(0, (y - start) / (end - start)));
  });

  useEffect(() => {
    const wrapper = svgRef.current?.parentElement;
    if (!wrapper) return;

    const measure = () => {
      const track = wrapper.querySelector<HTMLElement>("[data-team-track]");
      const stage = wrapper.querySelector<HTMLElement>("[data-team-stage]");
      const book = wrapper.querySelector<HTMLElement>("[data-team-book]");
      const marks = [...wrapper.querySelectorAll<HTMLElement>("[data-mark]")];
      marksRef.current = marks;
      // No book on this screen: no lines, and the words keep their own colours.
      if (!track || !stage || !book || !book.offsetParent || marks.length === 0) {
        marks.forEach((mark) => (mark.style.color = ""));
        setGeometry(null);
        return;
      }

      // Where the pinned screen rests once the book is done (a sticky element
      // reports wherever it is stuck, so this is worked out from the track).
      const trackAt = offsetWithin(track, wrapper);
      const stageTop = trackAt.y + track.offsetHeight - stage.offsetHeight;
      const stageLeft = offsetWithin(stage, wrapper).x;
      const bookAt = offsetWithin(book, stage);
      // Closed, the book is one page wide and centred: the middle half.
      const bookLeft = stageLeft + bookAt.x + book.offsetWidth * 0.25;
      const bookRight = stageLeft + bookAt.x + book.offsetWidth * 0.75;
      const bookTop = stageTop + bookAt.y;

      const edge = 16;
      const sides = { left: 0, right: 0 };
      const curves: { start: Point; end: Point; c1: Point; c2: Point; dir: number; colour: MarkColour }[] = [];

      for (const mark of marks) {
        const side = mark.dataset.side === "right" ? "right" : "left";
        const order = sides[side]++;
        const dir = side === "left" ? -1 : 1;
        const at = offsetWithin(mark, wrapper);

        const start: Point = {
          x: side === "left" ? bookLeft : bookRight,
          y: bookTop + book.offsetHeight * EXITS[order % EXITS.length],
        };
        // Arrive level with the word, from outside it, just short of it.
        const end: Point = {
          x: side === "left" ? at.x - 18 : at.x + mark.offsetWidth + 18,
          y: at.y + mark.offsetHeight * 0.55,
        };
        // Out of the book sideways, round, and in towards the word.
        const swing = 130 + order * 150;
        const clampX = (x: number) => Math.min(wrapper.offsetWidth - edge, Math.max(edge, x));
        const c1: Point = { x: clampX(start.x + dir * swing), y: start.y + 60 };
        const c2: Point = { x: clampX(end.x + dir * (swing + 60)), y: end.y };

        curves.push({ start, end, c1, c2, dir, colour: mark.dataset.mark as MarkColour });
      }

      const points = curves.flatMap(({ start, end, c1, c2 }) => [start, end, c1, c2]);
      const pad = 24;
      const left = Math.min(...points.map((p) => p.x)) - pad;
      const top = Math.min(...points.map((p) => p.y)) - pad;
      const right = Math.max(...points.map((p) => p.x)) + pad;
      const bottom = Math.max(...points.map((p) => p.y)) + pad;
      const local = (p: Point) => `${round(p.x - left)} ${round(p.y - top)}`;

      const lines = curves.map(({ start, end, c1, c2, dir, colour }): Line => {
        // The head points the way the line is travelling: towards the word.
        const tip = { x: end.x - left, y: end.y - top };
        const back = tip.x + dir * 13;
        return {
          d: `M${local(start)} C${local(c1)} ${local(c2)} ${local(end)}`,
          arrow: `M${round(back)} ${round(tip.y - 8)} L${round(tip.x)} ${round(tip.y)} L${round(back)} ${round(tip.y + 8)}`,
          colour,
        };
      });

      // Drawing runs from the moment the book lets go of the screen until the
      // headline is a little above the middle of it.
      const vh = window.innerHeight;
      const headline = marks[0].closest("h2") ?? marks[0];
      const pageTop = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY;
      range.current = [pageTop(track) + track.offsetHeight - vh, pageTop(headline) - vh * 0.5];

      setGeometry({ left, top, width: right - left, height: bottom - top, lines });
    };

    let frame = requestAnimationFrame(measure);
    document.fonts?.ready.then(() => {
      frame = requestAnimationFrame(measure);
    });
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    });
    observer.observe(wrapper);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  // Each word takes its colour as its line reaches it, and gives it back if
  // the visitor scrolls up again.
  const colourMarks = (value: number) => {
    if (!geometry) return;
    marksRef.current.forEach((mark, index) => {
      const [, finish] = DRAW[index % DRAW.length];
      mark.style.color = value >= finish - 0.04 ? MARK_HEX[mark.dataset.mark as MarkColour] : "";
    });
  };
  useMotionValueEvent(progress, "change", colourMarks);
  useEffect(() => colourMarks(progress.get()));

  return (
    <svg
      ref={svgRef}
      aria-hidden
      viewBox={geometry ? `0 0 ${geometry.width} ${geometry.height}` : undefined}
      width={geometry?.width ?? 0}
      height={geometry?.height ?? 0}
      className="pointer-events-none absolute z-30 overflow-visible"
      style={{ left: geometry?.left ?? 0, top: geometry?.top ?? 0 }}
    >
      {geometry?.lines.map((line, index) => (
        <DrawnLine key={index} line={line} progress={progress} window={DRAW[index % DRAW.length]} />
      ))}
    </svg>
  );
}

function DrawnLine({ line, progress, window }: { line: Line; progress: MotionValue<number>; window: [number, number] }) {
  const [start, end] = window;
  const draw = useTransform(progress, [start, end], [0, 1]);
  const opacity = useTransform(progress, [start, start + 0.01], [0, 1]);
  const head = useTransform(progress, [end - 0.04, end], [0, 1]);
  const colour = MARK_HEX[line.colour];

  return (
    <>
      <motion.path
        d={line.d}
        fill="none"
        stroke={colour}
        strokeWidth={2.2}
        strokeLinecap="round"
        style={{ pathLength: draw, opacity }}
      />
      <motion.path
        d={line.arrow}
        fill="none"
        stroke={colour}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ opacity: head }}
      />
    </>
  );
}
