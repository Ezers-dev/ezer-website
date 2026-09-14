import type { BrandColor } from "@/lib/colors";

export type Project = {
  slug: string;
  client: string;
  title: string;
  sector: string;
  year: string;
  disciplines: string[];
  /** Drop a real file at this path in /public to replace the placeholder. */
  image: string;
  aspect: "portrait" | "landscape" | "square";
  color: BrandColor;
  summary: string;
  challenge: string;
  approach: string;
  outcome: string;
};

export const work: Project[] = [
  {
    slug: "farmfresh-foods",
    client: "FarmFresh Foods",
    title: "An identity for food you can trace",
    sector: "Food & Agriculture",
    year: "2024",
    disciplines: ["Branding", "Packaging", "Content"],
    image: "/work/farmfresh-foods.jpg",
    aspect: "portrait",
    color: "green",
    summary:
      "A farm-to-table brand that needed to look as fresh on shelf as it does at harvest.",
    challenge:
      "A produce business competing against imported brands with far bigger budgets and far weaker provenance stories.",
    approach:
      "We built the identity around traceability — a mark, colour system and packaging grid that puts the farm, the date and the hands behind every product on the front of the pack.",
    outcome:
      "A consistent shelf presence across six product lines and a visual language the team can extend without us in the room.",
  },
  {
    slug: "adeyemi-partners",
    client: "Adeyemi & Partners",
    title: "Authority without the oak panelling",
    sector: "Legal",
    year: "2024",
    disciplines: ["Branding", "Digital"],
    image: "/work/adeyemi-partners.jpg",
    aspect: "landscape",
    color: "blue",
    summary:
      "A commercial law practice repositioned for the clients it actually wants.",
    challenge:
      "Decades of reputation, expressed through a visual identity that made the firm look thirty years older than its partners.",
    approach:
      "A restrained identity system and a website structured around practice areas rather than partner bios — the way prospective clients actually search.",
    outcome:
      "A firm that reads as precise and contemporary while keeping every ounce of its institutional weight.",
  },
  {
    slug: "state-development-agency",
    client: "State Development Agency",
    title: "Public information people actually read",
    sector: "Government",
    year: "2023",
    disciplines: ["Creative Strategy", "Content", "Digital"],
    image: "/work/state-development-agency.jpg",
    aspect: "landscape",
    color: "pink",
    summary:
      "A public institution's communications rebuilt for clarity and reach.",
    challenge:
      "Critical programme information reaching a fraction of the citizens it was written for.",
    approach:
      "We rebuilt the communications system from the message out: plain-language templates, a bilingual content calendar, and a campaign identity that survives print, radio and social.",
    outcome:
      "Programme awareness lifted across three states within a single campaign cycle.",
  },
  {
    slug: "lumen-fintech",
    client: "Lumen",
    title: "A fintech that feels like a bank you'd trust",
    sector: "Financial Technology",
    year: "2023",
    disciplines: ["Branding", "Digital"],
    image: "/work/lumen-fintech.jpg",
    aspect: "square",
    color: "orange",
    summary: "Naming, identity and product language for a lending platform.",
    challenge:
      "An early-stage team with a strong product and no vocabulary to explain it.",
    approach:
      "We named the product, built the identity, and wrote the language system that carries from the app store listing to the in-product copy.",
    outcome: "A brand that raised its seed round on the strength of the story.",
  },
  {
    slug: "kitchen-affairs",
    client: "Kitchen Affairs",
    title: "A restaurant group with one voice",
    sector: "Hospitality",
    year: "2022",
    disciplines: ["Branding", "Content Creation"],
    image: "/work/kitchen-affairs.jpg",
    aspect: "portrait",
    color: "yellow",
    summary:
      "Three venues, one parent brand, and a content engine to keep it fed.",
    challenge:
      "Three restaurants operating as three unrelated brands under one owner.",
    approach:
      "A parent identity with room for each venue's personality, plus a monthly content system the in-house team runs themselves.",
    outcome: "A group that looks like a group, and posts like one.",
  },
  {
    slug: "north-star-academy",
    client: "North Star Academy",
    title: "An education brand built for parents",
    sector: "Education",
    year: "2022",
    disciplines: ["Branding", "Digital", "Content"],
    image: "/work/north-star-academy.jpg",
    aspect: "landscape",
    color: "blue",
    summary: "Identity and admissions site for an independent school.",
    challenge:
      "Strong outcomes, invisible reputation, and an admissions funnel that leaked at every stage.",
    approach:
      "We rebuilt the brand around the school's actual pedagogy and restructured the site around the questions parents ask before they enquire.",
    outcome: "Enquiries up through a single admissions cycle.",
  },
];

export function getProject(slug: string) {
  return work.find((project) => project.slug === slug);
}
