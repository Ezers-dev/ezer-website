"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { Reveal, FadeUp } from "@/components/motion/Reveal";
import { site } from "@/data/site";

export function Story() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["6%", "-22%"]);

  return (
    <section id="story" className="scroll-mt-24 border-t border-ink/12 py-20 sm:py-28">
      <div className="mx-auto max-w-[1560px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <h2 className="text-label uppercase text-ink-soft lg:sticky lg:top-28">
              <span className="pill mr-2 inline-block h-2 w-2 bg-pink align-middle" />
              Our Story
            </h2>
          </div>

          <div className="lg:col-span-8 lg:col-start-5">
            <div className="text-headline max-w-[19ch]">
              <Reveal delay={0}>Great ideas</Reveal>
              <Reveal delay={1}>deserve to be seen.</Reveal>
            </div>

            <div className="mt-9 grid gap-7 text-[1.02rem] leading-[1.68] text-ink-soft sm:grid-cols-2 sm:gap-10">
              <FadeUp delay={1}>
                <p>
                  Ezers &amp; Strategies began in {site.founded} in Nigeria with
                  a simple belief: great ideas deserve to be seen. Over a decade
                  later, that belief has taken us across borders &mdash; we now
                  operate out of both Nigeria and Canada, serving a growing
                  roster of start-ups, multinational organizations, and personal
                  brands.
                </p>
              </FadeUp>
              <FadeUp delay={2}>
                <p>
                  What hasn&rsquo;t changed is our approach. We&rsquo;re
                  strategic before we&rsquo;re creative &mdash; every logo,
                  campaign, and piece of content is built to solve a real
                  business problem.
                </p>
                <p className="mt-5">
                  We&rsquo;ve spent 12+ years learning what makes a brand
                  memorable in crowded markets. Now we bring that experience to
                  founders building something new, institutions protecting
                  decades of reputation, and individuals turning personal
                  influence into a business.
                </p>
              </FadeUp>
            </div>
          </div>
        </div>
      </div>

      {/* By the numbers, set large enough to be a graphic rather than a stat row. */}
      <div ref={ref} className="mt-16 overflow-hidden sm:mt-24">
        <motion.dl
          style={reduced ? undefined : { x }}
          className="flex w-max items-end gap-10 px-5 sm:gap-20 sm:px-8 lg:px-12"
        >
          {site.stats.map((stat, index) => (
            <div key={stat.label} className="flex items-end gap-4 sm:gap-7">
              <div>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-[clamp(4.5rem,15vw,13rem)] font-extrabold leading-[0.8] tracking-[-0.05em]">
                  {stat.value}
                </dd>
              </div>
              <p className="mb-2 max-w-[11ch] text-label uppercase text-ink-soft sm:mb-4">
                {stat.label}
              </p>
              {index < site.stats.length - 1 && (
                <span
                  aria-hidden
                  className="pill mb-4 hidden h-3 w-3 bg-blue sm:block"
                />
              )}
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
