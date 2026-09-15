"use client";

import { useRef } from "react";
import { motion, useMotionValue, useScroll } from "motion/react";
import { easeOutExpo } from "@/lib/motion";
import { useCalmMotion } from "@/lib/useCalmMotion";
import { onBrandText, panelBg } from "@/lib/colors";
import dynamic from "next/dynamic";
import {
  storyClosing,
  storyHeadline,
  storyIntro,
  storyStages,
  storyStats,
} from "@/data/story";

// Both compositions load as their own chunks, so neither competes with the
// hero for the first paint. The desktop canvas is decorative and holds its
// square box, so it skips server rendering; the mobile journey carries real
// copy and is still prerendered.
const JourneyCanvas = dynamic(
  () => import("@/components/story/JourneyCanvas").then((m) => m.JourneyCanvas),
  { ssr: false },
);
const JourneyMobile = dynamic(() =>
  import("@/components/story/JourneyMobile").then((m) => m.JourneyMobile),
);

const reveal = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-12% 0px" },
  transition: { duration: 0.9, ease: easeOutExpo },
} as const;

/** "seen.", circled by hand as it comes into view. */
function Seen({ children }: { children: string }) {
  return (
    <span className="relative inline-block text-blue">
      {children}
      <svg
        aria-hidden
        viewBox="0 0 220 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute -inset-x-[14%] -inset-y-[10%] h-[120%] w-[128%] overflow-visible"
      >
        <motion.path
          d="M22 58 C 18 22, 92 8, 150 14 C 206 20, 214 58, 184 78 C 150 98, 58 96, 30 76 C 14 64, 26 38, 64 26"
          className="fill-none stroke-blue"
          strokeWidth={2.2}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "-20% 0px" }}
          transition={{ duration: 1.4, delay: 0.5, ease: [0.65, 0, 0.35, 1] }}
        />
      </svg>
    </span>
  );
}

export function Story() {
  const calm = useCalmMotion();
  const trackRef = useRef<HTMLDivElement>(null);

  // Progress through the five story blocks: each block's stage plays as it
  // crosses the middle of the screen. With reduced motion the canvas simply
  // shows its finished composition.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    // Ends as the track leaves the bottom of the screen, which is exactly
    // when the pinned canvas lets go. The spacer after the last block makes
    // that line up with each stage still playing as its block is centred.
    offset: ["start center", "end end"],
  });
  const finished = useMotionValue(1);
  const progress = calm ? finished : scrollYProgress;

  return (
    <section id="story" className="scroll-mt-24 border-t border-ink/12 pt-20 sm:pt-28">
      <div className="mx-auto max-w-[1560px] px-5 sm:px-8 lg:px-12">
        {/* Opening: minimal, before any of the story moves. */}
        <header className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <p className="text-label uppercase text-ink-soft lg:col-span-3 lg:pt-5">
            <span className="pill mr-2 inline-block h-2 w-2 bg-pink align-middle" />
            Our Story
          </p>
          <div className="lg:col-span-9">
            <motion.h2 {...reveal} className="text-display max-w-[13ch]">
              {storyHeadline.lead} <Seen>{storyHeadline.accent}</Seen>
            </motion.h2>
            <motion.p
              {...reveal}
              transition={{ ...reveal.transition, delay: 0.15 }}
              className="mt-7 max-w-[34ch] text-lede font-medium text-ink-soft"
            >
              {storyIntro}
            </motion.p>
          </div>
        </header>

        {/* Desktop: story blocks on the left, one anchored canvas on the right. */}
        <div ref={trackRef} className="relative mt-16 hidden lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <ol>
              {storyStages.map((stage, index) => (
                <li key={stage.id} className="flex min-h-[82svh] items-center">
                  {/* Each stage sits on its own brand colour, which the canvas
                      picks up while this block is in view. Text is set at full
                      strength in the colour's contrast pair: dimmed text on a
                      colour panel doesn't clear AA. */}
                  <motion.div
                    {...reveal}
                    className={`w-full max-w-[32rem] p-8 xl:p-10 ${panelBg[stage.color]} ${onBrandText[stage.color]}`}
                  >
                    <p className="flex items-center gap-3 text-label uppercase">
                      <span className="tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                      <span aria-hidden className="h-px w-8 bg-current" />
                      {stage.label}
                    </p>
                    <h3
                      className={`mt-5 font-bold tracking-[-0.03em] ${
                        stage.id === "origin"
                          ? "text-[clamp(3rem,5vw,4.75rem)] leading-[0.95]"
                          : "text-[clamp(1.75rem,2.6vw,2.6rem)] leading-[1.08]"
                      }`}
                    >
                      {stage.title}
                    </h3>
                    {stage.body.map((paragraph) => (
                      <p key={paragraph} className="mt-5 text-[1.05rem] font-medium leading-[1.7]">
                        {paragraph}
                      </p>
                    ))}
                  </motion.div>
                </li>
              ))}
            </ol>
            {/* Holds the resolved canvas on screen for a beat after the last
                block, and keeps each stage aligned with its block. */}
            <div aria-hidden className="h-[50svh]" />
          </div>

          <div className="lg:col-span-7">
            <div className="sticky top-[83px] flex h-[calc(100svh-83px)] items-center justify-center py-6">
              <div className="aspect-square h-full max-h-full max-w-full">
                <JourneyCanvas progress={progress} />
              </div>
            </div>
          </div>
        </div>

        {/* Below desktop: the journey runs vertically. */}
        <div className="mt-16 lg:hidden">
          <JourneyMobile />
        </div>

        {/* The result of the journey, read left to right along the same line. */}
        <div className="mt-20 hidden lg:block">
          <div className="relative">
            <motion.span
              aria-hidden
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
              className="absolute left-0 right-0 top-0 h-[2px] origin-left bg-blue"
            />
            <dl className="grid grid-cols-4">
              {storyStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-15% 0px" }}
                  transition={{ duration: 0.9, delay: 0.35 + index * 0.18, ease: easeOutExpo }}
                  // Label first in the markup, as a definition list requires;
                  // column-reverse sets the figure above it. The node on the
                  // line is a pseudo-element, since a dl group allows only
                  // dt and dd inside.
                  className="relative flex flex-col-reverse border-l border-ink/12 px-6 pt-10 before:absolute before:-top-[5px] before:left-6 before:h-3 before:w-3 before:rounded-full before:bg-blue before:ring-4 before:ring-paper first:border-l-0 first:pl-0 first:before:left-0"
                >
                  <dt className="mt-4 text-label uppercase text-ink-soft">{stat.label}</dt>
                  <dd className="text-[clamp(4rem,8.5vw,8.5rem)] font-extrabold leading-[0.85] tracking-[-0.05em]">
                    {stat.value}
                  </dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>

        {/* Resolved: calm and confident, then on to the next section. */}
        <motion.p
          {...reveal}
          className="mx-auto max-w-[22ch] py-24 text-center text-headline sm:py-32"
        >
          {storyClosing}
        </motion.p>
      </div>
    </section>
  );
}
