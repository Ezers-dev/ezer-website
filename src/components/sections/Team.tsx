"use client";

import { Media } from "@/components/Media";
import { FadeUp, Reveal } from "@/components/motion/Reveal";
import type { Person } from "@/data/team";
import type { BrandColor } from "@/lib/colors";

export type TeamItem = Person & { ready: boolean };

const colors: BrandColor[] = ["blue", "pink", "green"];

/**
 * People as a ruled list, not a row of cards: a small square portrait,
 * the name at display size, and the bio set to the right. On phones the
 * portrait and name sit side by side with the bio beneath.
 */
export function Team({ items }: { items: TeamItem[] }) {
  return (
    <section id="team" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-[1560px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <h2 className="text-label uppercase text-ink-soft">
              <span className="pill mr-2 inline-block h-2 w-2 bg-blue align-middle" />
              The People Behind Ezers
            </h2>
          </div>
          <p className="text-headline max-w-[20ch] lg:col-span-8 lg:col-start-5">
            <Reveal>Small team, long tenure.</Reveal>
            <Reveal delay={1}>
              <span className="text-ink-soft">
                The people who set the direction are the people on the work.
              </span>
            </Reveal>
          </p>
        </div>

        <ol className="mt-16 border-t border-ink/15">
          {items.map((person, index) => (
            <li key={person.name} className="border-b border-ink/15">
              <FadeUp delay={index}>
                <div className="grid gap-x-8 gap-y-5 py-8 sm:py-10 md:grid-cols-12 md:items-center">
                  <span className="hidden text-label tabular-nums text-ink-soft md:col-span-1 md:block">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="flex items-center gap-5 md:col-span-6 md:gap-8">
                    <div className="relative aspect-square w-24 shrink-0 overflow-hidden sm:w-32 lg:w-40">
                      <Media
                        src={person.image}
                        alt={`Portrait of ${person.name}`}
                        ready={person.ready}
                        color={colors[index % colors.length]}
                        label=""
                        sizes="160px"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-[clamp(1.9rem,4vw,3.75rem)] font-extrabold leading-[0.95] tracking-[-0.04em]">
                        {person.name}
                      </h3>
                      <p className="mt-2 text-label uppercase text-blue">
                        {person.role}
                      </p>
                    </div>
                  </div>

                  <p className="max-w-[40ch] text-[1rem] leading-relaxed text-ink-soft md:col-span-4 md:col-start-9">
                    {person.bio}
                  </p>
                </div>
              </FadeUp>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
