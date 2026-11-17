import { Hero } from "@/components/sections/Hero";
import { Story } from "@/components/sections/Story";
import { Services } from "@/components/sections/Services";
import { Work } from "@/components/sections/Work";
import { Team } from "@/components/sections/Team";
import { Contact } from "@/components/sections/Contact";
import { team } from "@/data/team";
import { hasAsset } from "@/lib/media";

export default function Home() {
  // Asset presence is resolved here, on the server, so the client sections
  // stay dumb: drop a real file at the data path and it renders instead.
  const teamItems = team.map((person) => ({
    ...person,
    ready: hasAsset(person.image),
  }));

  return (
    <>
      <Hero />
      <Story />
      <Services />
      <Team items={teamItems} />
      <Work />
      <Contact />
    </>
  );
}
