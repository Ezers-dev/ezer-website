"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { easeInOutQuart } from "@/lib/motion";
import { Lockup } from "@/components/Logo";
import { nav } from "@/data/site";

export function Nav() {
  const [open, setOpen] = useState(false);
  /**
   * Which text colour the panel under the bar needs. "default" means the
   * ordinary paper page, where the bar gets its own translucent backdrop.
   */
  const [theme, setTheme] = useState<"default" | "paper" | "ink">("default");
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const read = () => {
      frame = 0;
      // Ask the document what sits directly behind the middle of the bar,
      // so the nav can invert over the coloured sections.
      const bar = barRef.current;
      const y = bar ? bar.getBoundingClientRect().bottom - 6 : 36;
      const behind = document
        .elementsFromPoint(24, y)
        .find((el) => el instanceof HTMLElement && el.dataset.navTheme) as
        | HTMLElement
        | undefined;
      const value = behind?.dataset.navTheme;
      setTheme(value === "paper" || value === "ink" ? value : "default");
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const onColor = theme !== "default" && !open;
  const light = onColor && theme === "paper";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          light ? "text-paper" : "text-ink"
        } ${!open && !onColor ? "nav-glass" : "bg-transparent"}`}
      >
        <div
          ref={barRef}
          className="mx-auto flex max-w-[1560px] items-center justify-between px-5 py-3.5 sm:px-8 sm:py-4.5 lg:px-12"
        >
          <Link href="/" aria-label="Ezers & Strategies — home" className="relative z-10">
            <Lockup color="blue" onDark={light} />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-9 md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative flex items-center py-1.5 text-[0.85rem] font-semibold tracking-[-0.01em]"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-current transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="relative z-10 -mr-2 flex h-11 w-11 flex-col items-center justify-center gap-[5px] md:hidden"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span
              className={`h-[2px] w-6 bg-current transition-transform duration-300 ${open ? "translate-y-[7px] rotate-45" : ""}`}
            />
            <span
              className={`h-[2px] w-6 bg-current transition-opacity duration-200 ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`h-[2px] w-6 bg-current transition-transform duration-300 ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ y: "-100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.6, ease: easeInOutQuart }}
            className="fixed inset-0 z-40 flex flex-col justify-end bg-blue-deep px-5 pb-16 pt-28 text-paper md:hidden"
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
