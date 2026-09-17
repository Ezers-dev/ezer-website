"use client";

import { useRef } from "react";
import { motion, useMotionValue, useScroll, useTransform } from "motion/react";
import { easeOutExpo } from "@/lib/motion";
import { useCalmMotion } from "@/lib/useCalmMotion";
import { onBrandText, panelBg } from "@/lib/colors";
import { BouncingHeadline, SEEN_BLUE } from "@/components/story/BouncingHeadline";
import { OriginLink } from "@/components/story/OriginLink";
import dynamic from "next/dynamic";
import {
  storyClosing,
  storyHeadline,
  storyIntro,
  storyOriginTitle,
  storyStages,
  storyStats,
} from "@/data/story";

/** The statement, word by word, for the bouncing reveal. */
const HEADLINE_WORDS = [...storyHeadline.lead.split(" "), storyHeadline.accent];

/** "Our Origin", with the last word split out so it can take the blue. */
const ORIGIN_SPLIT = storyOriginTitle.lastIndexOf(" ");
const ORIGIN_LEAD = storyOriginTitle.slice(0, ORIGIN_SPLIT);
const ORIGIN_WORD = storyOriginTitle.slice(ORIGIN_SPLIT + 1);

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

  // The opening holds for a screen and a bit while the staircase closes into
  // a line. Derived before use, as in What We Do: fed straight in, Motion
  // hands opacity to the browser's scroll timeline, which mis-maps pinned
  // tracks.
  const openingRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: openingRaw } = useScroll({
    target: openingRef,
    offset: ["start start", "end end"],
  });
  const openingScrolled = useTransform(openingRaw, (value) => value);
  const opening = calm ? finished : openingScrolled;
  const introOpacity = useTransform(opening, [0.55, 0.85], [0, 1]);
  const introY = useTransform(opening, [0.55, 0.85], [28, 0]);

  // From the moment the opening lets go, a line runs on out of the circle
  // around "seen." and arrives at "Origin", which takes the same blue as it
  // lands. It finishes over a short stretch of scroll — while "Origin" rises
  // only a quarter of the screen — so the line visibly travels down to meet
  // it rather than drifting up the screen with the page.
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const originRef = useRef<HTMLSpanElement>(null);
  const { scrollYProgress: linkRaw } = useScroll({
    target: originRef,
    offset: ["start end", "start 0.72"],
  });
  const linkScrolled = useTransform(linkRaw, (value) => value);
  const link = calm ? finished : linkScrolled;
  const originColour = useTransform(link, [0.86, 1], ["#0b1013", SEEN_BLUE]);

  return (
    <section ref={sectionRef} id="story" className="relative scroll-mt-0">
      {/* Opening: pinned for a screen and a bit. The staircase and bounce
          play on arrival; scrolling on closes the steps into one centred line
          and brings in the supporting sentence, and scrolling back undoes it. */}
      <OriginLink
        progress={link}
        sectionRef={sectionRef}
        trackRef={openingRef}
        stageRef={stageRef}
        targetRef={originRef}
      />

      <div ref={openingRef} className="relative h-[220svh]">
        <div ref={stageRef} className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden px-5 text-center sm:px-8 lg:px-12">
          <BouncingHeadline
            words={HEADLINE_WORDS}
            progress={opening}
            className="mx-auto text-[clamp(2.25rem,5.6vw,6rem)] font-extrabold leading-[0.96] tracking-[-0.035em] sm:whitespace-nowrap"
          />
          <motion.p
            style={{ opacity: introOpacity, y: introY }}
            className="mt-8 max-w-[34ch] text-lede font-medium text-ink-soft"
          >
            {storyIntro}
          </motion.p>
        </div>
      </div>

      <div className="mx-auto max-w-[1560px] px-5 sm:px-8 lg:px-12">
        {/* Heading for the journey, left-aligned like the other section titles.
            It sits above the track so the stages keep their scroll timing. */}
        <motion.h3 {...reveal} className="text-display">
          {ORIGIN_LEAD}{" "}
          <motion.span ref={originRef} style={{ color: originColour }}>
            {ORIGIN_WORD}
          </motion.span>
        </motion.h3>

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
