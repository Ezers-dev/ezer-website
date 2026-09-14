"use client";

import { easeOutExpo } from "@/lib/motion";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useCalmMotion } from "@/lib/useCalmMotion";
import { Magnetic } from "@/components/motion/Magnetic";
import { site } from "@/data/site";

const line = {
  hidden: { y: "108%" },
  show: (i: number) => ({
    y: "0%",
    transition: { duration: 1.15, delay: 0.15 + i * 0.09, ease: easeOutExpo },
  }),
};

export function Hero() {
  const calm = useCalmMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[88svh] flex-col justify-end overflow-hidden pb-10 pt-32 sm:pb-14 lg:min-h-[min(100svh,780px)]"
    >
      <motion.div
        style={calm ? undefined : { y, opacity }}
        className="mx-auto w-full max-w-[1560px] px-5 sm:px-8 lg:px-12"
      >
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-8">
            <h1 className="text-mega">
              <span className="block overflow-hidden">
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
              <span className="block overflow-hidden">
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

            <span className="mt-3 block overflow-hidden sm:mt-5">
              <motion.span
                variants={line}
                custom={2}
                initial="hidden"
                animate="show"
                className="flex items-center gap-3 text-[clamp(1.1rem,2.6vw,2rem)] font-medium tracking-[-0.02em] text-ink-soft"
              >
                <motion.span
                  aria-hidden
                  animate={{ scale: [1, 1.35, 1] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                  className="pill inline-block h-[0.42em] w-[0.42em] shrink-0 bg-yellow"
                />
                {site.tagline}
              </motion.span>
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: easeOutExpo }}
            className="lg:col-span-4 lg:pb-3"
          >
            <p className="text-lede max-w-[42ch] font-medium">
              We are a creative agency helping ambitious brands look, sound, and
              move like the market leaders they&rsquo;re becoming.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Magnetic>
                <Link
                  href="/#contact"
                  className="pill inline-flex items-center gap-2 bg-blue-deep px-6 py-3.5 text-[0.9rem] font-semibold text-paper transition-colors duration-300 hover:bg-ink"
                >
                  Start a Project <span aria-hidden>→</span>
                </Link>
              </Magnetic>
              <Magnetic>
                <Link
                  href="/#work"
                  className="pill inline-flex items-center gap-2 border border-ink/25 px-6 py-3.5 text-[0.9rem] font-semibold transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-paper"
                >
                  See Our Work <span aria-hidden>→</span>
                </Link>
              </Magnetic>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
        className="mx-auto mt-12 w-full max-w-[1560px] border-t border-ink/12 px-5 pt-5 text-[0.82rem] leading-relaxed text-ink-soft sm:px-8 lg:px-12"
      >
        Since {site.founded}, we&rsquo;ve partnered with 160+ brands across
        Africa, Europe and North America &mdash; from early-stage start-ups to
        multinational institutions &mdash; building the branding, digital
        presence, and creative content that turns strategy into visibility.
      </motion.p>
    </section>
  );
}
