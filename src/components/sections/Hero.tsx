"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { easeOutExpo } from "@/lib/motion";
import { useCalmMotion } from "@/lib/useCalmMotion";
import { HangingWords } from "@/components/motion/HangingWords";
import { TypedNote } from "@/components/motion/TypedNote";
import { Magnetic } from "@/components/motion/Magnetic";
import { site } from "@/data/site";

const line = {
  hidden: { y: "108%" },
  show: (i: number) => ({
    y: "0%",
    transition: { duration: 1.15, delay: 0.15 + i * 0.09, ease: easeOutExpo },
  }),
};

/**
 * Milliseconds after load at which each rope drops. The first waits for the
 * headline to finish rising; the rest follow one by one.
 */
const DROPS = [950, 1750, 2550];

/** Break point for the note on wider screens, so it sets on two lines. */
const NOTE =
  "We are a creative agency helping ambitious brands\nlook, sound, and move like the market leaders they’re becoming.";

export function Hero() {
  const calm = useCalmMotion();
  const [step, setStep] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const noteRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // With reduced motion there's nothing to stage: show all three at once.
    if (calm) {
      const frame = requestAnimationFrame(() => setStep(DROPS.length));
      return () => cancelAnimationFrame(frame);
    }
    const timers = DROPS.map((at, index) => setTimeout(() => setStep(index + 1), at));
    return () => timers.forEach(clearTimeout);
  }, [calm]);

  // On desktop the note sits in the same row as the button, and Move's rope
  // has to end just above it. Publish where that row lands, relative to the
  // hero, as --note-top. offsetTop ignores transforms, so the row's entrance
  // animation doesn't skew it; the observers catch font swaps and resizes.
  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const row = noteRowRef.current;
    if (!section || !content || !row) return;

    const publish = () => {
      let top = 0;
      let el: HTMLElement | null = row;
      while (el && el !== section) {
        top += el.offsetTop;
        el = el.offsetParent as HTMLElement | null;
      }
      section.style.setProperty("--note-top", `${top}px`);
    };

    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(section);
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  const note = (
    <TypedNote
      active={step >= DROPS.length}
      delay={0.55}
      pace={30}
      text={NOTE}
      className="w-full text-[0.95rem] font-semibold leading-[1.45] tracking-[-0.01em] sm:w-max sm:whitespace-pre-line sm:text-[0.9rem] lg:text-[clamp(0.95rem,1.2vw,1.2rem)]"
    />
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col overflow-hidden pb-8 pt-24 sm:pb-10 sm:pt-28 lg:[@media(max-height:760px)]:pb-6 lg:[@media(max-height:760px)]:pt-24"
    >
      <HangingWords step={step} note={note} />

      <div
        ref={contentRef}
        className="relative z-10 mx-auto mt-auto w-full max-w-[1560px] px-5 pb-8 sm:px-8 lg:my-auto lg:px-12 lg:py-10 lg:[@media(max-height:760px)]:py-2"
      >
        <div className="lg:max-w-[58%]">
          <h1 className="text-mega flex w-fit flex-col gap-[0.1em]">
            <span className="-my-[0.18em] block overflow-hidden py-[0.18em]">
              <motion.span
                variants={line}
                custom={0}
                initial="hidden"
                animate="show"
                className="block"
              >
                Ezers
                <span className="ml-[0.12em] font-medium text-blue">&amp;</span>
              </motion.span>
            </span>
            <span className="-my-[0.18em] block overflow-hidden py-[0.18em]">
              <motion.span
                variants={line}
                custom={1}
                initial="hidden"
                animate="show"
                className="block"
              >
                Strategies
              </motion.span>
            </span>
          </h1>

          <span className="mt-3 -mb-[0.15em] block w-fit overflow-hidden pb-[0.15em] sm:mt-5">
            <motion.span
              variants={line}
              custom={2}
              initial="hidden"
              animate="show"
              className="block text-[clamp(1.1rem,2.2vw,1.75rem)] font-medium tracking-[-0.02em] text-ink-soft"
            >
              {site.tagline}
            </motion.span>
          </span>
        </div>

        {/* Button and note on one line from desktop up; below that the note
            hangs under the ropes instead. */}
        <div className="mt-8 flex items-center justify-between gap-10 sm:mt-10 max-lg:[@media(max-height:700px)]:mt-5 lg:[@media(max-height:760px)]:mt-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: easeOutExpo }}
            className="shrink-0"
          >
            <Magnetic>
              <Link
                href="/#contact"
                className="pill inline-flex items-center gap-2 border-[1.5px] border-blue px-5 py-3 text-[0.88rem] font-semibold transition-colors duration-300 hover:border-blue-deep hover:bg-blue-deep hover:text-paper sm:px-6 sm:py-3.5 sm:text-[0.9rem]"
              >
                Start a Project <span aria-hidden>→</span>
              </Link>
            </Magnetic>
          </motion.div>

          <div ref={noteRowRef} className="hidden lg:block">
            {note}
          </div>
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
        className="relative z-10 mx-auto w-full max-w-[1560px] border-t border-ink/12 px-5 pt-5 text-[0.82rem] leading-relaxed text-ink-soft max-lg:[@media(max-height:700px)]:hidden sm:px-8 lg:px-12"
      >
        Since {site.founded}, we&rsquo;ve partnered with 160+ brands across
        Africa, Europe and North America &mdash; from early-stage start-ups to
        multinational institutions &mdash; building the branding, digital
        presence, and creative content that turns strategy into visibility.
      </motion.p>
    </section>
  );
}
