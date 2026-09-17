"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import type { Client } from "@/data/clients";
import { pad } from "@/lib/pad";

type LogoTileProps = {
  client: Client;
  index: number;
  /** This logo is selected. */
  on: boolean;
  /** Another logo is selected, so this one steps back. */
  dim: boolean;
  onSelect: (index: number | null) => void;
  sizes: string;
  className?: string;
  style?: CSSProperties;
};

/**
 * One logo, set straight on the page. At rest it is muted to grey; selected
 * (hover, focus or tap) it takes its own colours, grows a touch, and a thin
 * frame draws round it like a designer picking out a piece of work, with its
 * index number and name beneath.
 */
export function LogoTile({ client, index, on, dim, onSelect, sizes, className = "", style }: LogoTileProps) {
  const byKeyboard = useRef(false);
  return (
    <button
      type="button"
      aria-label={client.name}
      aria-pressed={on}
      // A mouse selects on hover, the keyboard on focus, and a tap toggles.
      // Each ignores the others: a tap also fires hover and focus events.
      onPointerEnter={(event) => event.pointerType === "mouse" && onSelect(index)}
      onPointerLeave={(event) => event.pointerType === "mouse" && onSelect(null)}
      onPointerUp={(event) => event.pointerType !== "mouse" && onSelect(on ? null : index)}
      onFocus={(event) => {
        if (!event.currentTarget.matches(":focus-visible")) return;
        byKeyboard.current = true;
        onSelect(index);
      }}
      onBlur={() => {
        if (!byKeyboard.current) return;
        byKeyboard.current = false;
        onSelect(null);
      }}
      data-on={on || undefined}
      data-dim={dim || undefined}
      style={style}
      className={`group/logo relative block cursor-default outline-none ${className}`}
    >
      <Image
        src={client.logo}
        alt=""
        width={client.width}
        height={client.height}
        sizes={sizes}
        className="h-full w-auto max-w-none object-contain opacity-60 [filter:grayscale(1)_contrast(1.05)] transition-[filter,opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-data-[dim]/logo:opacity-25 group-data-[on]/logo:scale-[1.07] group-data-[on]/logo:opacity-100 group-data-[on]/logo:[filter:none]"
      />

      {/* The selection frame: each edge draws on in turn, clockwise. */}
      <span aria-hidden className="pointer-events-none absolute -inset-[clamp(0.6rem,1.2vw,1.1rem)]">
        <span className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-ink/45 transition-transform duration-300 ease-out group-data-[on]/logo:scale-x-100" />
        <span className="absolute inset-y-0 right-0 w-px origin-top scale-y-0 bg-ink/45 transition-transform duration-300 ease-out group-data-[on]/logo:scale-y-100 group-data-[on]/logo:delay-150" />
        <span className="absolute inset-x-0 bottom-0 h-px origin-right scale-x-0 bg-ink/45 transition-transform duration-300 ease-out group-data-[on]/logo:scale-x-100 group-data-[on]/logo:delay-300" />
        <span className="absolute inset-y-0 left-0 w-px origin-bottom scale-y-0 bg-ink/45 transition-transform duration-300 ease-out group-data-[on]/logo:scale-y-100 group-data-[on]/logo:delay-[450ms]" />
        {/* A registration tick at the top-left corner, once the frame closes. */}
        <svg
          viewBox="0 0 12 12"
          className="absolute -left-[7px] -top-[7px] h-3.5 w-3.5 opacity-0 transition-opacity duration-300 group-data-[on]/logo:opacity-100 group-data-[on]/logo:delay-[600ms]"
        >
          <path d="M6 0V12M0 6H12" className="stroke-blue-deep" strokeWidth={1.2} />
        </svg>
      </span>

      {/* Its place in the index, and whose it is. */}
      <span className="pointer-events-none absolute left-[calc(-1*clamp(0.6rem,1.2vw,1.1rem))] top-[calc(100%+clamp(0.6rem,1.2vw,1.1rem)+0.6rem)] w-max max-w-[9.5rem] text-left leading-snug lg:max-w-none lg:whitespace-nowrap text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ink-soft opacity-0 transition-[opacity,transform] duration-500 ease-out group-data-[on]/logo:translate-y-0 group-data-[on]/logo:opacity-100 translate-y-1">
        <span className="tabular-nums text-blue-deep">{pad(index + 1)}</span> — {client.name}
      </span>
    </button>
  );
}
