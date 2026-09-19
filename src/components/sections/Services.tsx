"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useCalmMotion } from "@/lib/useCalmMotion";
import { services } from "@/data/services";
import { panelBg, panelHex, onBrand, onBrandText } from "@/lib/colors";
import { hexToOklch, mixOklch } from "@/lib/oklch";

const COUNT = services.length;
/** Share of the whole track given to one discipline. */
const SEGMENT = 1 / COUNT;
/**
 * Half-width of each hand-over, in track progress. The outgoing discipline
 * leaves over the scroll just before a boundary and the next arrives over
 * the scroll just after it — roughly a third of a screen either side.
 */
const HANDOVER = 0.075;

const TEXT_HEX = { paper: "#f6f5f2", ink: "#0b1013" } as const;
/**
 * How far the incoming copy starts before the boundary (and the outgoing
 * copy ends after it), so the panel is never completely empty mid-swap.
 */
const OVERLAP = 0.005;

const PANEL_LCH = services.map((service) => hexToOklch(panelHex[service.color]));
const PANEL_HEX = services.map((service) => panelHex[service.color]);

/**
 * Background colour at a point in the track: each discipline's colour held
 * through its segment, blended through OKLCH across the hand-over so the
 * midpoint stays vivid instead of greying out.
 */
function backgroundAt(value: number) {
  const scaled = Math.min(COUNT, Math.max(0, value * COUNT));
  const boundary = Math.round(scaled);
  const distance = (scaled - boundary) / COUNT;
  if (boundary <= 0 || boundary >= COUNT || Math.abs(distance) >= HANDOVER) {
    return PANEL_HEX[Math.min(COUNT - 1, Math.floor(scaled))];
  }
  const t = (distance + HANDOVER) / (2 * HANDOVER);
  // Ease the blend so it lingers on each colour and moves through the middle.
  const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
  return mixOklch(PANEL_LCH[boundary - 1], PANEL_LCH[boundary], eased);
}

/**
 * Text colour flips cleanly at each boundary rather than blending: a blend
 * from white to ink passes through grey, which is unreadable on any panel.
 */
function foregroundAt(value: number) {
  const index = Math.min(COUNT - 1, Math.max(0, Math.floor(value * COUNT)));
  return TEXT_HEX[onBrand[services[index].color]];
}

/**
 * Opacity and vertical travel for the item at `index`, scrubbed by scroll.
 * It leaves upward as its segment ends and the next rises in, overlapping by
 * only a sliver at the boundary: enough that the panel is never empty, not
 * enough for two titles to stack legibly on top of each other.
 */
function useScrubbedSlot(progress: MotionValue<number>, index: number, travel: number, peak = 1) {
  const enter = index * SEGMENT;
  const exit = (index + 1) * SEGMENT;
  const first = index === 0;
  const last = index === COUNT - 1;

  const input = [
    ...(first ? [0] : [enter - OVERLAP, enter + HANDOVER]),
    ...(last ? [1] : [exit - HANDOVER, exit + OVERLAP]),
  ];
  const opacity = [
    ...(first ? [peak] : [0, peak]),
    ...(last ? [peak] : [peak, 0]),
  ];
  const y = [
    ...(first ? [0] : [travel, 0]),
    ...(last ? [0] : [0, -travel]),
  ];

  return {
    opacity: useTransform(progress, input, opacity),
    y: useTransform(progress, input, y),
  };
}

function Discipline({ progress, index, active }: { progress: MotionValue<number>; index: number; active: boolean }) {
  const service = services[index];
  const { opacity, y } = useScrubbedSlot(progress, index, 120);
  return (
    <motion.article
      aria-hidden={!active}
      style={{ opacity, y, pointerEvents: active ? "auto" : "none" }}
      // Copy stays in the left part of the panel so long titles wrap
      // instead of running into the index on the right.
      className="absolute inset-0 flex flex-col justify-center pr-[42%] will-change-transform"
    >
      <h3 className="text-[clamp(3rem,min(9.5vw,13svh),9rem)] font-extrabold leading-[0.88] tracking-[-0.045em]">
        {service.title}
      </h3>
      <div className="mt-7 max-w-[54ch] space-y-3 text-[clamp(1rem,1.5vw,1.3rem)] leading-[1.5]">
        <p className="font-semibold">{service.summary}</p>
        {service.detail.map((paragraph) => (
          <p key={paragraph} className="font-normal">
            {paragraph}
          </p>
        ))}
      </div>
    </motion.article>
  );
}

function GhostIndex({ progress, index }: { progress: MotionValue<number>; index: number }) {
  // More travel than the copy, so the number reads as sitting further back.
  const { opacity, y } = useScrubbedSlot(progress, index, 230, 0.14);
  return (
    <motion.span
      aria-hidden
      style={{ opacity, y }}
      className="pointer-events-none absolute right-5 top-1/2 -mt-[0.5em] text-[min(34vh,26vw)] font-extrabold leading-none tracking-[-0.06em] will-change-transform sm:right-8 lg:right-12"
    >
      {String(index + 1).padStart(2, "0")}
    </motion.span>
  );
}

/**
 * The section pins while four discipline panels pass through it, each owning a
 * logo colour. Everything is scrubbed by scroll position — colour, copy,
 * index and the tab underline — so it moves exactly as far and as fast as the
 * visitor scrolls, and runs backwards when they scroll back. Under reduced
 * motion or on small screens the panels simply stack and scroll.
 */
export function Services() {
  const calm = useCalmMotion();
  const ref = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLOListElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);
  // Discrete state is kept only for what can't be scrubbed: which panel is
  // exposed to assistive tech, and which colour the nav should read.
  const [active, setActive] = useState(0);

  const { scrollYProgress: rawProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  // Pass the scroll value through a plain function before driving anything
  // with it. Fed directly, Motion hands opacity to the browser's native scroll
  // timeline, which mis-maps this pinned track's offsets: panels faded back
  // in after they had left. Derived, every property stays on the same,
  // correct interpolation. Lenis already smooths the scroll itself.
  const scrollYProgress = useTransform(rawProgress, (value) => value);

  const backgroundColor = useTransform(scrollYProgress, backgroundAt);
  const color = useTransform(scrollYProgress, foregroundAt);

  // Glide the underline between tabs in step with the copy. Positions are
  // measured from the rendered tabs and written straight to the element.
  const tabBoxes = useRef<{ left: number; width: number }[]>([]);
  const placeUnderline = (value: number) => {
    const boxes = tabBoxes.current;
    const bar = underlineRef.current;
    if (!bar || boxes.length !== COUNT) return;
    const scaled = Math.min(COUNT - 1, Math.max(0, value * COUNT - 0.5));
    // Hold on each tab, move only across the hand-over either side of a
    // boundary (which sits halfway between two tab centres).
    const base = Math.floor(scaled);
    const within = scaled - base;
    const span = HANDOVER * COUNT;
    const t = Math.min(1, Math.max(0, (within - (0.5 - span)) / (2 * span)));
    const from = boxes[base];
    const to = boxes[Math.min(COUNT - 1, base + 1)];
    const left = from.left + (to.left - from.left) * t;
    const width = from.width + (to.width - from.width) * t;
    bar.style.transform = `translateX(${left}px) scaleX(${width})`;
  };

  useEffect(() => {
    const list = tabsRef.current;
    if (!list) return;
    const measure = () => {
      const origin = list.getBoundingClientRect().left;
      tabBoxes.current = [...list.querySelectorAll<HTMLElement>("[data-tab]")].map((el) => {
        const r = el.getBoundingClientRect();
        return { left: r.left - origin, width: r.width };
      });
      placeUnderline(scrollYProgress.get());
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calm]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    placeUnderline(value);
    const next = Math.min(COUNT - 1, Math.floor(value * COUNT));
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
        style={{ height: `${COUNT * 100}svh` }}
      >
        <motion.div
          data-nav-theme={onBrand[current.color]}
          style={{ backgroundColor, color }}
          className="sticky top-0 flex h-[100svh] flex-col overflow-hidden"
        >
          <div className="relative mx-auto flex w-full max-w-[1560px] flex-1 flex-col px-5 pb-10 pt-28 sm:px-8 lg:px-12">
            <div className="flex items-baseline justify-between border-b border-current/25 pb-4">
              <p className="text-label uppercase">What We Do</p>
              <p className="max-w-[40ch] text-right text-[clamp(0.95rem,1.15vw,1.2rem)] font-medium leading-snug">
                Making sure your brand shows up with clarity and consistency, everywhere it matters.
              </p>
            </div>

          
            {/* Oversized index, ghosted into the right half of the panel. */}
            {services.map((service, index) => (
              <GhostIndex key={service.title} progress={scrollYProgress} index={index} />
            ))}

            <div className="relative flex flex-1 items-center">
              {services.map((service, index) => (
                <Discipline
                  key={service.title}
                  progress={scrollYProgress}
                  index={index}
                  active={index === active}
                />
              ))}
            </div>



            

            <ol ref={tabsRef} className="relative flex items-center gap-6 border-t border-current/25 pt-4">
              {services.map((service, index) => (
                <li
                  key={service.title}
                  data-tab
                  className="flex items-center gap-2 pb-1 text-[0.82rem] font-semibold"
                >
                  <span
                    className={`pill h-1.5 w-1.5 bg-current transition-transform duration-500 ${
                      index === active ? "scale-150" : "scale-100"
                    }`}
                  />
                  {service.title}
                </li>
              ))}
              {/* One underline that travels between tabs. Unit width, scaled
                  to each tab, so it moves on the compositor. */}
              <span
                ref={underlineRef}
                aria-hidden
                className="absolute bottom-0 left-0 h-0.5 w-px origin-left bg-current will-change-transform"
              />
            </ol>
          </div>
        </motion.div>
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
          className={`px-5 py-14 sm:px-8 lg:px-12 ${panelBg[service.color]} ${onBrandText[service.color]}`}
        >
          <div className="mx-auto max-w-[1560px]">
            <h3 className="text-[clamp(2.5rem,11vw,4.5rem)] font-extrabold leading-[0.9] tracking-[-0.04em]">
              {service.title}
            </h3>
            <div className="mt-5 max-w-[52ch] space-y-3 text-[1.02rem] leading-[1.55]">
              <p className="font-semibold">{service.summary}</p>
              {service.detail.map((paragraph) => (
                <p key={paragraph}>
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
