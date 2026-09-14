"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { easeOutExpo } from "@/lib/motion";
import { Media } from "@/components/Media";
import { Reveal } from "@/components/motion/Reveal";
import type { Project } from "@/data/work";

export type WorkItem = Project & { ready: boolean };

/**
 * Projects run in pairs. Each pair puts a wide 4:3 frame beside a narrow
 * 4:5 one, then swaps sides for the next pair, so the column never reads as
 * a repeated card. Heights stay within a viewport at every width; on phones
 * everything drops to a single 4:3 column.
 */
const slots = [
  { cell: "md:col-span-7", frame: "aspect-[4/3]" },
  { cell: "md:col-span-4 md:col-start-9 md:mt-32", frame: "aspect-[4/3] md:aspect-[4/5]" },
  { cell: "md:col-span-4 md:mt-8", frame: "aspect-[4/3] md:aspect-[4/5]" },
  { cell: "md:col-span-7 md:col-start-6 md:-mt-12", frame: "aspect-[4/3]" },
];

export function Work({ items }: { items: WorkItem[] }) {
  return (
    <section id="work" className="scroll-mt-24 bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-[1560px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <h2 className="text-label uppercase text-ink-soft">
              <span className="pill mr-2 inline-block h-2 w-2 bg-orange align-middle" />
              Our Work
            </h2>
          </div>
          <p className="text-headline max-w-[22ch] lg:col-span-8 lg:col-start-5">
            <Reveal>Brand identities, campaigns</Reveal>
            <Reveal delay={1}>and content built for clients</Reveal>
            <Reveal delay={2}>
              <span className="text-ink-soft">across industries.</span>
            </Reveal>
          </p>
        </div>

        <ol className="mt-16 grid gap-y-16 md:grid-cols-12 md:gap-x-8 md:gap-y-4">
          {items.map((project, index) => {
            const slot = slots[index % slots.length];
            return (
              <li key={project.slug} className={slot.cell}>
                <Link
                  href={`/work/${project.slug}`}
                  data-cursor-label="View case"
                  className="group block"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 36 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10% 0px" }}
                    transition={{ duration: 0.9, ease: easeOutExpo }}
                    className={`relative overflow-hidden ${slot.frame}`}
                  >
                    <div className="h-full w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]">
                      <Media
                        src={project.image}
                        alt={`${project.client} — ${project.title}`}
                        ready={project.ready}
                        color={project.color}
                        label={project.sector}
                        sizes="(max-width: 768px) 100vw, 58vw"
                      />
                    </div>
                  </motion.div>

                  <div className="mt-5 flex gap-5 border-t border-ink/15 pt-4">
                    <span className="text-label pt-1.5 tabular-nums text-ink-soft">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-[clamp(1.35rem,2vw,1.85rem)] font-extrabold leading-[1.05] tracking-[-0.03em]">
                        {project.client}
                        <span
                          aria-hidden
                          className="ml-2 inline-block translate-x-0 text-blue opacity-0 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:opacity-100"
                        >
                          →
                        </span>
                      </h3>
                      <p className="mt-1.5 max-w-[42ch] text-[0.98rem] leading-snug text-ink-soft">
                        {project.title}
                      </p>
                      <p className="mt-3 text-label uppercase text-ink-soft">
                        {project.disciplines.join(" · ")}
                        <span className="mx-2 opacity-50">—</span>
                        {project.year}
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>

        <div className="mt-24 flex flex-col gap-6 border-t border-ink/15 pt-10 sm:flex-row sm:items-end sm:justify-between">
          <p className="text-display max-w-[14ch]">
            <Reveal>
              <span className="text-ink-soft">Your brand</span>
            </Reveal>
            <Reveal delay={1}>
              could be{" "}
              <Link href="/#contact" className="text-blue">
                next.
              </Link>
            </Reveal>
          </p>
          <Link
            href="/#contact"
            className="pill inline-flex w-fit items-center gap-2 bg-blue-deep px-6 py-3.5 text-[0.9rem] font-semibold text-paper transition-colors duration-300 hover:bg-ink"
          >
            Start a Project <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
