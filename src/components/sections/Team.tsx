"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { TeamBook } from "@/components/team/TeamBook";
import { TeamFlip } from "@/components/team/TeamFlip";
import type { BookPerson } from "@/components/team/faces";
import { useCalmMotion } from "@/lib/useCalmMotion";
import { teamClosing, teamCover } from "@/data/team";

export type TeamItem = BookPerson;

/*
 * Each plate has its own crop. Ebenezer and Annie are tall 2:3 shots, so the
 * anchor keeps their heads and gestures in; Muiz is square, so only the sides
 * are trimmed.
 */
const CROPS = ["50% 22%", "50% 30%", "50% 45%"];

/**
 * The team as a small chapter: a book on an orange cover, pinned while scroll
 * opens it and turns its pages to meet each person, then closes it on the
 * studio's last word.
 *
 * Desktop gets the two-page spread; phones and tablets get the book stood on
 * end. The book itself is decorative for assistive tech, which reads the same
 * content as plain text.
 */
export function Team({ items }: { items: TeamItem[] }) {
  const calm = useCalmMotion();
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: raw } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  // Derived before use, so opacity isn't handed to the browser's scroll
  // timeline, which mis-maps pinned tracks.
  const progress = useTransform(raw, (value) => value);
  const spin = useTransform(progress, [0, 1], [0, 360]);

  // The book rises into place as the chapter arrives, so it is already open
  // when the screen pins.
  const { scrollYProgress: arrivingRaw } = useScroll({ target: trackRef, offset: ["start 0.8", "start start"] });
  const arriving = useTransform(arrivingRaw, (value) => (calm ? 1 : value));
  const bookOpacity = useTransform(arriving, [0.1, 0.7], [0, 1]);
  const bookY = useTransform(arriving, [0, 1], [90, 0]);
  const bookScale = useTransform(arriving, [0, 1], [0.94, 1]);

  return (
    <section id="team" aria-labelledby="team-heading" className="relative scroll-mt-24 pt-[clamp(4rem,8vw,8rem)]">
      <div ref={trackRef} data-team-track className="relative h-[480svh] lg:h-[550svh]">
        <div data-team-stage className="sticky top-0 mx-auto flex h-[100svh] max-w-[1560px] flex-col px-5 pb-6 pt-[calc(72px+1.5rem)] sm:px-8 lg:px-12 lg:pb-10 lg:pt-[calc(83px+2.5rem)]">
          <motion.div
            aria-hidden
            style={{ opacity: bookOpacity, y: bookY, scale: bookScale }}
            className="min-h-0 flex-1 [container-type:size]"
          >
            <div className="hidden h-full items-center justify-center lg:flex">
              <TeamBook people={items} crops={CROPS} progress={progress} spin={spin} calm={calm} />
            </div>
            <div className="h-full lg:hidden">
              <TeamFlip people={items} crops={CROPS} progress={progress} spin={spin} calm={calm} />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="sr-only">
        <h2 id="team-heading">{teamCover.title}</h2>
        <p>{teamCover.subtitle}</p>
        <ol>
          {items.map((person) => (
            <li key={person.name}>
              <h3>{person.name}</h3>
              <p>{person.role}</p>
              <p>{person.bio}</p>
            </li>
          ))}
        </ol>
        <p>
          {teamClosing.statement} {teamClosing.signoff}
        </p>
      </div>
    </section>
  );
}
