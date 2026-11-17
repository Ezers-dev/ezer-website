import Image from "next/image";
import type { Person } from "@/data/team";
import { teamIntro } from "@/data/team";

export type TeamItem = Person & { ready: boolean };

/*
 * Each portrait keeps the same 4:5 frame but its own crop. Eben and Annie are
 * tall 2:3 shots, so the frame trims top and bottom and the anchor keeps their
 * heads and gestures in; Muiz is square, so only the sides are trimmed.
 */
const CROPS = ["50% 22%", "50% 32%", "50% 50%"];

/**
 * The team, shown straight away: three portraits side by side, each with a
 * name, a role and a line about what that person does. Nothing here moves.
 */
export function Team({ items }: { items: TeamItem[] }) {
  return (
    <section id="team" aria-labelledby="team-heading" className="scroll-mt-24 pt-[clamp(5rem,9vw,8rem)]">
      <div className="mx-auto max-w-[1560px] px-5 sm:px-8 lg:px-12">
        <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <h2 id="team-heading" className="text-display">
            {teamIntro.title}
          </h2>
          <p className="max-w-[30ch] text-lede font-medium text-ink-soft lg:pb-2 lg:text-right">{teamIntro.subtitle}</p>
        </header>

        <ol className="mt-[clamp(2.5rem,5vw,4.5rem)] grid gap-y-14 md:grid-cols-2 md:gap-x-[clamp(1.5rem,3vw,3rem)] lg:grid-cols-3">
          {items.map((person, index) => {
            return (
              <li key={person.name} className="flex flex-col">
                <div className="relative aspect-[4/5] overflow-hidden bg-paper-dim">
                  {person.ready ? (
                    <Image
                      src={person.image}
                      alt={`Portrait of ${person.name}, ${person.role}`}
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                      style={{ objectPosition: CROPS[index % CROPS.length] }}
                      className="object-cover"
                    />
                  ) : (
                    <div role="img" aria-label={`Portrait of ${person.name}`} className="h-full w-full" />
                  )}
                </div>
                <h3 className="mt-6 text-[clamp(2rem,3.2vw,2.75rem)] font-extrabold leading-none tracking-[-0.035em]">
                  {person.name}
                </h3>
                <p className="mt-2.5 text-[0.95rem] font-semibold">{person.role}</p>
                <p className="mt-4 max-w-[36ch] text-[1rem] leading-[1.65] text-ink-soft">{person.bio}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
