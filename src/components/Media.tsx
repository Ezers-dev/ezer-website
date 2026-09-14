"use client";

import Image from "next/image";
import type { BrandColor } from "@/lib/colors";
import { brandBg, onBrandText } from "@/lib/colors";

type MediaProps = {
  src: string;
  alt: string;
  /** Resolved on the server by hasAsset(). False renders the placeholder. */
  ready: boolean;
  color: BrandColor;
  label: string;
  sizes: string;
  className?: string;
  priority?: boolean;
};

/**
 * One image slot. Until a real file exists at `src`, it renders a flat colour
 * field carrying the item's name — deliberate-looking rather than broken.
 */
export function Media({
  src,
  alt,
  ready,
  color,
  label,
  sizes,
  className,
  priority,
}: MediaProps) {
  if (ready) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${className ?? ""}`}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={`flex h-full w-full flex-col justify-between p-5 sm:p-7 ${brandBg[color]} ${onBrandText[color]} ${className ?? ""}`}
    >
      <span className="text-label uppercase opacity-70">Image pending</span>
      <span className="max-w-[14ch] text-[clamp(1.35rem,2.4vw,2.25rem)] font-extrabold leading-[0.98] tracking-[-0.03em]">
        {label}
      </span>
    </div>
  );
}
