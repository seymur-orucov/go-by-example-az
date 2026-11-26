// Shapes shared by every technology's catalog (Go from Content Collections, others from their
// syllabus.yaml): the lesson sidebar, the pager and the lesson page only depend on these.

export const LEVEL_LABEL = {
  beginner: "başlanğıc",
  intermediate: "orta",
  advanced: "irəli",
} as const;

export type Level = keyof typeof LEVEL_LABEL;

export interface CatalogItem {
  /** Unique across technologies: it keys the "learned" marks in localStorage (Go: "slices", Git: "git/three-areas"). */
  slug: string;
  title: string;
  sub: string;
  status: "ready" | "planned";
  level: Level;
  duration?: number;
  href: string;
  /** 1-based position across the whole course. */
  n: number;
}

export interface CatalogSection {
  id: string;
  title: string;
  icon: string;
  color: string;
  description: string;
  level: Level;
  items: CatalogItem[];
  /** The syllabus part the section belongs to (large syllabi only, e.g. Git / GitHub). */
  part?: { id: string; title: string; description: string };
}
