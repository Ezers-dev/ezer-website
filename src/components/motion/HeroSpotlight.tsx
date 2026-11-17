"use client";

import { useEffect, useRef } from "react";
import { useCalmMotion } from "@/lib/useCalmMotion";

const NS = "http://www.w3.org/2000/svg";
const WHITE = "#ffffff";
const UNLIT = "#5a6268";
const BLUE = "#0080c8";
const GREEN = "#6ba23a";

/** The whole sequence, in milliseconds after the page has finished loading. */
const T = {
  light: [500, 1700], // the spotlight comes down onto the bar
  fall: [1900, 2750], // the bulb drops down the beam
  lift: [2750, 5200], // the dark lifts off the photograph
  morph: [3000, 4700], // the bar becomes the dot
  ripple: [3700, 6300], // the rings answer, one after another
} as const;
const SETTLED = T.ripple[1] + 900;

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const seg = (t: number, [a, b]: readonly [number, number]) => clamp((t - a) / (b - a));
const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);
const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const mix = (a: number, b: number, p: number) => a + (b - a) * p;
const mixHex = (a: string, b: string, p: number) => {
  const n = (h: string, i: number) => parseInt(h.slice(1 + i * 2, 3 + i * 2), 16);
  return `rgb(${[0, 1, 2].map((i) => Math.round(mix(n(a, i), n(b, i), p))).join(",")})`;
};

type Dot = { node: SVGCircleElement; d: number; wave: number; angle: number; dir: number };

/**
 * The hero's opening moment, played over the photograph: the picture starts
 * in the dark, a spotlight comes down onto a lone white bar, a bulb drops down
 * the beam, and as it lands the dark lifts, the bar draws itself up into a
 * dot and the market — rings of dots — ripples out from it and keeps
 * turning round it.
 *
 * Drawn in an SVG laid over the photo in the hero's own pixels, so the
 * figure keeps its size and sits to the right of the headline at any width.
 * Visitors who prefer less motion get the finished picture, standing still.
 */
export function HeroSpotlight() {
  const calm = useCalmMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const shade = shadeRef.current;
    const host = svg?.parentElement;
    if (!svg || !shade || !host) return;

    let render: (t: number) => void = () => {};

    const build = () => {
      const w = host.offsetWidth;
      const h = host.offsetHeight;
      const wide = w >= 768;
      // One unit is a pixel of the 2400 × 1350 drawing the figure was made on.
      const s = wide ? h / 1350 : Math.min(h / 1350, w / 1100) * 0.62;
      const cx = wide ? Math.max(w * 0.66, w - 470 * s) : w * 0.68;
      const floor = wide ? h * 0.785 : h - 70 * s - 40;
      const bar = { x: cx - 75 * s, y: floor - 520 * s, w: 150 * s, h: 520 * s, r: 75 * s };
      const dotY = wide ? h * 0.48 : floor - 300 * s;
      const dot = { x: cx - 92 * s, y: dotY - 92 * s, w: 184 * s, h: 184 * s, r: 92 * s };
      const bulbR = 34 * s;
      const bulbRest = bar.y - bulbR - 36 * s;

      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      svg.innerHTML = `<defs>
        <linearGradient id="hs-cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.4"/><stop offset="1" stop-color="#fff" stop-opacity="0.08"/></linearGradient>
        <filter id="hs-b6" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${6 * s}"/></filter>
        <filter id="hs-b20" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="${20 * s}"/></filter>
        <clipPath id="hs-clip"><rect width="${w}" height="0"/></clipPath>
      </defs>`;
      const el = <K extends keyof SVGElementTagNameMap>(name: K, attrs: Record<string, string | number>, parent: Element = svg) => {
        const node = document.createElementNS(NS, name);
        for (const key in attrs) node.setAttribute(key, String(attrs[key]));
        parent.appendChild(node);
        return node;
      };
      const clipRect = svg.querySelector("#hs-clip rect")!;

      // The spotlight, revealed from the top down, and the pool it throws.
      const stageLight = el("g", {});
      const beam = el("g", { "clip-path": "url(#hs-clip)" }, stageLight);
      el("polygon", {
        points: `${cx - 40 * s},-20 ${cx + 40 * s},-20 ${cx + 330 * s},${floor + 20 * s} ${cx - 330 * s},${floor + 20 * s}`,
        fill: "url(#hs-cone)",
        filter: "url(#hs-b6)",
      }, beam);
      const pool = el("ellipse", { cx, cy: floor + 10 * s, rx: 340 * s, ry: 56 * s, fill: "#fff", opacity: 0, filter: "url(#hs-b6)" }, stageLight);
      el("ellipse", { cx, cy: floor + 6 * s, rx: 105 * s, ry: 14 * s, fill: "#000", opacity: 0.45, filter: "url(#hs-b6)" }, stageLight);

      // The market: rings of dots round the spot the bar becomes. Only the
      // rings are drawn, and they fade out before they reach the headline.
      const field = el("g", {});
      const dots: Dot[] = [];
      const gap = 62 * s;
      const reach = wide ? 1000 : 700;
      for (let y = dotY % gap; y < h; y += gap) {
        for (let x = cx % gap; x < w; x += gap) {
          const d = Math.hypot(x - cx, y - dotY) / s;
          if (d < 120 || d > reach) continue;
          const gate = wide ? clamp((x - (cx - 290 * s)) / (160 * s)) : 1;
          const wave = Math.max(0, Math.cos(d / 62)) * Math.max(0, 1 - d / reach) * gate;
          if (wave < 0.08) continue;
          const node = el("circle", { cx: x, cy: y, r: 0, fill: d < 330 ? WHITE : d < 640 ? BLUE : GREEN }, field);
          // Each ring turns its own way: white one way, blue the other, green back again.
          dots.push({ node, d, wave, angle: Math.atan2(y - dotY, x - cx), dir: d < 330 ? 1 : d < 640 ? -1 : 1 });
        }
      }

      // The bar that becomes the dot, the flash where the bulb lands, and the bulb.
      const shape = el("rect", { fill: UNLIT });
      const flash = el("circle", { cx, cy: bar.y, r: 60 * s, fill: "#fff", opacity: 0, filter: "url(#hs-b20)" });
      const bulbGlow = el("circle", { cx, r: 72 * s, fill: "#fff", opacity: 0, filter: "url(#hs-b20)" });
      const bulb = el("circle", { cx, r: bulbR, fill: "#fff", opacity: 0 });

      render = (t: number) => {
        const lit = easeInOut(seg(t, T.light));
        clipRect.setAttribute("height", (lit * (floor + 120 * s)).toFixed(0));
        pool.setAttribute("opacity", (0.22 * seg(t, [T.light[1] - 250, T.light[1] + 150])).toFixed(3));

        // The bulb falls like something with weight, and lands on the bar.
        const fall = seg(t, T.fall);
        const morph = easeInOut(seg(t, T.morph));
        const bulbGone = seg(t, [T.morph[0], T.morph[0] + 700]);
        const bulbY = mix(mix(-80 * s, bulbRest, fall * fall), dotY, easeInOut(bulbGone));
        const bulbShow = (t >= T.fall[0] ? 1 : 0) * (1 - bulbGone);
        bulb.setAttribute("cy", bulbY.toFixed(1));
        bulb.setAttribute("opacity", bulbShow.toFixed(3));
        bulb.setAttribute("r", mix(bulbR, 10 * s, bulbGone).toFixed(1));
        bulbGlow.setAttribute("cy", bulbY.toFixed(1));
        bulbGlow.setAttribute("opacity", (0.3 * bulbShow).toFixed(3));

        // Touchdown: a flash, and the bar takes the light.
        const hit = seg(t, [T.fall[1] - 40, T.fall[1] + 650]);
        flash.setAttribute("opacity", (t < T.fall[1] - 40 ? 0 : 0.9 * (1 - hit)).toFixed(3));
        flash.setAttribute("r", mix(60 * s, 420 * s, easeOut(hit)).toFixed(0));
        shape.setAttribute("fill", mixHex(UNLIT, WHITE, Math.max(lit * 0.75, seg(t, [T.fall[1] - 40, T.fall[1] + 200]))));

        // The bar draws itself up into the dot.
        shape.setAttribute("x", mix(bar.x, dot.x, morph).toFixed(1));
        shape.setAttribute("y", mix(bar.y, dot.y, morph).toFixed(1));
        shape.setAttribute("width", mix(bar.w, dot.w, morph).toFixed(1));
        shape.setAttribute("height", mix(bar.h, dot.h, morph).toFixed(1));
        shape.setAttribute("rx", mix(bar.r, dot.r, morph).toFixed(1));

        // The dark lifts off the photograph, and the stage light goes with it.
        const lifted = easeInOut(seg(t, T.lift));
        shade.style.opacity = (1 - lifted).toFixed(3);
        stageLight.setAttribute("opacity", (1 - lifted).toFixed(3));

        // The rings ripple out, then keep turning: a swell travels round the
        // dot, so the dots along each ring grow and shrink in turn.
        const front = easeOut(seg(t, T.ripple)) * 1500;
        const orbit = seg(t, [T.ripple[0] + 600, T.ripple[1]]);
        const turnAngle = (t / 1000) * 1.15;
        for (const d of dots) {
          const grown = easeOut(clamp((front - d.d) / 160));
          const swell = 0.5 + 0.5 * Math.cos(d.angle - d.dir * turnAngle);
          const size = mix(1, 0.22 + 0.95 * swell, orbit);
          d.node.setAttribute("r", ((6 + d.wave * 20 * size) * s * grown).toFixed(1));
        }
      };
    };

    build();

    // Calm: the finished picture, still.
    let start: number | null = null;
    let frame = 0;
    let visible = true;
    const now = () => (calm ? SETTLED : start === null ? 0 : performance.now() - start);
    const tick = () => {
      render(now());
      if (!calm && start !== null && visible) frame = requestAnimationFrame(tick);
    };
    const play = () => {
      start = performance.now();
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(tick);
    };
    render(now());

    // Starts once the page has finished loading.
    if (!calm) {
      if (document.readyState === "complete") play();
      else window.addEventListener("load", play, { once: true });
    }

    // Rebuilt in the hero's new size; the clock carries on.
    const resize = new ResizeObserver(() => {
      build();
      render(now());
    });
    resize.observe(host);

    // The rings stop turning while the hero is off screen.
    const seen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (visible && start !== null && !calm) frame = requestAnimationFrame(tick);
    });
    seen.observe(host);

    return () => {
      window.removeEventListener("load", play);
      cancelAnimationFrame(frame);
      resize.disconnect();
      seen.disconnect();
    };
  }, [calm]);

  return (
    <>
      {/* The dark the picture starts in; lifted as the bulb lands. */}
      <div ref={shadeRef} aria-hidden className="absolute inset-0 bg-[#06090b]/70" />
      <svg ref={svgRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
    </>
  );
}
