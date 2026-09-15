"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { easeOutExpo } from "@/lib/motion";
import { DriftMark } from "@/components/team/DriftMark";
import type { Person } from "@/data/team";

export type TeamItem = Person & { ready: boolean };

/*
 * Each portrait keeps the same 4:5 frame but its own crop. Ebenezer and Annie
 * are tall 2:3 shots, so the frame trims top and bottom and the anchor keeps
 * their heads and gestures in; Buruwa is square, so only the sides are trimmed.
 */
const CROPS = ["50% 22%", "50% 32%", "50% 50%"];

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-12% 0px" },
} as const;

function Member({ person, index }: { person: TeamItem; index: number }) {
  const delay = index * 0.18;

  return (
    <motion.article
      initial={{ opacity: 0, x: -18 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 1.1, delay, ease: easeOutExpo }}
      className="group/member"
    >
      {/* Dimming lives on this inner wrapper: the entrance animation writes
          opacity inline on the article, which would override a class there. */}
      <div className="flex flex-col transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:[@media(hover:hover)]:group-hover/team:opacity-[0.82] lg:[@media(hover:hover)]:group-hover/member:!opacity-100">
        {/* Heading first in the document; on phones it sits above the portrait,
            from tablet up it moves below it. */}
        <header className="order-1 md:order-2 md:mt-7">
          <p className="text-label tabular-nums text-ink-soft">{String(index + 1).padStart(2, "0")}</p>
          <h3 className="mt-3 text-[clamp(2rem,3.2vw,2.75rem)] font-bold leading-none tracking-[-0.035em] transition-colors duration-500 lg:[@media(hover:hover)]:group-hover/team:text-ink-soft lg:[@media(hover:hover)]:group-hover/member:!text-ink">
            {person.name}
          </h3>
        </header>

        <div className="relative order-2 mt-6 aspect-[4/5] overflow-hidden bg-paper-dim md:order-1 md:mt-0">
          {/* Entrance: the crop settles a few pixels as the portrait arrives. */}
          <motion.div
            initial={{ scale: 1.07, y: "2.5%" }}
            whileInView={{ scale: 1, y: "0%" }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 1.6, delay, ease: easeOutExpo }}
            className="absolute inset-0"
          >
            {person.ready ? (
              <Image
                src={person.image}
                alt={`Portrait of ${person.name}, ${person.role}`}
                fill
                sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                style={{ objectPosition: CROPS[index % CROPS.length] }}
                className="object-cover transition-[transform,filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/member:translate-x-[3px] group-hover/member:scale-[1.02] group-hover/member:[filter:contrast(1.04)_saturate(1.04)]"
              />
            ) : (
              <div role="img" aria-label={`Portrait of ${person.name}`} className="h-full w-full bg-paper-dim" />
            )}
          </motion.div>
        </div>

        <div className="order-3">
          <p className="mt-5 text-[0.95rem] font-semibold tracking-[-0.005em] md:mt-2.5">{person.role}</p>
          <p className="mt-5 max-w-[34ch] text-[1rem] leading-[1.7] text-ink-soft">{person.bio}</p>
        </div>
      </div>
    </motion.article>
  );
}

/**
 * "The people behind Ezers" as an editorial spread: a quiet intro, three
 * large portraits with room around them, and one small mark that drifts
 * through the whitespace beneath. Space, photography and type do the work.
 */
export function Team({ items }: { items: TeamItem[] }) {
  return (
    <section
      id="team"
      aria-labelledby="team-heading"
      className="scroll-mt-24 pb-[clamp(6rem,12vw,11rem)] pt-[clamp(6rem,12vw,11rem)]"
    >
      <div className="mx-auto max-w-[1560px] px-5 sm:px-8 lg:px-12">
        <header className="max-w-[60rem]">
          <motion.p {...reveal} transition={{ duration: 0.9, ease: easeOutExpo }} className="text-label uppercase text-ink-soft">
            The People
          </motion.p>
          <motion.h2
            {...reveal}
            id="team-heading"
            transition={{ duration: 1, delay: 0.08, ease: easeOutExpo }}
            className="mt-6 text-display"
          >
            Small team, long tenure.
          </motion.h2>
          <motion.p
            {...reveal}
            transition={{ duration: 1, delay: 0.16, ease: easeOutExpo }}
            className="mt-7 max-w-[34ch] text-lede font-medium"
          >
            The people who set the direction are the people on the work.
          </motion.p>
        </header>

        <div className="relative mt-[clamp(5rem,9vw,8.5rem)]">
          {/* Phones: the mark drifts down the gutter beside the list. */}
          <DriftMark direction="vertical" className="absolute -left-4 bottom-0 top-0 w-3 sm:-left-6 md:hidden" />

          <div className="group/team grid gap-y-[clamp(5rem,16vw,7rem)] md:grid-cols-2 md:gap-x-[clamp(2rem,4vw,4rem)] md:gap-y-20 lg:grid-cols-3">
            {items.map((person, index) => (
              <Member key={person.name} person={person} index={index} />
            ))}
          </div>

          {/* Desktop: the mark drifts left to right beneath the three people. */}
          <DriftMark direction="horizontal" className="mt-16 hidden h-10 lg:block" />
        </div>

        <motion.p
          {...reveal}
          transition={{ duration: 1, ease: easeOutExpo }}
          className="mt-10 text-right text-[0.9rem] font-medium text-ink-soft lg:mt-4"
        >
          Three disciplines. One studio.
        </motion.p>
      </div>
    </section>
  );
}
