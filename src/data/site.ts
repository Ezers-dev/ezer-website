export const site = {
  name: "Ezers & Strategies",
  tagline: "...thoughts turn reality",
  url: "https://ezersandstrategies.com",
  email: "ebyclassicmedia@gmail.com",
  phones: [
    { label: "Nigeria", number: "+234 706 680 8580", href: "tel:+2347066808580" },
    { label: "Canada", number: "+1 437 595 3355", href: "tel:+14375953355" },
  ],
  locations: [
    { country: "Nigeria", city: "Lagos", timeZone: "Africa/Lagos" },
    { country: "Canada", city: "Toronto", timeZone: "America/Toronto" },
  ],
  founded: 2012,
} as const;

export const nav = [
  { label: "Story", href: "/#story" },
  { label: "What We Do", href: "/#services" },
  { label: "Team", href: "/#team" },
  { label: "Work", href: "/#work" },
  { label: "Contact", href: "/#contact" },
] as const;
