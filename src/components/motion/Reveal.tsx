"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { easeOutExpo } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  /** Stagger position. Each step adds 70ms. */
  delay?: number;
  className?: string;
};

/**
 * Mask-based reveal: the child slides up out of a clipped box.
 * Both elements are inline spans made block, so it nests legally inside
 * headings and paragraphs as well as at block level.
 *
 * The reduced-motion case is handled globally by MotionConfig, which drops
 * the transform and leaves the text sitting where it belongs.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <span className={`block overflow-hidden pb-[0.08em] ${className ?? ""}`}>
      <motion.span
        initial={{ y: "105%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true, margin: "-8% 0px" }}
        transition={{ duration: 1, delay: delay * 0.07, ease: easeOutExpo }}
        className="block will-change-transform"
      >
        {children}
      </motion.span>
    </span>
  );
}

/** Softer fade-and-rise, for blocks that shouldn't be clipped. */
export function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, delay: delay * 0.07, ease: easeOutExpo }}
    >
      {children}
    </motion.div>
  );
}
