// Validates every `status: ready` lesson (format: docs/DECISIONS.md, "Lesson content format").
// Run from apps/site: `pnpm content:check`. Node strips the TypeScript types natively.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import { CONTENT_ROOT, loadLesson } from "../src/lib/lesson.ts";

const examplesDir = join(CONTENT_ROOT, "go", "examples");
let ready = 0;
const failures: string[] = [];

for (const slug of readdirSync(examplesDir).sort()) {
  const meta = parse(readFileSync(join(examplesDir, slug, "meta.yaml"), "utf8")) as {
    status?: string;
  };
  if (meta.status !== "ready") continue;
  ready++;
  try {
    const lesson = loadLesson(slug);
    console.log(
      `ok   ${slug} (${lesson.steps.length} steps, ${lesson.quiz.length} quiz questions)`,
    );
  } catch (e) {
    failures.push(e instanceof Error ? e.message : String(e));
  }
}

for (const f of failures) console.error(`FAIL ${f}`);
console.log(`${ready - failures.length}/${ready} ready lessons valid`);
process.exitCode = failures.length ? 1 : 0;
