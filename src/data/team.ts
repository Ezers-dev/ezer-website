export type Person = {
  name: string;
  role: string;
  bio: string;
  /** Drop a real 4:5 portrait at this path in /public to replace the placeholder. */
  image: string;
};

export const team: Person[] = [
  {
    name: "Ebenezer",
    role: "Partner & Creative Lead",
    bio: "Sets the creative direction on every engagement and has led the studio's work since 2012.",
    image: "/team/ebenezer.jpg",
  },
  {
    name: "Annie",
    role: "Partner & Legal Lead",
    bio: "Handles the commercial and legal side of the practice, from trademarks to client agreements.",
    image: "/team/annie.jpg",
  },
  {
    name: "Muiz",
    role: "Creative Designer",
    bio: "Takes identity systems from first sketch to final guideline across brand, digital and print.",
    image: "/team/muiz.jpg",
  },
];

/** Printed on the front cover. */
export const teamCover = {
  title: "Our Team",
  subtitle: "The people who set the direction are the people on the work.",
};

/** Printed on the back cover, once the book closes. */
export const teamClosing = {
  statement: "Different disciplines. One studio.",
  signoff: "Small by design. Experienced by default.",
};
