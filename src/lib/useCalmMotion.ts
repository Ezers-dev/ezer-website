"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * Whether the visitor asked for reduced motion.
 *
 * Deliberately reports false on the server and during hydration, then settles
 * on the real value — reading the media query during render would make the
 * first client paint disagree with the server HTML. Use it to switch markup
 * or frame loops; simple enter animations are handled globally by
 * MotionConfig reducedMotion="user" instead.
 */
export function useCalmMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
