"use client";

import { Media } from "@/components/Media";
import { FadeUp } from "@/components/motion/Reveal";
import type { Person } from "@/data/team";
import type { BrandColor } from "@/lib/colors";

export type TeamItem = Person & { ready: boolean };

const colors: BrandColor[] = ["blue", "pink", "green"];
/** Misaligned baselines — a row of three identical cards is the tell. */
const offsets = ["md:mt-0", "md:mt-20", "md:mt-8"];

export function Team({ items }: { items: TeamItem[] }) {
  return (
    <section id="team" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-[1560px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-6 border-b border-ink/12 pb-10 lg:grid-cols-12">
          <h2 className="text-display lg:col-span-7">
            The People
            <br />
            Behind Ezers
          </h2>
          <p className="max-w-[40ch] self-end text-[1.02rem] leading-relaxed text-ink-soft lg:col-span-4 lg:col-start-9">
            Small team, long tenure. The people who set the direction are the
            same people on the work.
          </p>
        </div>

        <ul className="mt-14 grid gap-12 md:grid-cols-3 md:gap-8">
          {items.map((person, index) => (
            <li key={person.name} className={offsets[index % offsets.length]}>
              <FadeUp delay={index}>
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Media
                    src={person.image}
                    alt={`Portrait of ${person.name}`}
                    ready={person.ready}
                    color={colors[index % colors.length]}
                    label={person.name}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <h3 className="mt-5 text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold leading-none tracking-[-0.035em]">
                  {person.name}
                </h3>
                <p className="mt-2 text-label uppercase text-blue">
                  {person.role}
                </p>
                <p className="mt-3 max-w-[34ch] text-[0.95rem] leading-relaxed text-ink-soft">
                  {person.bio}
                </p>
              </FadeUp>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
