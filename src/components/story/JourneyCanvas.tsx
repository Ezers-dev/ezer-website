"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import {
  motion,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "motion/react";
import { panelHex } from "@/lib/colors";
import { storyStages } from "@/data/story";
import { ArtifactArt, ArtifactInner } from "./Artifact";
import {
  AFRICA,
  ARTIFACTS,
  CHAIN,
  FRAME_H,
  FRAME_W,
  JOURNEY,
  LAGOS,
  NORTH_AMERICA,
  STRATEGY_NODE,
  SYSTEM_FRAME,
  TORONTO,
  VIEWBOX,
  journeyPoint,
  type Point,
} from "./geometry";

/*
 * Scroll progress windows for the five stages. Each block on the left is
 * one fifth of the scroll track, so a stage plays while its block crosses
 * the middle of the screen. Every window is split further so things happen
 * in sequence rather than all at once.
 */
type Window = readonly [number, number];
const STAGE = {
  origin: [0, 0.2],
  strategy: [0.2, 0.4],
  creative: [0.4, 0.6],
  global: [0.6, 0.8],
  impact: [0.8, 1],
} as const satisfies Record<string, Window>;

/** A point `f` of the way through a stage's window. */
const at = (stage: Window, f: number) => stage[0] + (stage[1] - stage[0]) * f;

type Progress = { progress: MotionValue<number> };

const LABEL = { fontSize: 13, fontWeight: 600, letterSpacing: "0.16em" } as const;

/**
 * The canvas colour for a stage. Thin yellow strokes almost vanish on paper,
 * so the canvas draws that stage in a deeper gold; the panel on the left keeps
 * the true brand yellow.
 */
const accentFor = (color: (typeof storyStages)[number]["color"]) =>
  color === "yellow" ? "#d9a300" : panelHex[color];

/* ------------------------------------------------------------------ map */

function Continents({ progress }: Progress) {
  // Fade in as the origin appears; recede once the system resolves.
  const opacity = useTransform(
    progress,
    [at(STAGE.origin, 0.05), at(STAGE.origin, 0.5), at(STAGE.impact, 0.1), at(STAGE.impact, 0.6)],
    [0, 1, 1, 0.45],
  );
  return (
    <motion.g
      style={{ opacity }}
      // A fixed neutral: the map is the constant backdrop, so it doesn't take
      // the stage colour the way nodes and lines do.
      className="fill-none stroke-ink/50"
      strokeWidth={4}
      strokeLinecap="round"
      strokeDasharray="0.1 11"
    >
      <path d={NORTH_AMERICA} />
      <path d={AFRICA} />
    </motion.g>
  );
}

/* --------------------------------------------------------- annotations */

/** A small studio-sketchbook note: a leader line from a point to a label. */
function Annotation({
  progress,
  window,
  from,
  to,
  text,
  anchor = "start",
}: Progress & { window: Window; from: Point; to: Point; text: string; anchor?: "start" | "end" }) {
  const line = useTransform(progress, [window[0], window[0] + (window[1] - window[0]) * 0.6], [0, 1]);
  const opacity = useTransform(progress, [window[0] + (window[1] - window[0]) * 0.4, window[1]], [0, 1]);
  const dx = anchor === "start" ? 6 : -6;
  return (
    <g>
      <motion.path
        d={`M${from[0]} ${from[1]} L${to[0]} ${to[1]}`}
        className="fill-none stroke-ink/40"
        strokeWidth={1}
        style={{ pathLength: line }}
      />
      <motion.text
        x={to[0] + dx}
        y={to[1] + 4}
        textAnchor={anchor}
        className="fill-ink-soft font-sans uppercase"
        style={{ ...LABEL, fontSize: 11.5, opacity }}
      >
        {text}
      </motion.text>
    </g>
  );
}

/* -------------------------------------------------------------- origin */

function Node({
  progress,
  window,
  at: point,
  radius = 7,
  className = "fill-(--story-accent)",
  pulse = false,
}: Progress & { window: Window; at: Point; radius?: number; className?: string; pulse?: boolean }) {
  const scale = useTransform(progress, [window[0], window[1]], [0, 1]);
  return (
    <motion.g style={{ scale, transformBox: "fill-box", transformOrigin: "center" }}>
      {pulse && (
        <circle
          cx={point[0]}
          cy={point[1]}
          r={radius}
          className="story-pulse fill-none stroke-(--story-accent)"
          strokeWidth={1.5}
        />
      )}
      <circle cx={point[0]} cy={point[1]} r={radius + 5} className="fill-paper stroke-(--story-accent)" strokeOpacity={0.45} strokeWidth={1} />
      <circle cx={point[0]} cy={point[1]} r={radius} className={className} />
    </motion.g>
  );
}

/* ------------------------------------------------------------ strategy */

function ChainLink({ progress, index }: Progress & { index: number }) {
  const from = index === 0 ? LAGOS : CHAIN[index - 1].at;
  const node = CHAIN[index];
  const start = at(STAGE.strategy, 0.05 + index * 0.21);
  const end = at(STAGE.strategy, 0.2 + index * 0.21);

  const draw = useTransform(progress, [start, end], [0, 1]);
  const scale = useTransform(progress, [end - 0.004, end + 0.012], [0, 1]);
  const labelOpacity = useTransform(progress, [end, end + 0.02], [0, 1]);

  return (
    <g>
      <motion.path
        d={`M${from[0]} ${from[1]} L${node.at[0]} ${node.at[1]}`}
        className={node.key ? "fill-none stroke-(--story-accent)" : "fill-none stroke-ink"}
        strokeWidth={node.key ? 1.2 : 0.9}
        style={{ pathLength: draw }}
      />
      <motion.g style={{ scale, transformBox: "fill-box", transformOrigin: "center" }}>
        <circle
          cx={node.at[0]}
          cy={node.at[1]}
          r={node.key ? 9 : 5.5}
          className={node.key ? "fill-(--story-accent)" : "fill-paper stroke-ink"}
          strokeWidth={1.4}
        />
      </motion.g>
      <motion.text
        x={node.labelSide === "right" ? node.at[0] + 16 : node.at[0]}
        y={
          node.labelSide === "right"
            ? node.at[1] + 5
            : node.labelSide === "above"
              ? node.at[1] - 16
              : node.at[1] + (node.key ? 30 : 24)
        }
        textAnchor={node.labelSide === "right" ? "start" : "middle"}
        // Ink, not the accent: green, orange and yellow text would fall
        // below contrast on paper.
        className={`font-sans uppercase ${node.key ? "fill-ink" : "fill-ink-soft"}`}
        style={{ ...LABEL, opacity: labelOpacity }}
      >
        {node.label}
      </motion.text>
    </g>
  );
}

function StrategyChain({ progress }: Progress) {
  // Hands over to the work it produced: gone by the time the system resolves,
  // so the final composition is calm rather than layered.
  const opacity = useTransform(progress, [at(STAGE.impact, 0.05), at(STAGE.impact, 0.4)], [1, 0]);
  return (
    <motion.g style={{ opacity }}>
      {CHAIN.map((_, index) => (
        <ChainLink key={index} progress={progress} index={index} />
      ))}
    </motion.g>
  );
}

/* ------------------------------------------------------------ artifacts */

function Artifact({ progress, index }: Progress & { index: number }) {
  const item = ARTIFACTS[index];
  const [hx, hy] = item.home;

  // Where it comes from, and when.
  let source: Point;
  let make: Window;
  if (item.source === "strategy") {
    source = STRATEGY_NODE;
    const creativeOrder = index;
    make = [at(STAGE.creative, 0.04 + creativeOrder * 0.2), at(STAGE.creative, 0.36 + creativeOrder * 0.2)];
  } else {
    source = journeyPoint(item.source.journey);
    const passing = at(STAGE.global, item.source.journey * 0.8);
    make = [passing, passing + 0.04];
  }

  // When it settles into the resolved system.
  const settle: Window = [at(STAGE.impact, 0.1 + index * 0.045), at(STAGE.impact, 0.5 + index * 0.045)];

  const keys = [make[0], make[1], settle[0], settle[1]];
  const x = useTransform(progress, keys, [source[0] - hx, 0, 0, item.grid[0] - hx]);
  const y = useTransform(progress, keys, [source[1] - hy, 0, 0, item.grid[1] - hy]);
  const scale = useTransform(progress, keys, [0.15, item.homeScale, item.homeScale, 1]);
  const opacity = useTransform(progress, [make[0], make[0] + (make[1] - make[0]) * 0.25], [0, 1]);

  // A frame first, then the composition inside it: creativity filling in.
  const outline = useTransform(progress, [make[0], make[0] + (make[1] - make[0]) * 0.55], [0, 1]);
  const inner = useTransform(progress, [make[0] + (make[1] - make[0]) * 0.45, make[1]], [0, 1]);

  const labelX = useTransform([x, scale], ([dx, s]: number[]) => dx + ((1 - s) * FRAME_W) / 2);
  const labelY = useTransform([y, scale], ([dy, s]: number[]) => dy - ((1 - s) * FRAME_H) / 2);

  const labelOpacity = useTransform(
    progress,
    [make[1], make[1] + 0.015, settle[0], settle[0] + 0.02],
    [0, 1, 1, 0],
  );

  return (
    <g transform={`translate(${hx} ${hy})`}>
      {/* Scale about the frame's own centre. The label below the frame is
          excluded from the box by keeping it outside this group. */}
      <motion.g style={{ x, y, scale, opacity, transformBox: "fill-box", transformOrigin: "center" }}>
        <rect x={-FRAME_W / 2} y={-FRAME_H / 2} width={FRAME_W} height={FRAME_H} className="fill-paper" />
        <motion.g style={{ opacity: inner }} className="fill-none stroke-ink" strokeWidth={1.4}>
          <ArtifactInner kind={item.kind} />
        </motion.g>
        <motion.rect
          x={-FRAME_W / 2}
          y={-FRAME_H / 2}
          width={FRAME_W}
          height={FRAME_H}
          className="fill-none stroke-ink"
          strokeWidth={1.4}
          style={{ pathLength: outline }}
        />
      </motion.g>
      {/* The caption follows the frame's bottom-left corner but never scales,
          so it stays legible on the smaller trail pieces. */}
      <motion.text
        x={-FRAME_W / 2}
        y={FRAME_H / 2 + 17}
        className="fill-ink-soft font-sans uppercase"
        style={{ ...LABEL, fontSize: 11, x: labelX, y: labelY, opacity: labelOpacity }}
      >
        {item.label}
      </motion.text>
    </g>
  );
}

/* --------------------------------------------------------------- global */

function Journey({ progress }: Progress) {
  const pathRef = useRef<SVGPathElement>(null);
  const travellerRef = useRef<SVGGElement>(null);

  const start = at(STAGE.global, 0);
  const arrive = at(STAGE.global, 0.8);

  const guide = useTransform(progress, [start, start + 0.02], [0, 1]);
  const draw = useTransform(progress, [start, arrive], [0, 1]);
  const travel = useTransform(progress, [start, arrive], [0, 1]);
  const travellerOpacity = useTransform(progress, [start, start + 0.01, arrive, arrive + 0.01], [0, 1, 1, 0]);
  const dim = useTransform(progress, [at(STAGE.impact, 0.1), at(STAGE.impact, 0.5)], [1, 0.5]);

  // Move the traveller along the real path geometry. Runs only when scroll
  // progress changes — no animation loop.
  const place = (t: number) => {
    const path = pathRef.current;
    const traveller = travellerRef.current;
    if (!path || !traveller) return;
    const point = path.getPointAtLength(path.getTotalLength() * t);
    traveller.setAttribute("transform", `translate(${point.x} ${point.y})`);
  };
  useMotionValueEvent(travel, "change", place);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => place(travel.get()), []);

  return (
    <motion.g style={{ opacity: dim }}>
      <motion.path
        d={JOURNEY}
        className="fill-none stroke-ink/25"
        strokeWidth={0.9}
        strokeDasharray="3 6"
        style={{ opacity: guide }}
      />
      <motion.path
        ref={pathRef}
        d={JOURNEY}
        className="fill-none stroke-(--story-accent)"
        strokeWidth={1.3}
        strokeLinecap="round"
        style={{ pathLength: draw }}
      />
      <motion.g ref={travellerRef} style={{ opacity: travellerOpacity }}>
        <circle r={10} className="fill-(--story-accent)" fillOpacity={0.22} />
        <circle r={5} className="fill-(--story-accent)" />
      </motion.g>
    </motion.g>
  );
}

/* --------------------------------------------------------------- impact */

function System({ progress }: Progress) {
  const draw = useTransform(progress, [at(STAGE.impact, 0.42), at(STAGE.impact, 0.78)], [0, 1]);
  const link = useTransform(progress, [at(STAGE.impact, 0.6), at(STAGE.impact, 0.85)], [0, 1]);
  const { x, y, w, h } = SYSTEM_FRAME;
  return (
    <g>
      {/* The origin and the resolved system, connected. */}
      <motion.path
        d={`M${LAGOS[0]} ${LAGOS[1] + 12} V${y}`}
        className="fill-none stroke-(--story-accent)"
        strokeWidth={0.9}
        style={{ pathLength: link }}
      />
      <motion.rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={4}
        className="fill-none stroke-ink"
        strokeWidth={1.6}
        style={{ pathLength: draw }}
      />
    </g>
  );
}

/* ---------------------------------------------------------- stage index */

const STAGE_NAMES = ["Origin", "Strategy", "Creative", "Global", "Impact"];

function StageReadout({ progress, index }: Progress & { index: number }) {
  const windows = Object.values(STAGE);
  const [s, e] = windows[index];
  const first = index === 0;
  const last = index === windows.length - 1;
  const opacity = useTransform(
    progress,
    first ? [e - 0.02, e] : last ? [s - 0.02, s] : [s - 0.02, s, e - 0.02, e],
    first ? [1, 0] : last ? [0, 1] : [0, 1, 1, 0],
  );
  return (
    <motion.text
      x={VIEWBOX - 24}
      y={34}
      textAnchor="end"
      className="font-sans uppercase"
      // Each readout carries its own stage's colour rather than the shared
      // accent, so the outgoing and incoming labels keep their colours while
      // they cross-fade.
      style={{ ...LABEL, fontSize: 14, fontWeight: 800, fill: accentFor(storyStages[index].color), opacity }}
    >
      {`0${index + 1} / 05 · ${STAGE_NAMES[index]}`}
    </motion.text>
  );
}

/* ---------------------------------------------------------------- canvas */

/**
 * The desktop story canvas. One inline SVG, every element driven from a
 * single scroll-progress value through transform, opacity and stroke
 * drawing, so nothing lays out or loops while it plays.
 */
export function JourneyCanvas({ progress }: Progress) {
  const svgRef = useRef<SVGSVGElement>(null);

  // Take the colour of the stage in view. Written straight to the element,
  // and only when the stage actually changes, so scrolling never re-renders
  // the canvas; the registered custom property eases between colours in CSS.
  const stageRef = useRef(-1);
  const applyStage = (value: number) => {
    const index = Math.min(storyStages.length - 1, Math.max(0, Math.floor(value * storyStages.length)));
    if (index === stageRef.current || !svgRef.current) return;
    stageRef.current = index;
    svgRef.current.style.setProperty("--story-accent", accentFor(storyStages[index].color));
  };
  useMotionValueEvent(progress, "change", applyStage);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => applyStage(progress.get()), []);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
      role="img"
      aria-label="Our origin: one idea in Lagos, Nigeria in 2012 grows through strategy into creative work, travels to Toronto, Canada, and resolves into a complete brand system."
      className="story-canvas h-full max-h-full w-full"
      style={{ "--story-accent": panelHex[storyStages[0].color] } as CSSProperties}
    >
      {STAGE_NAMES.map((_, index) => (
        <StageReadout key={index} progress={progress} index={index} />
      ))}

      <Continents progress={progress} />

      <Journey progress={progress} />
      <StrategyChain progress={progress} />
      <System progress={progress} />

      {ARTIFACTS.map((_, index) => (
        <Artifact key={index} progress={progress} index={index} />
      ))}

      <Node progress={progress} window={[at(STAGE.origin, 0.25), at(STAGE.origin, 0.45)]} at={LAGOS} pulse />
      <Node
        progress={progress}
        window={[at(STAGE.global, 0.78), at(STAGE.global, 0.9)]}
        at={TORONTO}
        radius={6}
      />

      <Annotation progress={progress} window={[at(STAGE.origin, 0.45), at(STAGE.origin, 0.75)]} from={[512, 480]} to={[578, 452]} text="Lagos" />
      <Annotation progress={progress} window={[at(STAGE.origin, 0.6), at(STAGE.origin, 0.95)]} from={[508, 498]} to={[590, 520]} text="Est. 2012" />
      <Annotation progress={progress} window={[at(STAGE.global, 0.85), at(STAGE.global, 1)]} from={[310, 228]} to={[250, 196]} text="Toronto" anchor="end" />
      <Annotation progress={progress} window={[at(STAGE.impact, 0.7), at(STAGE.impact, 0.9)]} from={[SYSTEM_FRAME.x, SYSTEM_FRAME.y + 20]} to={[48, 470]} text="12+ years" />
      <Annotation
        progress={progress}
        window={[at(STAGE.impact, 0.78), at(STAGE.impact, 0.98)]}
        from={[SYSTEM_FRAME.x + SYSTEM_FRAME.w, SYSTEM_FRAME.y + SYSTEM_FRAME.h - 20]}
        to={[600, 740]}
        text="160+ clients"
      />
    </svg>
  );
}

export { ArtifactArt };
