import type { MetadataRoute } from "next";
import { work } from "@/data/work";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: site.url, lastModified: now, priority: 1 },
    ...work.map((project) => ({
      url: `${site.url}/work/${project.slug}`,
      lastModified: now,
      priority: 0.7,
    })),
  ];
}
