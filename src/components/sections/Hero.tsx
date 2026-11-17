"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { easeOutExpo } from "@/lib/motion";
import { HeroSpotlight } from "@/components/motion/HeroSpotlight";

/** The statement, one sentence to a line from tablet up. */
const LINES = ["Ezers!", "You’ve got the ambition.", "We’ll make the market see it."];

const line = {
  hidden: { y: "108%" },
  show: (i: number) => ({
    y: "0%",
    transition: { duration: 1.1, delay: 0.15 + i * 0.1, ease: easeOutExpo },
  }),
};

/**
 * The landing screen: one photograph edge to edge, and the studio's promise
 * set across it in bold. The picture is darkened towards the left,
 * where the words sit, so they stay readable whatever it shows.
 *
 * To change the picture, replace /public/hero/summit.jpg (or point `src`
 * at another file); a dark, low-detail image works best under the type.
 */
export function Hero() {
  return (
    <section
      data-nav-theme="paper"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-ink text-paper"
    >
      <Image
        src="/hero/summit.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[50%_45%] lg:origin-top lg:scale-[1.4]"
      />
      {/* Two washes: an even one to quieten the picture, and one that deepens
          towards the left under the headline. */}
      <div aria-hidden className="absolute inset-0 bg-ink/35" />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(75deg,rgb(11_16_19/0.8)_0%,rgb(11_16_19/0.5)_40%,rgb(11_16_19/0)_78%)]"
      />
      <HeroSpotlight />

      <div className="relative mx-auto w-full max-w-[1560px] px-5 pb-[clamp(3rem,8svh,6rem)] pt-[clamp(7rem,16svh,10rem)] sm:px-8 lg:px-12">
        <h1 className="text-[clamp(2.1rem,min(4.6vw,9.5svh),4.75rem)] font-extrabold leading-[0.98] tracking-[-0.04em]">
          {LINES.map((text, index) => (
            <span key={text} className="-my-[0.1em] block overflow-hidden py-[0.1em]">
              <motion.span
                variants={line}
                custom={index}
                initial="hidden"
                animate="show"
                className="block lg:whitespace-nowrap"
              >
                {text}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.75, ease: easeOutExpo }}
          className="mt-[clamp(2rem,4vw,3.25rem)]"
        >
          <Link
            href="/#contact"
            className="pill inline-flex items-center bg-paper px-7 py-4 text-[0.95rem] font-semibold text-ink transition-colors duration-300 hover:bg-blue hover:text-paper"
          >
            Start a project
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
