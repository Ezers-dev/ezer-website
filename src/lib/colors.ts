export type BrandColor = "blue" | "pink" | "green" | "orange" | "yellow" | "ink";

/** Hex values mirror the @theme tokens in globals.css. */
export const brandHex: Record<BrandColor, string> = {
  blue: "#0080c8",
  pink: "#ff0057",
  green: "#6ba23a",
  orange: "#f96b2a",
  yellow: "#fbc400",
  ink: "#0b1013",
};

/**
 * Text color that clears WCAG AA against each field.
 * Yellow, green and orange are too light for white text.
 */
export const onBrand: Record<BrandColor, "paper" | "ink"> = {
  blue: "paper",
  pink: "paper",
  green: "ink",
  orange: "ink",
  yellow: "ink",
  ink: "paper",
};

export const brandText: Record<BrandColor, string> = {
  blue: "text-blue",
  pink: "text-pink",
  green: "text-green",
  orange: "text-orange",
  yellow: "text-yellow",
  ink: "text-ink",
};

export const onBrandText: Record<BrandColor, string> = {
  blue: "text-paper",
  pink: "text-paper",
  green: "text-ink",
  orange: "text-ink",
  yellow: "text-ink",
  ink: "text-paper",
};

/**
 * Background classes for full-bleed panels. Blue and pink are deepened here
 * so white body text on them clears WCAG AA; the mark keeps the true brand
 * values above. Green, orange and yellow take ink text and need no change.
 */
export const panelBg: Record<BrandColor, string> = {
  blue: "bg-blue-deep",
  pink: "bg-pink-deep",
  green: "bg-green",
  orange: "bg-orange",
  yellow: "bg-yellow",
  ink: "bg-ink",
};

/** Hex for each panel tint, matching `panelBg`, for use outside Tailwind. */
export const panelHex: Record<BrandColor, string> = {
  blue: "#0071b0",
  pink: "#d6004a",
  green: "#6ba23a",
  orange: "#f96b2a",
  yellow: "#fbc400",
  ink: "#0b1013",
};
