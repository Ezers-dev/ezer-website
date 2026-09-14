"use client";

import Image from "next/image";
import { Marquee } from "@/components/motion/Marquee";
import { Reveal } from "@/components/motion/Reveal";
import type { Client } from "@/data/clients";

export type ClientItem = Client & { ready: boolean };

/** Falls back to a typeset wordmark so the row reads as intentional. */
function ClientLogo({ client }: { client: ClientItem }) {
  return (
    <span className="mx-6 flex h-20 shrink-0 items-center sm:mx-10">
      {client.ready && client.logo ? (
        <Image
          src={client.logo}
          alt={client.name}
          width={180}
          height={56}
          className="h-9 w-auto object-contain opacity-70 transition-opacity duration-500 hover:opacity-100"
        />
      ) : (
        <span className="whitespace-nowrap text-[clamp(1.1rem,2vw,1.8rem)] font-extrabold tracking-[-0.03em] text-ink/60 transition-colors duration-500 hover:text-ink">
          {client.name}
        </span>
      )}
    </span>
  );
}

export function Clients({ items }: { items: ClientItem[] }) {
  const half = Math.ceil(items.length / 2);
  const rows = [items.slice(0, half), items.slice(half)];

  return (
    <section className="border-y border-ink/12 bg-paper-dim/40 py-16 sm:py-20">
      <div className="mx-auto grid max-w-[1560px] gap-5 px-5 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-12">
        <h2 className="text-label uppercase text-ink-soft lg:col-span-3">
          <span className="pill mr-2 inline-block h-2 w-2 bg-green align-middle" />
          Who We&rsquo;ve Worked With
        </h2>
        <p className="max-w-[46ch] text-[1.05rem] leading-relaxed text-ink-soft lg:col-span-6 lg:col-start-5">
          Trusted by organizations across sectors and continents &mdash; from
          global corporations to government institutions to growing local
          brands.
        </p>
      </div>

      <div className="mt-10 space-y-1">
        {rows.map((row, index) => (
          <Marquee key={index} speed={index === 0 ? 34 : -34}>
            <span className="flex">
              {row.map((client) => (
                <ClientLogo key={client.name} client={client} />
              ))}
            </span>
          </Marquee>
        ))}
      </div>

      <div className="mx-auto mt-10 grid max-w-[1560px] px-5 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-12">
        <p className="text-headline max-w-[26ch] lg:col-span-8 lg:col-start-5">
          <Reveal>
            <span className="text-blue">150+</span>
            <span className="text-ink"> startups and individual brands,</span>
          </Reveal>
          <Reveal delay={1}>
            <span className="text-ink-soft">
              partnered with to build their first &mdash; or next &mdash; visual
              identity.
            </span>
          </Reveal>
        </p>
      </div>
    </section>
  );
}
