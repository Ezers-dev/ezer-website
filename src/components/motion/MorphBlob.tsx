"use client";

import { useSyncExternalStore } from "react";
import { motion } from "motion/react";
import { BLOB_VIEWBOX, blobStates, blobStill } from "@/lib/blob";
import { useCalmMotion } from "@/lib/useCalmMotion";

/** Loop length in seconds. */
const DURATION = 10;

// Rough → resolved across the first ~78% of the loop, then a longer, eased
// return to the start so the repeat has no visible seam.
const keyframes = [...blobStates, blobStates[0]];
const times = [0, 0.19, 0.39, 0.59, 0.78, 1];

const noop = () => () => {};

/**
 * Decorative background shape that morphs from an irregular blob toward a
 * squircle and back. It renders only after hydration: it carries no content,
 * and skipping it on the server keeps floating-point path strings out of the
 * hydration comparison entirely.
 */
export function MorphBlob({ className = "" }: { className?: string }) {
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  const calm = useCalmMotion();

  if (!hydrated) return null;

  return (
    <motion.svg
      aria-hidden
      focusable="false"
      viewBox={BLOB_VIEWBOX}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.6, ease: "easeOut" }}
      className={`pointer-events-none select-none ${className}`}
    >
      <defs>
        <linearGradient id="hero-blob-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.55" />
        </linearGradient>
      </defs>

      {calm ? (
        <path d={blobStill} fill="url(#hero-blob-fill)" />
      ) : (
        <motion.path
          fill="url(#hero-blob-fill)"
          initial={{ d: blobStates[0] }}
          animate={{ d: keyframes }}
          transition={{
            duration: DURATION,
            times,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop",
          }}
        />
      )}
    </motion.svg>
  );
}
