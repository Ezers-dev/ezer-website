"use client";

import { easeInOutQuart } from "@/lib/motion";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Lockup } from "@/components/Logo";
import { Magnetic } from "@/components/motion/Magnetic";
import { nav } from "@/data/site";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [lifted, setLifted] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          lifted && !open ? "bg-paper/85 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-[1560px] items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
          <Link href="/" aria-label="Ezers & Strategies — home" className="relative z-10">
            <Lockup color="blue" />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-9 md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative text-[0.82rem] font-semibold tracking-[-0.01em]"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-blue transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
              </Link>
            ))}
            <Magnetic>
              <Link
                href="/#contact"
                className="pill inline-flex items-center gap-2 bg-blue px-5 py-2.5 text-[0.82rem] font-semibold text-paper transition-colors duration-300 hover:bg-ink"
              >
                Start a Project
                <span aria-hidden>→</span>
              </Link>
            </Magnetic>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="relative z-10 flex h-10 w-10 flex-col items-center justify-center gap-[5px] md:hidden"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span
              className={`h-[2px] w-6 bg-ink transition-transform duration-300 ${open ? "translate-y-[7px] rotate-45" : ""}`}
            />
            <span
              className={`h-[2px] w-6 bg-ink transition-opacity duration-200 ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`h-[2px] w-6 bg-ink transition-transform duration-300 ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={reduced ? { opacity: 0 } : { y: "-100%" }}
            animate={reduced ? { opacity: 1 } : { y: "0%" }}
            exit={reduced ? { opacity: 0 } : { y: "-100%" }}
            transition={{ duration: 0.6, ease: easeInOutQuart }}
            className="fixed inset-0 z-40 flex flex-col justify-end bg-blue px-5 pb-16 pt-28 text-paper md:hidden"
          >
            <nav aria-label="Mobile" className="flex flex-col gap-2">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-[clamp(2.25rem,11vw,3.5rem)] font-extrabold leading-[1.02] tracking-[-0.035em]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
