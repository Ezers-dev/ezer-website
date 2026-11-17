import type { BrandColor } from "@/lib/colors";

export type Service = {
  title: string;
  /** A second, smaller line under the title, where the service names its medium. */
  subtitle?: string;
  /** The promise, set bold. */
  summary: string;
  /** What it covers. */
  detail: string[];
  color: BrandColor;
};

/** In the order they are presented. Colours cycle blue, magenta, green. */
export const services: Service[] = [
  {
    title: "Communication Strategy",
    summary: "The right message, to the right people, inside and out.",
    detail: [
      "Internal and external comms plans that align your team and win over your audience.",
    ],
    color: "blue",
  },
  {
    title: "Branding & Design",
    summary: "Look like the leader you’re becoming.",
    detail: [
      "Logos, visual identity, and design that make your brand instantly recognizable.",
    ],
    color: "pink",
  },
  {
    title: "Corporate Storytelling",
    subtitle: "Video & Photography",
    summary: "Your people, your proof, your story, told well.",
    detail: [
      "Video testimonials and professional photography that turn real experiences into trust.",
    ],
    color: "green",
  },
  {
    title: "Content Creation",
    summary: "Content with a point, not just a post.",
    detail: [
      "Copy, newsletters, blogs, and campaign assets built around what you want people to do.",
    ],
    color: "blue",
  },
  {
    title: "Social Media Management",
    summary: "Show up consistently. Stand out constantly.",
    detail: [
      "Planning, posting, and community management so your brand stays visible without the stress.",
    ],
    color: "pink",
  },
];
