"use client";

import { easeOutExpo } from "@/lib/motion";

import Link from "next/link";
import { Media } from "@/components/Media";
import { Reveal } from "@/components/motion/Reveal";
import { motion, useReducedMotion } from "motion/react";
import type { Project } from "@/data/work";

export type WorkItem = Project & { ready: boolean };

const aspect = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[16/10]",
  square: "aspect-square",
} as const;

/** Deliberate offsets so the grid never reads as a uniform card wall. */
const layout = [
  "md:col-span-7",
  "md:col-span-5 md:mt-24",
  "md:col-span-5",
  "md:col-span-6 md:col-start-7 md:-mt-16",
  "md:col-span-6 md:mt-10",
  "md:col-span-5 md:col-start-8 md:mt-4",
];

export function Work({ items }: { items: WorkItem[] }) {
  const reduced = useReducedMotion();

  return (
    <section id="work" className="scroll-mt-24 bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-[1560px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-8 border-b border-ink/12 pb-10 lg:grid-cols-12">
          <h2 className="text-display lg:col-span-6">Our Work</h2>
          <p className="max-w-[48ch] self-end text-[1.02rem] leading-relaxed text-ink-soft lg:col-span-5 lg:col-start-8">
            A selection of brand identities, campaigns, and content built for
            clients across industries &mdash; from farm-fresh food brands to
            legal practices to government institutions.
          </p>
        </div>

        <ul className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-12">
          {items.map((project, index) => (
            <li key={project.slug} className={layout[index % layout.length]}>
              <Link
                href={`/work/${project.slug}`}
                data-cursor-label="View case"
                className="group block"
              >
                <motion.div
                  initial={reduced ? false : { opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-12% 0px" }}
                  transition={{ duration: 0.9, ease: easeOutExpo }}
                  className={`relative overflow-hidden ${aspect[project.aspect]}`}
                >
                  <div className="h-full w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]">
                    <Media
                      src={project.image}
                      alt={`${project.client} — ${project.title}`}
                      ready={project.ready}
                      color={project.color}
                      label={project.client}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </motion.div>

                <div className="mt-4 flex items-start justify-between gap-6">
                  <div>
                    <h3 className="text-[clamp(1.25rem,2vw,1.75rem)] font-extrabold tracking-[-0.03em]">
                      {project.client}
                    </h3>
                    <p className="mt-1 max-w-[38ch] text-[0.92rem] text-ink-soft">
                      {project.title}
                    </p>
                  </div>
                  <p className="shrink-0 text-label uppercase text-ink-soft">
                    {project.year}
                  </p>
                </div>

                <ul className="mt-3 flex flex-wrap gap-2">
                  {project.disciplines.map((discipline) => (
                    <li
                      key={discipline}
                      className="pill border border-ink/18 px-3 py-1 text-[0.7rem] font-semibold tracking-[0.04em] text-ink-soft"
                    >
                      {discipline}
                    </li>
                  ))}
                </ul>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-16 text-display">
          <Reveal>
            <span className="text-ink-soft">Your brand could be </span>
            <Link href="/#contact" className="text-blue hover:underline">
              next.
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
