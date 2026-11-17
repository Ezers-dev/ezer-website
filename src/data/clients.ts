export type Client = {
  /** As written on the client's own logo. */
  name: string;
  logo: string;
  /** The logo file's pixel size, for its proportions. */
  width: number;
  height: number;
};

/** In the order they read across the wall, left to right. */
export const clients: Client[] = [
  { name: "BAT", logo: "/clients/bat.png", width: 724, height: 248 },
  { name: "Lawbridge Legal Practice", logo: "/clients/lawbridge.png", width: 689, height: 116 },
  { name: "Government of Delta State", logo: "/clients/delta-state.png", width: 296, height: 296 },
  { name: "Barry Callebaut", logo: "/clients/barry-callebaut.png", width: 403, height: 181 },
  { name: "Makena Infrastructure Limited", logo: "/clients/makena.png", width: 488, height: 136 },
  { name: "Poshy Foods", logo: "/clients/poshy-foods.png", width: 300, height: 187 },
  { name: "Private Sector ESG Forum", logo: "/clients/esg-forum.png", width: 900, height: 287 },
  { name: "Usmanu Danfodiyo University, Sokoto", logo: "/clients/udus-sokoto.png", width: 322, height: 323 },
  { name: "SellURMarket", logo: "/clients/sellurmarket.png", width: 758, height: 214 },
  { name: "Tiana's Farmfresh", logo: "/clients/tianas-farmfresh.png", width: 701, height: 173 },
  { name: "Westminster Security Solutions", logo: "/clients/westminster.png", width: 270, height: 230 },
];

/** The headline, in the lines it is set in on desktop. */
const titleLines = ["Brands, campaigns, and", "content created to stand", "out in crowded markets."];

export const clientsIntro = {
  eyebrow: "Our Works",
  title: titleLines.join(" "),
  titleLines,
  since: "2012 — Present",
};

export const clientsClosing = {
  count: 25,
  label: "clients served",
  line: "Many industries. Many challenges. One creative standard.",
};
