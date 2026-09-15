"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { easeOutExpo } from "@/lib/motion";
import { useCalmMotion } from "@/lib/useCalmMotion";
import { storyStages, storyStats } from "@/data/story";
import { ArtifactArt } from "./Artifact";
import { AFRICA, CHAIN, LAGOS, NORTH_AMERICA, TORONTO, smoothPath } from "./geometry";

const reveal = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-15% 0px" },
  transition: { duration: 0.8, ease: easeOutExpo },
} as const;

/** A line that draws itself when it scrolls into view. */
function DrawnPath({ d, className, width = 1.6, delay = 0 }: { d: string; className: string; width?: number; delay?: number }) {
  return (
    <motion.path
      d={d}
      className={`fill-none ${className}`}
      strokeWidth={width}
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 1.1, delay, ease: easeOutExpo }}
    />
  );
}

/* One small drawing per stop: same visual language as the desktop canvas,
   a fraction of the elements. */

function OriginArt() {
  return (
    <svg viewBox="0 0 200 110" className="h-auto w-full max-w-[16rem]" aria-hidden>
      <circle cx={40} cy={55} r={26} className="story-pulse fill-none stroke-blue" strokeWidth={1.2} />
      <circle cx={40} cy={55} r={13} className="fill-paper stroke-ink/25" />
      <circle cx={40} cy={55} r={8} className="fill-blue" />
      <DrawnPath d="M52 50 L110 30" className="stroke-ink/40" width={1} />
      <text x={116} y={34} className="fill-ink-soft font-sans uppercase" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.16em" }}>
        Est. 2012
      </text>
    </svg>
  );
}

function NigeriaArt() {
  // Africa alone, cropped around it, with Lagos marked.
  return (
    <svg viewBox="420 350 340 430" className="h-auto w-40" aria-hidden>
      <path d={AFRICA} className="fill-none stroke-ink/35" strokeWidth={3} strokeLinecap="round" strokeDasharray="0.1 10" />
      <circle cx={LAGOS[0]} cy={LAGOS[1]} r={14} className="fill-blue" />
      <DrawnPath d={`M${LAGOS[0] + 18} ${LAGOS[1] - 6} L640 440`} className="stroke-ink/40" width={2} />
      <text x={650} y={446} className="fill-ink-soft font-sans uppercase" style={{ fontSize: 24, fontWeight: 600, letterSpacing: "0.16em" }}>
        Lagos
      </text>
    </svg>
  );
}

function StrategyArt() {
  // The chain, laid out straight: problem → strategy → idea → execution.
  const xs = [14, 76, 138, 200];
  return (
    <svg viewBox="-30 0 274 64" className="h-auto w-full max-w-[22rem]" aria-hidden>
      <DrawnPath d="M14 22 H200" className="stroke-ink" width={1.4} />
      {CHAIN.map((node, i) => (
        <g key={node.label}>
          <circle cx={xs[i]} cy={22} r={node.key ? 7 : 4.5} className={node.key ? "fill-blue" : "fill-paper stroke-ink"} strokeWidth={1.4} />
          <text
            x={xs[i]}
            y={50}
            textAnchor="middle"
            className={`font-sans uppercase ${node.key ? "fill-blue" : "fill-ink-soft"}`}
            style={{ fontSize: 8.5, fontWeight: 600, letterSpacing: "0.1em" }}
          >
            {node.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function CreativeArt() {
  const kinds = ["logo", "campaign", "content", "digital"] as const;
  return (
    <svg viewBox="0 0 208 172" className="h-auto w-full max-w-[17rem]" aria-hidden>
      {kinds.map((kind, i) => (
        // Position on a plain group: Motion's CSS transform on the inner one
        // would otherwise replace an SVG transform attribute.
        <g key={kind} transform={`translate(${50 + (i % 2) * 108} ${42 + Math.floor(i / 2) * 88})`}>
          <motion.g
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.7, delay: i * 0.12, ease: easeOutExpo }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            <ArtifactArt kind={kind} />
          </motion.g>
        </g>
      ))}
    </svg>
  );
}

function CanadaArt() {
  // Both continents, small, with the crossing drawn between them.
  const arc = smoothPath([LAGOS, [470, 330], [400, 250], TORONTO], false);
  return (
    <svg viewBox="40 40 720 740" className="h-auto w-full max-w-[18rem]" aria-hidden>
      <g className="fill-none stroke-ink/30" strokeWidth={4} strokeLinecap="round" strokeDasharray="0.1 14">
        <path d={NORTH_AMERICA} />
        <path d={AFRICA} />
      </g>
      <DrawnPath d={arc} className="stroke-blue" width={5} />
      <circle cx={LAGOS[0]} cy={LAGOS[1]} r={12} className="fill-blue" />
      <circle cx={TORONTO[0]} cy={TORONTO[1]} r={12} className="fill-blue" />
      <text x={TORONTO[0] - 22} y={TORONTO[1] - 24} textAnchor="end" className="fill-ink-soft font-sans uppercase" style={{ fontSize: 30, fontWeight: 600, letterSpacing: "0.14em" }}>
        Toronto
      </text>
      <text x={LAGOS[0] + 24} y={LAGOS[1] + 10} className="fill-ink-soft font-sans uppercase" style={{ fontSize: 30, fontWeight: 600, letterSpacing: "0.14em" }}>
        Lagos
      </text>
    </svg>
  );
}

function Stop({ marker, label, children, emphasis = false }: { marker: ReactNode; label: string; children: ReactNode; emphasis?: boolean }) {
  return (
    <li className="relative pb-16 pl-12 last:pb-0 sm:pl-16">
      <motion.span
        aria-hidden
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-20% 0px" }}
        transition={{ duration: 0.5, ease: easeOutExpo }}
        className={`absolute left-[9px] top-1 h-3.5 w-3.5 rounded-full ring-4 ring-paper sm:left-[13px] ${emphasis ? "bg-blue" : "border-2 border-ink bg-paper"}`}
      />
      <motion.div {...reveal}>
        <p className="text-label uppercase text-ink-soft">{label}</p>
        <div className="mt-3">{marker}</div>
        <div className="mt-5 space-y-4">{children}</div>
      </motion.div>
    </li>
  );
}

const byId = Object.fromEntries(storyStages.map((stage) => [stage.id, stage]));

/**
 * The mobile story: the journey turned vertical. A spine draws itself down
 * the page as you scroll, and each stop carries one small drawing instead
 * of the desktop canvas's full composition.
 */
export function JourneyMobile() {
  const calm = useCalmMotion();
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 75%", "end 60%"] });
  const spine = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const body = (text: string) => (
    <p key={text} className="max-w-[46ch] text-[1.02rem] leading-[1.65] text-ink-soft">
      {text}
    </p>
  );
  const title = (text: string) => (
    <h3 className="max-w-[20ch] text-[1.45rem] font-bold leading-[1.15] tracking-[-0.02em] sm:text-[1.75rem]">{text}</h3>
  );

  return (
    <div className="relative">
      {/* The spine: a faint track, and the drawn journey over it. */}
      <span aria-hidden className="absolute bottom-0 left-4 top-2 w-px bg-ink/15 sm:left-5" />
      <motion.span
        aria-hidden
        style={{ scaleY: calm ? 1 : spine }}
        className="absolute bottom-0 left-4 top-2 w-[2px] origin-top -translate-x-[0.5px] bg-blue sm:left-5"
      />

      <ol ref={listRef} className="relative">
        <Stop label={byId.origin.label} marker={<p className="text-[3.5rem] font-extrabold leading-none tracking-[-0.05em]">2012</p>} emphasis>
          <OriginArt />
          {byId.origin.body.map(body)}
        </Stop>

        <Stop label="Nigeria" marker={<NigeriaArt />}>
          {null}
        </Stop>

        <Stop label={byId.strategy.label} marker={<StrategyArt />}>
          {title(byId.strategy.title)}
          {byId.strategy.body.map(body)}
        </Stop>

        <Stop label={byId.creative.label} marker={<CreativeArt />}>
          {title(byId.creative.title)}
        </Stop>

        <Stop label="Canada" marker={<CanadaArt />}>
          {title(byId.global.title)}
          {byId.global.body.map(body)}
        </Stop>

        <Stop
          label={storyStats[0].label}
          marker={<p className="text-[4.5rem] font-extrabold leading-[0.85] tracking-[-0.05em]">{storyStats[0].value}</p>}
          emphasis
        >
          {title(byId.impact.title)}
        </Stop>

        <Stop
          label={storyStats[1].label}
          marker={<p className="text-[4.5rem] font-extrabold leading-[0.85] tracking-[-0.05em]">{storyStats[1].value}</p>}
          emphasis
        >
          {byId.impact.body.map(body)}
          <dl className="grid grid-cols-2 gap-6 border-t border-ink/15 pt-5">
            {storyStats.slice(2).map((stat) => (
              <div key={stat.label}>
                <dt className="text-label uppercase text-ink-soft">{stat.label}</dt>
                <dd className="mt-2 text-[2.75rem] font-extrabold leading-none tracking-[-0.04em]">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </Stop>
      </ol>
    </div>
  );
}
