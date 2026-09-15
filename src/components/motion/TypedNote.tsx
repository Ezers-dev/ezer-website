"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { easeOutExpo } from "@/lib/motion";
import { useCalmMotion } from "@/lib/useCalmMotion";

type TypedNoteProps = {
  /** What appears on screen, one character at a time. */
  text: string;
  /** The full message for assistive tech, if it should say more than `text`. */
  label?: string;
  /** Opens the box and starts writing; clearing it wipes the note away. */
  active: boolean;
  /** Seconds to wait before the box opens, e.g. for a sign to land first. */
  delay?: number;
  /** Milliseconds per character, before a little human unevenness. */
  pace?: number;
  className?: string;
};

/**
 * A yellow note that writes itself out slowly.
 *
 * The box wipes open from the left, then the text types in with a slightly
 * uneven rhythm and a caret. The whole sentence is laid out from the start
 * with the unwritten part transparent, so the box never grows and lines
 * never re-wrap as characters appear. With reduced motion it shows complete.
 */
export function TypedNote({
  text,
  label,
  active,
  delay = 0,
  pace = 58,
  className = "",
}: TypedNoteProps) {
  const calm = useCalmMotion();
  const [written, setWritten] = useState(0);

  useEffect(() => {
    // State updates happen in timer callbacks, never synchronously here.
    if (!active) {
      const frame = requestAnimationFrame(() => setWritten(0));
      return () => cancelAnimationFrame(frame);
    }
    if (calm) {
      const frame = requestAnimationFrame(() => setWritten(text.length));
      return () => cancelAnimationFrame(frame);
    }

    let count = 0;
    let timer: ReturnType<typeof setTimeout>;
    const writeNext = () => {
      count += 1;
      setWritten(count);
      if (count >= text.length) return;
      // A beat longer after spaces and line breaks, so words land as words.
      const pause = /\s/.test(text[count - 1]) ? pace * 0.8 : 0;
      timer = setTimeout(writeNext, pace + pause + Math.random() * pace * 0.65);
    };
    // Let the box finish opening before the first character.
    timer = setTimeout(writeNext, delay * 1000 + 520);
    return () => clearTimeout(timer);
  }, [active, calm, delay, pace, text]);

  const done = written >= text.length;

  return (
    <motion.p
      initial={false}
      animate={
        active
          ? { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }
          : { opacity: 0, clipPath: "inset(0% 100% 0% 0%)" }
      }
      transition={
        active
          ? { duration: calm ? 0 : 0.55, delay: calm ? 0 : delay, ease: easeOutExpo }
          : { duration: calm ? 0 : 0.3 }
      }
      className={`bg-yellow px-5 py-4 text-ink shadow-[0_16px_28px_-16px_rgb(11_16_19_/_0.4)] sm:px-6 sm:py-5 ${className}`}
    >
      <span className="sr-only">{label ?? text}</span>
      <span aria-hidden>
        {text.slice(0, written)}
        {/* Zero-width anchor, so the caret never pushes the text around. */}
        <span className="relative inline-block w-0">
          <span
            className={`absolute left-0.5 top-[-0.9em] h-[1.1em] w-[2px] bg-ink ${
              active && !done ? "animate-[caret_0.9s_steps(1)_infinite]" : "opacity-0 transition-opacity delay-700 duration-500"
            }`}
          />
        </span>
        <span className="text-transparent">{text.slice(written)}</span>
      </span>
    </motion.p>
  );
}
