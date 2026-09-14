import type { BrandColor } from "@/lib/colors";

export type Service = {
  index: string;
  title: string;
  summary: string;
  detail: string[];
  color: BrandColor;
};

export const services: Service[] = [
  {
    index: "01",
    title: "Branding",
    summary:
      "We define what your brand stands for and make sure it looks like it.",
    detail: [
      "From naming and logo systems to full identity guidelines, we build brand foundations that hold up as you scale.",
    ],
    color: "blue",
  },
  {
    index: "02",
    title: "Digital",
    summary:
      "We help clients harness digital channels to drive real outcomes: more traffic, stronger engagement, higher conversion.",
    detail: ["Strategy-led, platform-agnostic, built around your audience."],
    color: "pink",
  },
  {
    index: "03",
    title: "Creative Strategy",
    summary: "Before we design anything, we ask why.",
    detail: [
      "We work closely with clients to shape a clear creative vision that ties directly back to business and marketing objectives, not just trends.",
    ],
    color: "green",
  },
  {
    index: "04",
    title: "Content Creation",
    summary:
      "We produce high-quality content — social, print, campaign — that resonates with your audience.",
    detail: [
      "Built to keep your brand consistently visible across the media space.",
    ],
    color: "orange",
  },
];
