"use client";

import { easeOutExpo } from "@/lib/motion";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * A small blue dot that follows the pointer and swells over interactive
 * elements. Only runs for fine pointers with motion enabled — everywhere
 * else the native cursor is left alone.
 */
export function Cursor() {
  const [active, setActive] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 900, damping: 45, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 900, damping: 45, mass: 0.4 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || calm.matches) return;

    document.documentElement.dataset.cursor = "on";

    const move = (event: PointerEvent) => {
      // Mount on first movement rather than in the effect body, so the dot
      // never renders at a stale position before the pointer is located.
      setActive(true);
      x.set(event.clientX);
      y.set(event.clientY);

      const target = (event.target as Element | null)?.closest<HTMLElement>(
        "a, button, [data-cursor-label]",
      );
      setHovering(Boolean(target));
      setLabel(target?.dataset.cursorLabel ?? null);
    };

    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      delete document.documentElement.dataset.cursor;
    };
  }, [x, y]);

  if (!active) return null;

  return (
    <motion.div
      aria-hidden
      style={{ x: springX, y: springY }}
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden md:block"
    >
      <motion.div
        animate={{
          width: label ? 96 : hovering ? 52 : 14,
          height: label ? 96 : hovering ? 52 : 14,
          backgroundColor: label || hovering ? "#0080c8" : "#0080c8",
          opacity: label || hovering ? 1 : 0.9,
        }}
        transition={{ duration: 0.28, ease: easeOutExpo }}
        className="pill -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-center text-[0.6rem] font-bold uppercase tracking-[0.1em] text-paper"
      >
        {label}
      </motion.div>
    </motion.div>
  );
}
