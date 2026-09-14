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

const mask = {
  hidden: { y: "105%" },
  show: { y: "0%" },
};

/**
 * Mask-based reveal: the child slides up out of a clipped box.
 *
 * The viewport observer sits on the outer, unclipped wrapper and the inner
 * element only follows its variants. Observing the inner element directly
 * fails: once translated fully below the clip box it has no visible area,
 * so IntersectionObserver never reports it and the text stays hidden.
 *
 * Reduced motion is handled globally by MotionConfig.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <motion.span
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-8% 0px" }}
      className={`block overflow-hidden pb-[0.08em] ${className ?? ""}`}
    >
      <motion.span
        variants={mask}
        transition={{ duration: 1, delay: delay * 0.07, ease: easeOutExpo }}
        className="block will-change-transform"
      >
        {children}
      </motion.span>
    </motion.span>
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
