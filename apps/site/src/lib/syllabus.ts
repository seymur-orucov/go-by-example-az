// Syllabus loader and validator: content/<technology>/syllabus.yaml, written by the
// plan-syllabus skill (format: .claude/skills/plan-syllabus/SKILL.md, section 7).
// Pure Node + yaml + zod, so the build and `pnpm content:check` share it.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "astro/zod";
import { parse as parseYaml } from "yaml";
import type { CatalogItem, CatalogSection } from "./catalog.ts";
import { CONTENT_ROOT, loadSessionLesson, loadTextLesson, type Lesson } from "./lesson.ts";

const ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export const LESSON_KINDS = [
  "code",
  "terminal",
  "state",
  "diagram",
  "compare",
  "concept",
  "ui",
] as const;
/** Kinds whose stage is a picture, so the node must list the "visual" facet. */
const VISUAL_KINDS: readonly string[] = ["state", "diagram", "compare", "ui"];
export const FACETS = ["theory", "practice", "visual", "test", "interview"] as const;

const nodeSchema = z
  .object({
    id: z.string().regex(ID),
    title: z.string().min(1),
    outcome: z.string().min(1),
    kind: z.enum(LESSON_KINDS),
    facets: z.array(z.enum(FACETS)).min(1),
    requires: z.array(z.string().regex(ID)),
    duration: z.number().int().positive(),
    topics: z.array(z.string().min(1)).optional(),
  })
  .strict();

const partSchema = z
  .object({
    id: z.string().regex(ID),
    title: z.string().min(1),
    description: z.string().min(1),
  })
  .strict();

const moduleSchema = z
  .object({
    id: z.string().regex(ID),
    /** Part id; required when the syllabus has `parts`. */
    part: z.string().regex(ID).optional(),
    title: z.string().min(1),
    description: z.string().min(1),
    nodes: z.array(nodeSchema).min(1),
  })
  .strict();

export const syllabusSchema = z
  .object({
    technology: z.string().regex(ID),
    title: z.string().min(1),
    status: z.enum(["draft", "approved"]),
    audience: z.string().min(1),
    level: z.string().min(1),
    updated: z.union([z.string(), z.date()]),
    syntax: z.string().optional(),
    outOfScope: z.array(z.string()).optional(),
    sources: z.array(z.object({ name: z.string(), url: z.url(), used: z.string() }).strict()),
    /** Optional top-level split of a large syllabus (e.g. Git / GitHub); modules name their part. */
    parts: z.array(partSchema).min(2).optional(),
    modules: z.array(moduleSchema).min(1),
  })
  .strict();

export type Syllabus = z.infer<typeof syllabusSchema>;
export type SyllabusNode = z.infer<typeof nodeSchema>;
export type SyllabusPart = z.infer<typeof partSchema>;

/**
 * Rules the schema cannot express: unique ids, prerequisites exist and come earlier (so no
 * cycles), and with `parts` every module names a known part and each part's modules are contiguous.
 */
function checkGraph(s: Syllabus): string[] {
  const problems: string[] = [];
  const seen = new Set<string>();
  const modules = new Set<string>();
  const partIds = new Set((s.parts ?? []).map((p) => p.id));
  if (partIds.size !== (s.parts ?? []).length) problems.push("duplicate part id");
  const closedParts = new Set<string>();
  let currentPart: string | undefined;
  for (const m of s.modules) {
    if (modules.has(m.id)) problems.push(`duplicate module id "${m.id}"`);
    modules.add(m.id);
    if (s.parts) {
      if (!m.part || !partIds.has(m.part)) {
        problems.push(`module "${m.id}": part "${m.part ?? ""}" is missing or unknown`);
      } else if (m.part !== currentPart) {
        if (closedParts.has(m.part)) problems.push(`module "${m.id}": part "${m.part}" is split`);
        if (currentPart) closedParts.add(currentPart);
        currentPart = m.part;
      }
    } else if (m.part) {
      problems.push(`module "${m.id}": has a part, but the syllabus has no parts`);
    }
    for (const n of m.nodes) {
      if (seen.has(n.id)) problems.push(`duplicate node id "${n.id}"`);
      for (const r of n.requires) {
        if (!seen.has(r))
          problems.push(`${n.id}: requires "${r}", which is missing or comes later`);
      }
      if (!n.facets.includes("test")) problems.push(`${n.id}: every node needs the "test" facet`);
      if (VISUAL_KINDS.includes(n.kind) && !n.facets.includes("visual")) {
        problems.push(`${n.id}: kind "${n.kind}" needs the "visual" facet`);
      }
      seen.add(n.id);
    }
  }
  return problems;
}

export const syllabusPath = (technology: string) => join(CONTENT_ROOT, technology, "syllabus.yaml");

export const hasSyllabus = (technology: string) => existsSync(syllabusPath(technology));

/** Loads and validates a syllabus. Throws an Error listing every problem found. */
export function loadSyllabus(technology: string): Syllabus {
  const parsed = syllabusSchema.safeParse(
    parseYaml(readFileSync(syllabusPath(technology), "utf8")),
  );
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`);
    throw new Error(`${technology}/syllabus.yaml:\n  - ${issues.join("\n  - ")}`);
  }
  const problems = checkGraph(parsed.data);
  if (problems.length) {
    throw new Error(`${technology}/syllabus.yaml:\n  - ${problems.join("\n  - ")}`);
  }
  if (parsed.data.technology !== technology) {
    throw new Error(
      `${technology}/syllabus.yaml: technology is "${parsed.data.technology}", expected "${technology}"`,
    );
  }
  return parsed.data;
}

// ---- Lessons of a syllabus technology: content/<technology>/lessons/<node id>/ ----------------

/** meta.yaml of a lesson folder. Title, module, order and minutes come from the syllabus. */
export const lessonMetaSchema = z
  .object({
    subtitle: z.string().min(1),
    status: z.enum(["ready", "planned"]),
    level: z.enum(["beginner", "intermediate", "advanced"]),
    source: z.literal("original"),
  })
  .strict();
export type LessonMeta = z.infer<typeof lessonMetaSchema>;

export const lessonDir = (technology: string, id: string) =>
  join(CONTENT_ROOT, technology, "lessons", id);

/** The lesson's meta.yaml, or null while the node has no lesson folder yet (it shows as planned). */
export function loadLessonMeta(technology: string, id: string): LessonMeta | null {
  const file = join(lessonDir(technology, id), "meta.yaml");
  if (!existsSync(file)) return null;
  const parsed = lessonMetaSchema.safeParse(parseYaml(readFileSync(file, "utf8")));
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`);
    throw new Error(`${technology}/${id}/meta.yaml: ${issues.join("; ")}`);
  }
  return parsed.data;
}

/** Kinds whose lessons have no code pane: text, steps and hand-written visuals. */
const TEXT_KINDS: readonly string[] = ["concept", "compare", "diagram", "ui"];

/** Loads a ready lesson of a syllabus node with the loader its kind needs. */
export function loadNodeLesson(technology: string, node: SyllabusNode): Lesson {
  if (TEXT_KINDS.includes(node.kind)) {
    const require =
      node.kind === "compare" || node.kind === "diagram" || node.kind === "ui"
        ? node.kind
        : undefined;
    return loadTextLesson(technology, node.id, { require });
  }
  if (node.kind === "terminal" || node.kind === "state")
    return loadSessionLesson(technology, node.id);
  throw new Error(
    `${technology}/${node.id}: lessons of kind "${node.kind}" cannot be rendered yet`,
  );
}

/** Module colors and icons by position (syllabi do not choose them; Go's sections.yaml does). */
const MODULE_LOOK = [
  { color: "#60a5fa", icon: "spark" },
  { color: "#818cf8", icon: "stack" },
  { color: "#a78bfa", icon: "func" },
  { color: "#c084fc", icon: "shape" },
  { color: "#f472b6", icon: "alert" },
  { color: "#22d3ee", icon: "flow" },
  { color: "#2dd4bf", icon: "text" },
  { color: "#94a3b8", icon: "file" },
  { color: "#7dd3fc", icon: "globe" },
];

/** The catalog of a syllabus technology, in the shape the sidebar and the lesson page use. */
export function getSyllabusCatalog(technology: string): {
  syllabus: Syllabus;
  sections: CatalogSection[];
  total: number;
} {
  const syllabus = loadSyllabus(technology);
  let n = 0;
  const sections = syllabus.modules.map((m, i): CatalogSection => {
    const items = m.nodes.map((node): CatalogItem => {
      const meta = loadLessonMeta(technology, node.id);
      return {
        slug: `${technology}/${node.id}`,
        title: node.title,
        sub: meta?.subtitle ?? "",
        status: meta?.status ?? "planned",
        level: meta?.level ?? "beginner",
        duration: node.duration,
        href: `/${technology}/${node.id}/`,
        n: ++n,
      };
    });
    const look = MODULE_LOOK[i % MODULE_LOOK.length]!;
    const part = syllabus.parts?.find((p) => p.id === m.part);
    return {
      id: m.id,
      title: m.title,
      description: m.description,
      ...(part && { part }),
      ...look,
      level: items[0]?.level ?? "beginner",
      items,
    };
  });
  return { syllabus, sections, total: n };
}
