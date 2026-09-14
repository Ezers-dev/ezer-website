"use client";

import { easeOutExpo } from "@/lib/motion";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Stagger position. Each step adds 70ms. */
  delay?: number;
  className?: string;
  as?: "div" | "span" | "li";
};

/**
 * Mask-based reveal: the child slides up out of a clipped box.
 * Animates transform only, so it never shifts layout.
 */
export function Reveal({ children, delay = 0, className, as = "div" }: RevealProps) {
  const reduced = useReducedMotion();
  const Tag = motion[as];

  if (reduced) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <span className={`block overflow-hidden ${className ?? ""}`}>
      <Tag
        initial={{ y: "105%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true, margin: "-12% 0px" }}
        transition={{
          duration: 1,
          delay: delay * 0.07,
          ease: easeOutExpo,
        }}
        className="block will-change-transform"
      >
        {children}
      </Tag>
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
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

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
