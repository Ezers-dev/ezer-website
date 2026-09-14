"use client";

import { easeOutExpo } from "@/lib/motion";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useCalmMotion } from "@/lib/useCalmMotion";
import { services } from "@/data/services";
import { brandBg, onBrand, onBrandText } from "@/lib/colors";

/**
 * The section pins while four discipline panels swap through it, each owning a
 * logo colour. Under reduced motion or on small screens the panels simply
 * stack and scroll — same content, no pinning.
 */
export function Services() {
  const calm = useCalmMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(
      services.length - 1,
      Math.floor(value * services.length),
    );
    setActive(next);
  });

  if (calm) return <ServicesStacked />;

  const current = services[active];

  return (
    <section id="services" className="scroll-mt-0">
      <h2 className="sr-only">What we do</h2>

      {/* Tall track: one viewport of scroll per discipline. */}
      <div
        ref={ref}
        className="relative hidden md:block"
        style={{ height: `${services.length * 100}svh` }}
      >
        <div
          data-nav-theme={onBrand[current.color]}
          className={`sticky top-0 flex h-[100svh] flex-col overflow-hidden transition-colors duration-[900ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${brandBg[current.color]} ${onBrandText[current.color]}`}
        >
          <div className="relative mx-auto flex w-full max-w-[1560px] flex-1 flex-col px-5 pb-10 pt-28 sm:px-8 lg:px-12">
            <div className="flex items-baseline justify-between border-b border-current/25 pb-4">
              <p className="text-label uppercase opacity-70">What We Do</p>
              <p className="max-w-[44ch] text-right text-[0.85rem] leading-relaxed opacity-80">
                Four disciplines. One goal: making sure your brand shows up with
                clarity and consistency, everywhere it matters.
              </p>
            </div>

            {/* Oversized index, ghosted into the right half of the panel. */}
            <motion.span
              key={current.index}
              aria-hidden
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 0.14, y: 0 }}
              transition={{ duration: 1.1, ease: easeOutExpo }}
              className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[34vh] font-extrabold leading-none tracking-[-0.06em] sm:right-8 lg:right-12"
            >
              {current.index}
            </motion.span>

            <div className="relative flex flex-1 items-center">
              {services.map((service, index) => (
                <motion.article
                  key={service.title}
                  aria-hidden={index !== active}
                  animate={{
                    opacity: index === active ? 1 : 0,
                    y: index === active ? 0 : 42,
                  }}
                  transition={{ duration: 0.75, ease: easeOutExpo }}
                  className="absolute inset-0 flex flex-col justify-center"
                  style={{ pointerEvents: index === active ? "auto" : "none" }}
                >
                  <p className="text-label uppercase opacity-60">
                    {service.index} &mdash; {String(services.length).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 text-[clamp(3rem,9.5vw,9rem)] font-extrabold leading-[0.88] tracking-[-0.045em]">
                    {service.title}
                  </h3>
                  <div className="mt-7 max-w-[54ch] space-y-3 text-[clamp(1rem,1.5vw,1.3rem)] leading-[1.5] opacity-90">
                    <p className="font-semibold">{service.summary}</p>
                    {service.detail.map((paragraph) => (
                      <p key={paragraph} className="font-normal opacity-85">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </motion.article>
              ))}
            </div>

            <ol className="flex items-center gap-6 border-t border-current/25 pt-4">
              {services.map((service, index) => (
                <li
                  key={service.title}
                  className={`flex items-center gap-2 text-[0.82rem] font-semibold transition-opacity duration-500 ${
                    index === active ? "opacity-100" : "opacity-40"
                  }`}
                >
                  <span
                    className={`pill h-1.5 w-1.5 bg-current transition-transform duration-500 ${
                      index === active ? "scale-150" : "scale-100"
                    }`}
                  />
                  {service.title}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <ServicesStacked />
      </div>
    </section>
  );
}

/** Stacked fallback: mobile, and anyone with reduced motion on. */
function ServicesStacked() {
  return (
    <div id="services" className="scroll-mt-24">
      <div className="mx-auto max-w-[1560px] px-5 pb-6 pt-16 sm:px-8 lg:px-12">
        <p className="text-label uppercase text-ink-soft">What We Do</p>
        <p className="mt-4 max-w-[46ch] text-[1.05rem] leading-relaxed text-ink-soft">
          Four disciplines. One goal: making sure your brand shows up with
          clarity and consistency, everywhere it matters.
        </p>
      </div>
      {services.map((service) => (
        <article
          key={service.title}
          data-nav-theme={onBrand[service.color]}
          className={`px-5 py-14 sm:px-8 lg:px-12 ${brandBg[service.color]} ${onBrandText[service.color]}`}
        >
          <div className="mx-auto max-w-[1560px]">
            <p className="text-label uppercase opacity-60">{service.index}</p>
            <h3 className="mt-3 text-[clamp(2.5rem,11vw,4.5rem)] font-extrabold leading-[0.9] tracking-[-0.04em]">
              {service.title}
            </h3>
            <div className="mt-5 max-w-[52ch] space-y-3 text-[1.02rem] leading-[1.55]">
              <p className="font-semibold">{service.summary}</p>
              {service.detail.map((paragraph) => (
                <p key={paragraph} className="opacity-85">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
