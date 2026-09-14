"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { easeOutExpo } from "@/lib/motion";
import { Magnetic } from "@/components/motion/Magnetic";
import { site } from "@/data/site";

const rise = (i: number) => ({
  initial: { opacity: 0, y: 26 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, delay: 0.35 + i * 0.12, ease: easeOutExpo },
});

/**
 * Centred masthead: a dome with a thin blue arc rising out of a field of
 * dots that ripple like a wave, the statement stacked inside it.
 */
export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center overflow-hidden bg-paper pt-32 sm:pt-36">
      <DotField />

      {/* The dome. Its lower half fades out so it reads as an arc, not a ball. */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.94, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.6, ease: easeOutExpo }}
        className="pointer-events-none absolute left-1/2 top-[7.5rem] aspect-square w-[175vw] -translate-x-1/2 rounded-full border-2 border-blue bg-white sm:top-[8rem] sm:w-[120vw] lg:w-[min(88vw,1280px)] [mask-image:linear-gradient(to_bottom,black_30%,transparent_50%)] sm:[mask-image:linear-gradient(to_bottom,black_38%,transparent_62%)]"
      />

      <div className="relative z-10 flex w-full max-w-[1560px] flex-col items-center px-5 pt-[7vh] text-center sm:px-8 sm:pt-[10vh] lg:px-12">
        <motion.h1
          {...rise(0)}
          className="text-[clamp(2.6rem,7.4vw,6.4rem)] font-extrabold leading-[0.96] tracking-[-0.04em]"
        >
          Thoughts turn
          <br />
          <span className="text-blue">reality.</span>
        </motion.h1>

        <motion.p
          {...rise(1)}
          className="mt-7 max-w-[46ch] text-[clamp(1rem,1.5vw,1.25rem)] leading-[1.55] text-ink-soft"
        >
          We are a creative agency helping ambitious brands look, sound, and
          move like the market leaders they&rsquo;re becoming.
        </motion.p>

        <motion.div
          {...rise(2)}
          className="pill mt-10 flex w-full max-w-[26rem] flex-col gap-1.5 border border-ink/15 bg-paper p-1.5 sm:w-auto sm:max-w-none sm:flex-row"
        >
          <Magnetic>
            <Link
              href="/#contact"
              className="pill flex w-full items-center justify-center gap-2 bg-blue-deep px-6 py-3.5 text-[0.9rem] font-semibold text-paper transition-colors duration-300 hover:bg-ink sm:w-auto"
            >
              Start a Project <span aria-hidden>→</span>
            </Link>
          </Magnetic>
          <Magnetic>
            <Link
              href="/#work"
              className="pill flex w-full items-center justify-center gap-2 px-6 py-3.5 text-[0.9rem] font-semibold transition-colors duration-300 hover:bg-ink hover:text-paper sm:w-auto"
            >
              See Our Work <span aria-hidden>→</span>
            </Link>
          </Magnetic>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
        className="relative z-10 mx-auto mb-12 mt-auto max-w-[62ch] px-5 pt-[14vh] text-center text-[0.9rem] leading-relaxed text-ink-soft sm:px-8"
      >
        Since {site.founded}, we&rsquo;ve partnered with 160+ brands across
        Africa, Europe and North America &mdash; from early-stage start-ups to
        multinational institutions.
      </motion.p>
    </section>
  );
}

/**
 * Rows of dots whose vertical position follows a sine wave, fading toward
 * the edges and toward the dome. Built deterministically so the server
 * and client draw the same field.
 */
function DotField() {
  const cols = 96;
  const rows = 22;
  const width = 1600;
  const height = 560;
  const dx = width / cols;
  const dy = height / rows;

  const dots: { x: number; y: number; o: number }[] = [];
  for (let c = 0; c <= cols; c++) {
    for (let r = 0; r <= rows; r++) {
      const x = c * dx;
      const wave = Math.sin((c / cols) * Math.PI * 3 + r * 0.42) * 26;
      const y = r * dy + wave;
      const edge = 1 - Math.abs(c / cols - 0.5) * 1.5;
      const depth = 1 - r / rows;
      const o = Math.max(0, Math.min(1, edge)) * (0.15 + depth * 0.85);
      // Rounded so the server and client serialise identical attributes.
      dots.push({ x: +x.toFixed(1), y: +y.toFixed(1), o: +o.toFixed(3) });
    }
  }

  return (
    <motion.svg
      aria-hidden
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMin slice"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.8, delay: 0.2 }}
      className="pointer-events-none absolute inset-x-0 top-0 h-[60svh] w-full text-blue"
    >
      {dots.map((d, i) => (
        <circle
          key={i}
          cx={d.x}
          cy={d.y}
          r={2.4}
          fill="currentColor"
          opacity={+(d.o * 0.5).toFixed(3)}
        />
      ))}
    </motion.svg>
  );
}
