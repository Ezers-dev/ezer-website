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

/**
 * The headline, in the lines it is set in on desktop. Each marked word sits at
 * the start or end of a line, where a line from the team book can reach it
 * from the side without crossing the other words.
 */
const titleLines = ["Brands, campaigns, and", "content created to stand", "out in crowded markets."];

export type MarkColour = "pink" | "green" | "blue" | "orange";

export const clientsIntro = {
  eyebrow: "Our Works",
  title: titleLines.join(" "),
  titleLines,
  /** Words the lines from the book land on, which take the line's colour. */
  marks: [
    { text: "Brands", colour: "pink", side: "left" },
    { text: "out in", colour: "green", side: "left" },
    { text: "stand", colour: "blue", side: "right" },
    { text: "markets.", colour: "orange", side: "right" },
  ] as { text: string; colour: MarkColour; side: "left" | "right" }[],
  since: "2012 — Present",
};

export const clientsClosing = {
  count: 160,
  label: "clients served",
  line: "Many industries. Many challenges. One creative standard.",
};
