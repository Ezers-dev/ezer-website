import type { BrandColor } from "@/lib/colors";

/**
 * Copy for "Our Story". The section tells one journey in five stages, and
 * the left-hand blocks, the SVG canvas and the mobile spine all read from
 * this one list, so each stage's words and picture stay in step.
 */

export type StoryStageId = "origin" | "strategy" | "creative" | "global" | "impact";

export type StoryStage = {
  id: StoryStageId;
  /** Uppercase metadata label. */
  label: string;
  /** Short display line for the stage. */
  title: string;
  /** Supporting copy, one paragraph per entry. */
  body: string[];
  /**
   * The stage's brand colour: its panel on the left, and the canvas accent
   * (nodes, lines, map outlines) while that stage is the one in view.
   */
  color: BrandColor;
};

export const storyHeadline = {
  lead: "Great ideas deserve to be",
  accent: "seen.",
};

export const storyIntro = "12+ years of turning ambitious ideas into memorable brands.";

/** Heading over the five-stage journey. */
export const storyOriginTitle = "Our Origin";

export const storyStages: StoryStage[] = [
  {
    id: "origin",
    label: "2012 · Origin",
    color: "blue",
    title: "2012, Nigeria.",
    body: [
      "Ezers & Strategies began in 2012 in Nigeria with a simple belief: great ideas deserve to be seen.",
    ],
  },
  {
    id: "strategy",
    label: "Strategy",
    color: "pink",
    title: "Strategic before creative.",
    body: [
      "Every logo, campaign, and piece of content is built to solve a real business problem.",
    ],
  },
  {
    id: "creative",
    label: "Creative",
    color: "green",
    title: "Creativity with Direction.",
    body: [
      "We turn bold ideas into purposeful brands, campaigns, and experiences built to move businesses forward."
    ],
  },
  {
    id: "global",
    label: "Global",
    color: "orange",
    title: "Across borders.",
    body: [
      "Over a decade later, that belief has taken us across borders — we now operate out of both Nigeria and Canada, serving a growing roster of start-ups, multinational organizations, and personal brands.",
    ],
  },
  {
    id: "impact",
    label: "Impact",
    color: "yellow",
    title: "One idea. Real impact.",
    body: [
      "We’ve spent 12+ years learning what makes a brand memorable in crowded markets. Now we bring that experience to founders building something new, institutions protecting decades of reputation, and individuals turning personal influence into a business.",
    ],
  },
];

export type StoryStat = {
  value: string;
  label: string;
};

export const storyStats: StoryStat[] = [
  { value: "160+", label: "Clients served" },
  { value: "12+", label: "Years in business" },
  { value: "2", label: "Continents" },
  { value: "2", label: "Countries" },
];

export const storyClosing = "12+ years of making brands matter.";
