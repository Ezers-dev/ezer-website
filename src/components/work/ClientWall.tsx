"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import type { Client } from "@/data/clients";
import { LogoTile } from "./LogoTile";

/*
 * Where each logo hangs on the wall: its left edge and top edge as a share of
 * the wall, and its height as a share of the wall's height (the width follows
 * from the logo). Heavier marks get more height; square seals get more than
 * wide wordmarks so they carry similar weight. In reading order, left to
 * right, matching the client list.
 */
const LAYOUT = [
  { x: 3, y: 8, h: 13 },
  { x: 5, y: 70, h: 8 },
  { x: 22, y: 44, h: 30 },
  { x: 33, y: 10, h: 19 },
  { x: 41, y: 62, h: 12 },
  { x: 55, y: 30, h: 24 },
  { x: 66, y: 66, h: 15 },
  { x: 74, y: 6, h: 26 },
  { x: 83, y: 50, h: 11 },
  { x: 85, y: 76, h: 11 },
  { x: 88, y: 12, h: 28 },
];

/** The ease of the wall catching up with the pointer, per frame. */
const FOLLOW = 0.075;

type ClientWallProps = {
  clients: Client[];
  active: number | null;
  onSelect: (index: number | null) => void;
};

/**
 * The client wall: a field wider than the screen, with the logos hung across
 * it at different weights. It opens on its left-hand part, and the rest comes
 * into view as the visitor moves across it with the mouse, swipes, or tabs
 * through. The logos arrive left to right, then drift very slightly.
 */
export function ClientWall({ clients, active, onSelect }: ClientWallProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const wallRef = useRef<HTMLUListElement>(null);
  const shown = useInView(wallRef, { once: true, margin: "-15% 0px" });
  const target = useRef(0);
  const frame = useRef(0);

  // Glide the scroller towards `target`, and stop once it gets there.
  const glide = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    cancelAnimationFrame(frame.current);
    let current = scroller.scrollLeft;
    const step = () => {
      current += (target.current - current) * FOLLOW;
      if (Math.abs(target.current - current) < 0.5) current = target.current;
      scroller.scrollLeft = current;
      if (current !== target.current) frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
  };

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return (
    <div
      ref={scrollerRef}
      // Sideways swipes scroll the wall; up and down still scroll the page.
      data-lenis-prevent-horizontal
      // Following the mouse: the further right it is, the further along the
      // wall. The edges are dead zones, so the ends are easy to reach.
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse") return;
        const scroller = event.currentTarget;
        const box = scroller.getBoundingClientRect();
        const t = Math.min(1, Math.max(0, ((event.clientX - box.left) / box.width - 0.12) / 0.76));
        target.current = t * (scroller.scrollWidth - scroller.clientWidth);
        glide();
      }}
      className="overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div className="w-max px-[max(3rem,calc((100vw-1560px)/2+3rem))] pb-10">
      <ul
        ref={wallRef}
        aria-label="Clients"
        className="relative aspect-[16/4.6] w-[calc(min(100vw,1560px)*1.45)]"
      >
        {clients.map((client, index) => {
          const spot = LAYOUT[index % LAYOUT.length];
          return (
            <li key={client.name} className={`absolute ${active === index ? "z-10" : ""}`} style={{ left: `${spot.x}%`, top: `${spot.y}%`, height: `${spot.h}%` }}>
              <motion.div
                initial={{ opacity: 0, y: 18, scale: 0.96, clipPath: "inset(0% 100% 0% 0%)" }}
                animate={shown ? { opacity: 1, y: 0, scale: 1, clipPath: "inset(-60% -250% -250% -60%)" } : undefined}
                transition={{ duration: 1.1, delay: 0.15 + (spot.x / 100) * 1.3, ease: [0.16, 1, 0.3, 1] }}
                className="h-full"
              >
                {/* An almost still drift, each at its own pace. */}
                <div
                  className="wall-drift h-full"
                  style={{ animationDuration: `${14 + (index % 4) * 3}s`, animationDelay: `${-index * 2.3}s` }}
                >
                  <LogoTile
                    client={client}
                    index={index}
                    on={active === index}
                    dim={active !== null && active !== index}
                    onSelect={onSelect}
                    sizes="(min-width: 1024px) 22vw, 50vw"
                    className="h-full"
                  />
                </div>
              </motion.div>
            </li>
          );
        })}
      </ul>
      </div>
    </div>
  );
}
