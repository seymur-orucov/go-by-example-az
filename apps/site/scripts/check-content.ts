// Validates the learning content (format: docs/DECISIONS.md, "Lesson content format" and
// "Content pipeline"): every `status: ready` Go lesson, every syllabus, and every ready
// lesson of a syllabus technology (terminal sessions and text lessons). Run from apps/site: `pnpm content:check`.
// Node strips the TypeScript types natively.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import { CONTENT_ROOT, loadLesson } from "../src/lib/lesson.ts";
import {
  hasSyllabus,
  loadLessonMeta,
  loadNodeLesson,
  loadSyllabus,
  type SyllabusNode,
} from "../src/lib/syllabus.ts";

let ready = 0;
const failures: string[] = [];

// ---- Go: content/go/examples/<slug>/
const examplesDir = join(CONTENT_ROOT, "go", "examples");
for (const slug of readdirSync(examplesDir).sort()) {
  const meta = parse(readFileSync(join(examplesDir, slug, "meta.yaml"), "utf8")) as {
    status?: string;
    source?: string;
  };
  if (meta.status !== "ready") continue;
  ready++;
  // docs/DECISIONS.md, "Original content": the footer attribution depends on this field.
  if (meta.source !== "original" && meta.source !== "adapted") {
    failures.push(`${slug}: meta.yaml needs \`source: original\` or \`source: adapted\``);
    continue;
  }
  try {
    const lesson = loadLesson(slug);
    const { rules, practices } = lesson.takeaways;
    console.log(
      `ok   ${slug} (${lesson.steps.length} steps, ${rules.length}+${practices.length} takeaways, ${lesson.quiz.length} quiz questions)`,
    );
  } catch (e) {
    failures.push(e instanceof Error ? e.message : String(e));
  }
}

// ---- Syllabus technologies: content/<technology>/syllabus.yaml + lessons/<node id>/
for (const tech of readdirSync(CONTENT_ROOT).sort()) {
  if (!hasSyllabus(tech)) continue;
  let nodes: SyllabusNode[];
  try {
    const syllabus = loadSyllabus(tech);
    nodes = syllabus.modules.flatMap((m) => m.nodes);
    console.log(
      `ok   ${tech}/syllabus.yaml (${syllabus.modules.length} modules, ${nodes.length} nodes)`,
    );
  } catch (e) {
    failures.push(e instanceof Error ? e.message : String(e));
    continue;
  }
  const lessonsDir = join(CONTENT_ROOT, tech, "lessons");
  const folders = existsSync(lessonsDir) ? readdirSync(lessonsDir).sort() : [];
  for (const id of folders) {
    const node = nodes.find((n) => n.id === id);
    if (!node) {
      failures.push(`${tech}/lessons/${id}: not a node of ${tech}/syllabus.yaml`);
      continue;
    }
    try {
      const meta = loadLessonMeta(tech, id);
      if (meta?.status !== "ready") continue;
      ready++;
      const lesson = loadNodeLesson(tech, node);
      const { rules, practices } = lesson.takeaways;
      console.log(
        `ok   ${tech}/${id} (${lesson.steps.length} steps, ${rules.length}+${practices.length} takeaways, ${lesson.quiz.length} quiz questions)`,
      );
    } catch (e) {
      failures.push(e instanceof Error ? e.message : String(e));
    }
  }
}

for (const f of failures) console.error(`FAIL ${f}`);
console.log(`${ready - failures.length}/${ready} ready lessons valid`);
process.exitCode = failures.length ? 1 : 0;
