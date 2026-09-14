"use client";

import { useSyncExternalStore } from "react";

/**
 * Hydration-safe media query: reports false on the server and during
 * hydration, then the real match. For layout decisions that need to agree
 * with the server HTML on first paint.
 */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
