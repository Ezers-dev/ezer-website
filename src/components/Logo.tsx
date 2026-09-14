import type { BrandColor } from "@/lib/colors";
import { brandHex } from "@/lib/colors";

type LogoProps = {
  /** The disc colour. Blue is the primary mark. */
  color?: BrandColor;
  /** The accent dot. Defaults to the pairing used on each official variant. */
  accent?: BrandColor;
  /** Flips disc and pills, for sitting on a coloured panel. */
  onDark?: boolean;
  className?: string;
  title?: string;
};

const defaultAccent: Partial<Record<BrandColor, BrandColor>> = {
  blue: "yellow",
  pink: "orange",
  green: "pink",
  orange: "pink",
  ink: "blue",
};

/**
 * The Ezers mark: three stacked pills and an accent dot on a disc.
 * Drawn rather than imported so it recolours and animates cleanly.
 */
export function Logo({
  color = "blue",
  accent,
  onDark = false,
  className,
  title,
}: LogoProps) {
  const dot = accent ?? defaultAccent[color] ?? "yellow";
  const disc = onDark ? "#f6f5f2" : brandHex[color];
  const pills = onDark ? brandHex[color] : "#ffffff";

  return (
    <svg
      viewBox="0 0 1868 2000"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <ellipse cx="934" cy="1000" rx="934" ry="1000" fill={disc} />
      <g fill={pills}>
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
  onDark = false,
  className = "",
}: {
  color?: BrandColor;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-3 sm:gap-3.5 ${className}`}>
      <Logo color={color} onDark={onDark} className="h-10 w-auto sm:h-12" />
      <span className="text-[1.15rem] font-extrabold leading-none tracking-[-0.025em] sm:text-[1.4rem]">
        Ezers <span className="font-medium opacity-60">&</span> Strategies
      </span>
    </span>
  );
}
