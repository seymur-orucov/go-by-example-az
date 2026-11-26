// The technologies the platform knows, with a status computed from the content — never set by
// hand: "ready" when every lesson is ready, "started" when at least one is, "soon" otherwise.
// Started and ready technologies are active (linked) everywhere they are listed.
import type { TechState } from "@platform/theme/data/platform";
import { getGoCatalog } from "./go";
import { getSyllabusCatalog, hasSyllabus } from "./syllabus";

export type TechStatus = TechState["status"];

/** The state the theme embeds in every page (ready / total are 0 before a course exists). */
export type Technology = TechState & { color: string };

/** Known technologies in display order; a course appears by adding content, not by editing this. */
const REGISTRY: { id: string; name: string; color: string }[] = [
  { id: "go", name: "Go", color: "#00add8" },
  { id: "git", name: "Git", color: "#f05033" },
  { id: "python", name: "Python", color: "#3776ab" },
  { id: "rust", name: "Rust", color: "#dea584" },
  { id: "typescript", name: "TypeScript", color: "#3178c6" },
  { id: "sql", name: "SQL", color: "#94a3b8" },
];

const statusOf = (ready: number, total: number): TechStatus =>
  ready === 0 ? "soon" : ready === total ? "ready" : "started";

async function counts(id: string): Promise<{ ready: number; total: number }> {
  let items: { status: string }[] = [];
  if (id === "go") items = (await getGoCatalog()).sections.flatMap((s) => s.items);
  else if (hasSyllabus(id)) items = getSyllabusCatalog(id).sections.flatMap((s) => s.items);
  return { ready: items.filter((it) => it.status === "ready").length, total: items.length };
}

/** Every known technology with its status; active ones first, each group in registry order. */
export async function getTechnologies(): Promise<Technology[]> {
  const list = await Promise.all(
    REGISTRY.map(async (t): Promise<Technology> => {
      const { ready, total } = await counts(t.id);
      const status = statusOf(ready, total);
      return { ...t, status, ready, total, href: status === "soon" ? undefined : `/${t.id}/` };
    }),
  );
  return [...list.filter((t) => t.status !== "soon"), ...list.filter((t) => t.status === "soon")];
}
