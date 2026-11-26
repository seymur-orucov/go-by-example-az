import { getCollection } from "astro:content";
import type { CatalogSection } from "./catalog";

export { LEVEL_LABEL } from "./catalog";
export type { CatalogItem as GoItem, CatalogSection as GoSection } from "./catalog";

/** True while any ready lesson is adapted from Go by Example: its CC BY 3.0 attribution must stay; then the site drops it. */
export async function hasAdaptedLessons(): Promise<boolean> {
  const examples = await getCollection("goExamples");
  return examples.some((e) => e.data.status === "ready" && e.data.source !== "original");
}

/** Sections in `sections.yaml` order; examples sorted by `order` and numbered across the course. */
export async function getGoCatalog(): Promise<{ sections: CatalogSection[]; total: number }> {
  const [sections, examples] = await Promise.all([
    getCollection("goSections"),
    getCollection("goExamples"),
  ]);
  let n = 0;
  const catalog = [...sections]
    .sort((a, b) => a.data.order - b.data.order)
    .map((s) => {
      const items = examples
        .filter((e) => e.data.section === s.id)
        .sort((a, b) => a.data.order - b.data.order)
        .map((e) => ({
          slug: e.id,
          title: e.data.title,
          sub: e.data.subtitle,
          status: e.data.status,
          level: e.data.level,
          duration: e.data.duration,
          href: `/go/${e.id}/`,
          n: ++n,
        }));
      return { id: s.id, ...s.data, level: items[0]?.level ?? "beginner", items };
    });
  return { sections: catalog, total: n };
}
