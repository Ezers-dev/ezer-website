"use client";

import Image from "next/image";
import { motion, useTransform, type MotionValue } from "motion/react";
import type { Person } from "@/data/team";
import { teamClosing, teamCover } from "@/data/team";
import { pad } from "./timeline";

/*
 * The printed faces of the book's pages. Everything is sized in container
 * units, so the type and marks scale with the book rather than the window.
 * The book is decorative for assistive tech (the section carries the same
 * content as text), so images here have empty alt text.
 */

export type BookPerson = Person & { ready: boolean };

const small = "text-[max(0.6rem,1.8cqw)] font-semibold uppercase tracking-[0.2em] text-ink-soft";

/** Printer's crop marks, just outside each corner of the box they sit in. */
export function CropMarks({ className = "" }: { className?: string }) {
  const corners = [
    "left-0 top-0 -translate-x-full -translate-y-full",
    "right-0 top-0 translate-x-full -translate-y-full -scale-x-100",
    "left-0 bottom-0 -translate-x-full translate-y-full -scale-y-100",
    "right-0 bottom-0 translate-x-full translate-y-full -scale-100",
  ];
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 ${className}`}>
      {corners.map((corner) => (
        <svg key={corner} viewBox="0 0 12 12" className={`absolute h-[max(9px,2.4cqw)] w-[max(9px,2.4cqw)] overflow-visible ${corner}`}>
          {/* Each tick continues one edge of the box, stopping short of the corner. */}
          <path d="M0 12H8M12 0V8" className="stroke-ink/35" strokeWidth={0.8} fill="none" />
        </svg>
      ))}
    </div>
  );
}

/** A registration mark, turning slowly with the scroll. */
export function Registration({ spin, className = "" }: { spin: MotionValue<number>; className?: string }) {
  return (
    <motion.svg aria-hidden viewBox="0 0 24 24" style={{ rotate: spin }} className={`shrink-0 ${className}`}>
      <circle cx="12" cy="12" r="6" fill="none" className="stroke-ink/40" strokeWidth={0.9} />
      <circle cx="12" cy="12" r="2.2" className="fill-ink/40" />
      <path d="M12 1v22M1 12h22" className="stroke-ink/40" strokeWidth={0.9} />
    </motion.svg>
  );
}

type PortraitProps = { person: BookPerson; index: number; crop: string; sizes: string };

/** A plate: the portrait, nearly to the page edges, with a folio beneath. */
export function PortraitFace({ person, index, crop, sizes }: PortraitProps) {
  return (
    <div className="@container relative h-full bg-paper px-[6%] pb-[11%] pt-[6%]">
      <div className="relative h-full w-full">
        <div className="absolute inset-0 overflow-hidden bg-paper-dim">
          {person.ready && (
            <Image src={person.image} alt="" fill sizes={sizes} style={{ objectPosition: crop }} className="object-cover" />
          )}
        </div>
        <CropMarks />
      </div>
      <div className={`absolute inset-x-[6%] bottom-[4%] flex justify-between ${small}`}>
        <span>Ezers &amp; Strategies</span>
        <span className="tabular-nums">Plate {pad(index + 1)}</span>
      </div>
    </div>
  );
}

type DetailsProps = {
  person: BookPerson;
  index: number;
  count: number;
  spin: MotionValue<number>;
  /** Just the words, without the page around them (small screens). */
  bare?: boolean;
};

/** Book pagination, e.g. "02 / 03". */
function Pagination({ index, count }: { index: number; count: number }) {
  return (
    <p className={`tabular-nums ${small}`}>
      {pad(index + 1)} / {pad(count)}
    </p>
  );
}

/** The facing page: number, name, role and a line about the person. */
export function DetailsFace({ person, index, count, spin, bare = false }: DetailsProps) {
  return (
    <div className={`@container relative flex flex-col ${bare ? "" : "h-full bg-paper px-[11%] pb-[7%] pt-[9%]"}`}>
      {!bare && (
        <div className="flex items-start justify-between">
          <p className={small}>{teamCover.title}</p>
          <Registration spin={spin} className="w-[max(14px,4.4cqw)]" />
        </div>
      )}
      <div className="mt-auto">
        {bare && (
          <div className="mb-1 flex justify-end">
            <Pagination index={index} count={count} />
          </div>
        )}
        <p className={`${bare ? "text-[clamp(2.25rem,11cqw,3.5rem)]" : "text-[14cqw]"} font-extrabold leading-[0.9] tracking-[-0.045em] text-ink`}>
          {person.name}
        </p>
        <p className={`${bare ? "mt-3" : "mt-[5cqw]"} text-[max(0.9rem,3.3cqw)] font-bold text-ink`}>{person.role}</p>
        <p className={`${bare ? "mt-1.5 leading-[1.5]" : "mt-[2.5cqw] leading-[1.6]"} max-w-[34ch] text-[max(0.9rem,3.2cqw)] text-ink-soft`}>
          {person.bio}
        </p>
      </div>
      {!bare && (
        <div className="mt-[10cqw] self-end">
          <Pagination index={index} count={count} />
        </div>
      )}
    </div>
  );
}


const coverLabel = "text-[max(0.6rem,1.9cqw)] font-bold uppercase tracking-[0.2em] text-ink/75";

/** The front cover, in the brand orange: the book's title. */
export function FrontCoverFace() {
  return (
    <div className="@container relative flex h-full flex-col justify-between bg-orange px-[10%] py-[10%] text-ink">
      <p className={coverLabel}>Ezers &amp; Strategies</p>
      <div>
        <p className="text-[21cqw] font-extrabold leading-[0.88] tracking-[-0.05em]">{teamCover.title}</p>
        <p className="mt-[6cqw] max-w-[22ch] text-[max(0.95rem,4.6cqw)] font-semibold leading-[1.3]">{teamCover.subtitle}</p>
      </div>
      <p className={`tabular-nums ${coverLabel}`}>The people · 01–03</p>
    </div>
  );
}

/** The back cover, where the chapter's last words come up once it closes. */
export function BackCoverFace({ reveal }: { reveal: MotionValue<number> }) {
  const rise = useTransform(reveal, [0, 1], [18, 0]);
  return (
    <div className="@container relative flex h-full flex-col justify-between bg-orange px-[10%] py-[10%] text-ink">
      <p className={coverLabel}>Ezers &amp; Strategies</p>
      <motion.div style={{ opacity: reveal, y: rise }}>
        <p className="text-[11cqw] font-extrabold leading-[0.95] tracking-[-0.04em]">{teamClosing.statement}</p>
        <p className="mt-[6cqw] text-[max(0.95rem,4.2cqw)] font-semibold leading-[1.3]">{teamClosing.signoff}</p>
      </motion.div>
      <p className={coverLabel}>{teamCover.title}</p>
    </div>
  );
}
