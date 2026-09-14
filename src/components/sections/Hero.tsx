"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { easeOutExpo } from "@/lib/motion";
import { useCalmMotion } from "@/lib/useCalmMotion";
import { Magnetic } from "@/components/motion/Magnetic";
import { MorphBlob } from "@/components/motion/MorphBlob";
import { site } from "@/data/site";

const headline = "Look, sound, and move like the market leaders you’re becoming.";
const words = headline.split(" ");

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
      // isolate: the blob's z-0 and the content's z-10 resolve against each
      // other here, never against the fixed nav.
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pb-8 pt-28 sm:pb-10 sm:pt-36"
    >
      {/* Background shape. Sits behind the headline block, carries no content,
          and passes every pointer event through to what's above it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-[0.16]"
      >
        <MorphBlob className="w-[165vw] max-w-none translate-x-[6%] -translate-y-[25%] text-blue blur-[14px] sm:w-[110vw] sm:-translate-x-[10%] sm:translate-y-[-1%] lg:w-[min(78vw,1080px)] lg:-translate-x-[14%] lg:translate-y-[1%]" />
      </div>

      <motion.div
        style={calm ? undefined : { y, opacity }}
        className="relative z-10 mx-auto my-auto w-full max-w-[1560px] px-5 py-10 sm:px-8 lg:px-12"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex items-center gap-2.5 text-label uppercase text-ink-soft"
        >
          <span aria-hidden className="pill inline-block h-2 w-2 bg-yellow" />
          {site.tagline}
        </motion.p>

        {/* Word-by-word mask reveal. Each word's clip box is padded above and
            below, then pulled back by the same amount, so ascenders and
            descenders aren't cut and the line spacing is unchanged. */}
        <h1 className="mt-6 max-w-[17ch] text-[clamp(2.4rem,6.4vw,6.25rem)] font-extrabold leading-[0.98] tracking-[-0.04em] sm:mt-8">
          {words.map((word, i) => (
            <span key={i}>
              <span className="-my-[0.2em] inline-block overflow-hidden py-[0.2em] align-top">
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1.05, delay: 0.2 + i * 0.055, ease: easeOutExpo }}
                  className={`inline-block ${i === words.length - 1 ? "text-blue" : ""}`}
                >
                  {word}
                </motion.span>
              </span>
              {i < words.length - 1 && " "}
            </span>
          ))}
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.85, ease: easeOutExpo }}
          className="mt-10 flex flex-col gap-7 sm:mt-12 md:flex-row md:items-center md:justify-between md:gap-10"
        >
          <p className="max-w-[44ch] text-[clamp(1.05rem,1.5vw,1.3rem)] font-medium leading-[1.5] text-ink-soft">
            A creative agency for ambitious brands &mdash; branding, digital,
            creative strategy and content, from Nigeria and Canada.
          </p>
          <div className="flex shrink-0 flex-wrap items-center gap-3">
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
                className="pill inline-flex items-center gap-2 border border-ink/25 bg-paper/60 px-6 py-3.5 text-[0.9rem] font-semibold backdrop-blur-sm transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-paper"
              >
                See Our Work <span aria-hidden>→</span>
              </Link>
            </Magnetic>
          </div>
        </motion.div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
        className="relative z-10 mx-auto w-full max-w-[1560px] border-t border-ink/12 px-5 pt-5 text-[0.82rem] leading-relaxed text-ink-soft sm:px-8 lg:px-12"
      >
        Since {site.founded}, we&rsquo;ve partnered with 160+ brands across
        Africa, Europe and North America &mdash; from early-stage start-ups to
        multinational institutions &mdash; building the branding, digital
        presence, and creative content that turns strategy into visibility.
      </motion.p>
    </section>
  );
}
