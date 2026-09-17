"use client";

import { motion } from "motion/react";
import type { Client } from "@/data/clients";
import { LogoTile } from "./LogoTile";

/**
 * A logo's height, in rem, so wide wordmarks and square seals carry similar
 * weight: the squarer the mark, the taller it stands.
 */
export function logoHeight(client: Client, base: number) {
  const aspect = client.width / client.height;
  return Math.min(base * 2.1, base * (1.9 / Math.sqrt(aspect)));
}

type ClientGridProps = {
  clients: Client[];
  active: number | null;
  onSelect: (index: number | null) => void;
};

/**
 * Phones, tablets and reduced motion: the wall laid out in two columns (three
 * on tablets, four on desktop), every other column set a little lower so it doesn't read as a
 * grid. Tap a logo to see it in colour.
 */
/** Every other column sits lower: in 2 columns on phones, 3 on tablets, 4 on desktop. */
function offset(index: number) {
  return [
    index % 2 ? "translate-y-10" : "translate-y-0",
    index % 3 === 1 ? "md:translate-y-12" : "md:translate-y-0",
    index % 2 ? "lg:translate-y-12" : "lg:translate-y-0",
  ].join(" ");
}

export function ClientGrid({ clients, active, onSelect }: ClientGridProps) {
  return (
    <ul aria-label="Clients" className="mx-auto grid max-w-[1560px] grid-cols-2 gap-x-8 gap-y-20 px-5 [--logo:1.9rem] sm:px-8 md:grid-cols-3 md:gap-x-12 md:gap-y-24 md:[--logo:2.4rem] lg:grid-cols-4 lg:px-12 lg:[--logo:3rem]">
      {clients.map((client, index) => (
        <motion.li
          key={client.name}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8% 0px" }}
          transition={{ duration: 0.8, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
          className={`flex h-24 items-center justify-center lg:h-40 ${offset(index)}`}
        >
          <LogoTile
            client={client}
            index={index}
            on={active === index}
            dim={active !== null && active !== index}
            onSelect={onSelect}
            sizes="(min-width: 768px) 30vw, 45vw"
            style={{ height: `calc(var(--logo) * ${logoHeight(client, 1)})` }}
            className="max-w-full"
          />
        </motion.li>
      ))}
    </ul>
  );
}
