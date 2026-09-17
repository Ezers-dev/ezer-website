import { Hero } from "@/components/sections/Hero";
import { Story } from "@/components/sections/Story";
import { Services } from "@/components/sections/Services";
import { Work } from "@/components/sections/Work";
import { Clients } from "@/components/sections/Clients";
import { Team } from "@/components/sections/Team";
import { Contact } from "@/components/sections/Contact";
import { work } from "@/data/work";
import { team } from "@/data/team";
import { clients } from "@/data/clients";
import { hasAsset } from "@/lib/media";

export default function Home() {
  // Asset presence is resolved here, on the server, so the client sections
  // stay dumb: drop a real file at the data path and it renders instead.
  const workItems = work.map((project) => ({
    ...project,
    ready: hasAsset(project.image),
  }));
  const teamItems = team.map((person) => ({
    ...person,
    ready: hasAsset(person.image),
  }));
  const clientItems = clients.map((client) => ({
    ...client,
    ready: Boolean(client.logo && hasAsset(client.logo)),
  }));

  return (
    <>
      <Hero />
      <Story />
      <Services />
      <Team items={teamItems} />
      <Work items={workItems} />
      <Clients items={clientItems} />
      <Contact />
    </>
  );
}
