"use client";

import Image from "next/image";
import { Logo } from "@/components/Logo";
import type { BrandColor } from "@/lib/colors";
import { panelBg, onBrandText } from "@/lib/colors";

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
 * One image slot. Until a real file exists at `src`, it renders a brand
 * colour field with the mark ghosted large into one corner — art-directed
 * rather than empty, so the layout reads as finished before assets land.
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
      className={`relative h-full w-full overflow-hidden ${panelBg[color]} ${onBrandText[color]} ${className ?? ""}`}
    >
      <Logo
        color={color}
        onDark
        className="absolute -bottom-[18%] -right-[12%] w-[72%] opacity-[0.16]"
      />
      <span className="absolute left-5 top-5 text-label uppercase sm:left-6 sm:top-6">
        {label}
      </span>
    </div>
  );
}
