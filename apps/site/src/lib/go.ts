import { getCollection } from "astro:content";

export const LEVEL_LABEL = {
  beginner: "başlanğıc",
  intermediate: "orta",
  advanced: "irəli",
} as const;

export interface GoItem {
  slug: string;
  title: string;
  sub: string;
  status: "ready" | "planned";
  level: keyof typeof LEVEL_LABEL;
  duration?: number;
  href: string;
  /** 1-based position across the whole course. */
  n: number;
}

export interface GoSection {
  id: string;
  title: string;
  icon: string;
  color: string;
  description: string;
  level: keyof typeof LEVEL_LABEL;
  items: GoItem[];
}

/** Sections in `sections.yaml` order; examples sorted by `order` and numbered across the course. */
/** True while any ready lesson is adapted from Go by Example: its CC BY 3.0 attribution must stay. */
export async function hasAdaptedLessons(): Promise<boolean> {
  const examples = await getCollection("goExamples");
  return examples.some((e) => e.data.status === "ready" && e.data.source !== "original");
}

export async function getGoCatalog(): Promise<{ sections: GoSection[]; total: number }> {
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
