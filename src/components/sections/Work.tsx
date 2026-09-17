"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { motion } from "motion/react";
import { easeOutExpo } from "@/lib/motion";
import { pad } from "@/lib/pad";
import { useCalmMotion } from "@/lib/useCalmMotion";
import { clients, clientsIntro } from "@/data/clients";
import { ClientWall } from "@/components/work/ClientWall";
import { ClientGrid } from "@/components/work/ClientGrid";
import { Reveal } from "@/components/motion/Reveal";
import { MARK_HEX } from "@/components/work/BookLines";

/**
 * One line of the headline, with its marked words wrapped so the lines from
 * the team book can find them and colour them. Without the lines (phones,
 * tablets) the marks simply wear their colours.
 */
function MarkedLine({ line }: { line: string }) {
  const marks = clientsIntro.marks.filter((mark) => line.includes(mark.text));
  if (!marks.length) return <>{line}</>;
  const pattern = new RegExp(`(${marks.map((mark) => mark.text).join("|")})`);
  return (
    <>
      {line.split(pattern).map((part, index) => {
        const mark = marks.find((m) => m.text === part);
        if (!mark) return part;
        return (
          <span
            key={index}
            data-mark={mark.colour}
            data-side={mark.side}
            className="transition-colors duration-700"
            style={{ "--mark": MARK_HEX[mark.colour] } as CSSProperties}
          >
            <span className="max-lg:text-[var(--mark)]">{part}</span>
          </span>
        );
      })}
    </>
  );
}

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-12% 0px" },
} as const;

/**
 * Our Work, told through the clients: a wide wall of their logos to move
 * across, and an invitation at the end.
 *
 * The logos sit muted until one is picked, when it takes its own colours and
 * the rest step back.
 */
export function Work() {
  const calm = useCalmMotion();
  const [active, setActive] = useState<number | null>(null);

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="scroll-mt-24 overflow-hidden bg-paper pb-[clamp(6rem,12vw,11rem)] pt-[clamp(10rem,18vw,17rem)]"
    >
      <header className="mx-auto max-w-[1560px] px-5 text-center sm:px-8 lg:px-12">
        <motion.p {...reveal} transition={{ duration: 0.9, ease: easeOutExpo }} className="text-label uppercase text-ink-soft">
          {clientsIntro.eyebrow}
        </motion.p>
        <motion.h2
          {...reveal}
          id="work-heading"
          transition={{ duration: 1, delay: 0.08, ease: easeOutExpo }}
          className="mx-auto mt-6 max-w-[20ch] text-display leading-[1.12]! lg:max-w-none lg:text-[min(5.2rem,5.4vw)] lg:leading-[1.2]!"
        >
          {clientsIntro.titleLines.map((line, index) => (
            <span key={line} className="lg:block lg:whitespace-nowrap">
              <MarkedLine line={line} />
              {index < clientsIntro.titleLines.length - 1 && " "}
            </span>
          ))}
        </motion.h2>
      </header>

      {/* Metadata above the wall, and on desktop, how to see the rest. */}
      <div className="mx-auto mt-[clamp(5rem,9vw,8rem)] flex max-w-[1560px] items-baseline justify-between px-5 text-label uppercase text-ink-soft sm:px-8 lg:px-12">
        <p className="tabular-nums">
          {pad(clients.length)} clients · {clientsIntro.since}
        </p>
        {!calm && (
          <p aria-hidden className="hidden lg:block">
            Move across the wall <span className="text-orange">→</span>
          </p>
        )}
      </div>

      <div className="mt-[clamp(3rem,5vw,4.5rem)]">
        {!calm && (
          <div className="hidden lg:block">
            <ClientWall clients={clients} active={active} onSelect={setActive} />
          </div>
        )}
        <div className={calm ? "" : "lg:hidden"}>
          <ClientGrid clients={clients} active={active} onSelect={setActive} />
        </div>
      </div>

      {/* The invitation the wall builds to. */}
      <div className="mx-auto mt-[clamp(7rem,12vw,10rem)] max-w-[1560px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-6 border-t border-ink/15 pt-10 sm:flex-row sm:items-end sm:justify-between">
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
