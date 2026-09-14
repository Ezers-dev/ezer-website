import type { BrandColor } from "@/lib/colors";
import { brandHex } from "@/lib/colors";

type LogoProps = {
  /** The disc colour. Blue is the primary mark. */
  color?: BrandColor;
  /** The accent dot. Defaults to the pairing used on each official variant. */
  accent?: BrandColor;
  className?: string;
  title?: string;
};

const defaultAccent: Partial<Record<BrandColor, BrandColor>> = {
  blue: "yellow",
  pink: "orange",
  green: "pink",
  ink: "blue",
};

/**
 * The Ezers mark: three stacked pills and an accent dot on a disc.
 * Drawn rather than imported so it recolours and animates cleanly.
 */
export function Logo({ color = "blue", accent, className, title }: LogoProps) {
  const dot = accent ?? defaultAccent[color] ?? "yellow";

  return (
    <svg
      viewBox="0 0 1868 2000"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <ellipse cx="934" cy="1000" rx="934" ry="1000" fill={brandHex[color]} />
      <g fill="#ffffff">
        <rect x="420" y="515" width="750" height="232" rx="116" />
        <rect x="415" y="876" width="1030" height="236" rx="118" />
        <rect x="418" y="1232" width="752" height="236" rx="118" />
      </g>
      <circle cx="1343" cy="631" r="97" fill={brandHex[dot]} />
    </svg>
  );
}

/** Mark plus wordmark, for the nav and footer. */
export function Lockup({
  color = "blue",
  className = "",
}: {
  color?: BrandColor;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Logo color={color} className="h-7 w-auto" />
      <span className="text-[0.95rem] font-extrabold tracking-[-0.02em] leading-none">
        Ezers <span className="font-medium opacity-60">&</span> Strategies
      </span>
    </span>
  );
}
