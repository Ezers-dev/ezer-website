import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Media } from "@/components/Media";
import { FadeUp } from "@/components/motion/Reveal";
import { work, getProject } from "@/data/work";
import { hasAsset } from "@/lib/media";
import { brandText } from "@/lib/colors";

export function generateStaticParams() {
  return work.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.client} — ${project.title}`,
    description: project.summary,
  };
}

export default async function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = work.findIndex((item) => item.slug === project.slug);
  const next = work[(index + 1) % work.length];

  return (
    <article className="pt-28">
      <header className="mx-auto max-w-[1560px] px-5 sm:px-8 lg:px-12">
        <Link
          href="/#work"
          className="text-label uppercase text-ink-soft transition-colors hover:text-ink"
        >
          ← All work
        </Link>

        <div className="mt-8 grid gap-8 border-b border-ink/12 pb-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className={`text-label uppercase ${brandText[project.color]}`}>
              {project.client}
            </p>
            <h1 className="text-display mt-3 max-w-[18ch]">{project.title}</h1>
          </div>
          <dl className="grid grid-cols-2 gap-6 self-end text-[0.9rem] lg:col-span-3 lg:col-start-10 lg:grid-cols-1">
            <div>
              <dt className="text-label uppercase text-ink-soft">Sector</dt>
              <dd className="mt-1.5 font-semibold">{project.sector}</dd>
            </div>
            <div>
              <dt className="text-label uppercase text-ink-soft">Year</dt>
              <dd className="mt-1.5 font-semibold">{project.year}</dd>
            </div>
            <div className="col-span-2 lg:col-span-1">
              <dt className="text-label uppercase text-ink-soft">Disciplines</dt>
              <dd className="mt-1.5 font-semibold">
                {project.disciplines.join(", ")}
              </dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="mx-auto mt-12 max-w-[1560px] px-5 sm:px-8 lg:px-12">
        <div className="relative aspect-[16/9] overflow-hidden">
          <Media
            src={project.image}
            alt={`${project.client} — ${project.title}`}
            ready={hasAsset(project.image)}
            color={project.color}
            label={project.client}
            sizes="100vw"
            priority
          />
        </div>

        <div className="mt-16 grid gap-12 pb-24 lg:grid-cols-12 lg:gap-10">
          <p className="text-headline max-w-[20ch] lg:col-span-5">
            {project.summary}
          </p>
          <div className="space-y-10 lg:col-span-6 lg:col-start-7">
            {(
              [
                ["The challenge", project.challenge],
                ["Our approach", project.approach],
                ["The outcome", project.outcome],
              ] as const
            ).map(([heading, body], i) => (
              <FadeUp key={heading} delay={i}>
                <h2 className="text-label uppercase text-ink-soft">{heading}</h2>
                <p className="mt-3 max-w-[58ch] text-[1.05rem] leading-[1.7] text-ink-soft">
                  {body}
                </p>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>

      <nav
        aria-label="Next project"
        className="border-t border-ink/12 bg-paper-dim/40"
      >
        <Link
          href={`/work/${next.slug}`}
          className="group mx-auto flex max-w-[1560px] flex-col gap-2 px-5 py-14 sm:px-8 lg:px-12"
        >
          <span className="text-label uppercase text-ink-soft">Next project</span>
          <span className="text-display transition-colors duration-500 group-hover:text-blue">
            {next.client} <span aria-hidden>→</span>
          </span>
        </Link>
      </nav>
    </article>
  );
}
