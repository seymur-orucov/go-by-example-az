// Lesson loader and validator. Format: docs/DECISIONS.md, "Lesson content format".
// Pure Node + yaml + zod, so the build and `pnpm content:check` share it.
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { z } from "astro/zod";
import { parse as parseYaml } from "yaml";
import {
  parseSession,
  sessionFileSchema,
  transcript,
  type AreasFrame,
  type SessionFile,
} from "./session.ts";

/** Both `astro build` and the check script run with apps/site as the working directory. */
export const CONTENT_ROOT = resolve(process.cwd(), "../../content");

const ID = /^[a-z0-9][a-z0-9-]*$/;

const visSlice = z
  .object({
    kind: z.literal("slice"),
    name: z.string(),
    nil: z.boolean().optional(),
    cells: z.array(z.string()),
    len: z.number().int().nonnegative(),
    cap: z.number().int().nonnegative(),
    fresh: z.array(z.number().int().nonnegative()).optional(),
    window: z.tuple([z.number().int().nonnegative(), z.number().int().nonnegative()]).optional(),
  })
  .strict();

export const visSchema = z.discriminatedUnion("kind", [visSlice]);

type Fresh<T> = T & { fresh?: boolean };
/**
 * The three areas of a Git repository after a step — not written by hand: recorded by
 * `pnpm content:run` from the real repository. `fresh` marks what changed since the previous step.
 */
export interface VisAreas {
  kind: "areas";
  work: Fresh<AreasFrame["work"][number]>[];
  index: Fresh<AreasFrame["index"][number]>[];
  repo: Fresh<AreasFrame["repo"]>;
}
export type Vis = z.infer<typeof visSchema> | VisAreas;

const stepDataSchema = z
  .object({ out: z.string().optional(), vis: visSchema.optional() })
  .strict()
  .nullable()
  .transform((v) => v ?? {});

const stepsFileSchema = z.record(z.string().regex(ID), stepDataSchema);

const quizQuestionSchema = z
  .object({
    question: z.string().min(1),
    code: z.string().optional(),
    options: z.array(z.string().min(1)).min(2).max(5),
    answer: z.number().int().nonnegative(),
    explain: z.string().optional(),
  })
  .strict()
  .refine((q) => q.answer < q.options.length, { message: "answer is out of range of options" });

/** The user's rule: 5–10 questions per ready lesson, depending on the topic. */
export const quizSchema = z.array(quizQuestionSchema).min(5).max(10);
export type QuizQuestion = z.infer<typeof quizQuestionSchema>;

/**
 * "Yadda saxla" card at the end of a lesson (it sits left of the quiz): the key points of
 * the topic (`rules`) and the habits worth keeping (`practices`). Inline Markdown only.
 */
export const takeawaysSchema = z
  .object({
    rules: z.array(z.string().min(1)).min(3).max(6),
    practices: z.array(z.string().min(1)).min(1).max(4),
  })
  .strict();
export type Takeaways = z.infer<typeof takeawaysSchema>;

export interface CodeStep {
  id: string;
  /** 1-based, inclusive, in the code with markers stripped. */
  from: number;
  to: number;
}

export interface LessonStep extends CodeStep {
  title: string;
  /** Markdown. */
  body: string;
  out?: string;
  vis?: Vis;
}

export interface Lesson {
  slug: string;
  /** The code pane: `main.go` (Go) or `session.sh` (terminal sessions), markers removed. */
  code: string;
  lang: "go" | "bash";
  /** Name shown on the code window. */
  file: string;
  /** The command the "full output" button shows above the output; null for sessions (the transcript has its own `$` lines). */
  run: string | null;
  intro: string;
  steps: LessonStep[];
  /** Markdown after the first `##` heading without an id; may be empty. */
  outro: string;
  quiz: QuizQuestion[];
  takeaways: Takeaways;
  output: string;
}

// "// @step" is accepted too: gofmt adds the space when a marker sits right above a top-level declaration.
const MARKER = /^\s*\/\/ ?@step\s+(\S+)\s*$/;
const END_MARKER = /^\s*\/\/ ?@end\s*$/;
const indentOf = (line: string): number => /^\s*/.exec(line)![0].replace(/\t/g, "    ").length;

/** Strips `//@step <id>` / `//@end` markers and computes each step's line range. */
export function parseCode(src: string): { code: string; steps: CodeStep[] } {
  const lines: string[] = [];
  const steps: CodeStep[] = [];
  let open: CodeStep | null = null;
  const close = () => {
    if (!open) return;
    open.to = lines.length;
    steps.push(open);
    open = null;
  };
  for (const line of src.replace(/\r\n/g, "\n").replace(/\n+$/, "").split("\n")) {
    const m = MARKER.exec(line);
    if (m) {
      if (!ID.test(m[1]!)) throw new Error(`invalid step id "${m[1]}"`);
      close();
      open = { id: m[1]!, from: lines.length + 1, to: 0 };
    } else if (END_MARKER.test(line)) {
      close();
    } else {
      lines.push(line);
    }
  }
  close();

  // Trim trailing blank lines, and closing braces that belong to an outer block (e.g. the end of main).
  for (const s of steps) {
    const base = indentOf(lines[s.from - 1] ?? "");
    while (s.to > s.from) {
      const l = lines[s.to - 1]!;
      if (l.trim() === "" || (/^\s*[})\]]\s*$/.test(l) && indentOf(l) < base)) s.to--;
      else break;
    }
    if (s.to < s.from) throw new Error(`step "${s.id}" has no code`);
  }
  const ids = steps.map((s) => s.id);
  const dup = ids.find((id, i) => ids.indexOf(id) !== i);
  if (dup) throw new Error(`duplicate step id "${dup}"`);
  return { code: lines.join("\n") + "\n", steps };
}

const HEADING = /^##[ \t]+(.+?)[ \t]*$/;
const HEADING_ID = /^(.*?)\s*\{#([^}]+)\}$/;

/** Splits lesson text into intro, one section per `## Title {#id}`, and an outro (from the first `##` without an id). */
export function parseLessonText(md: string): {
  intro: string;
  sections: { id: string; title: string; body: string }[];
  outro: string;
} {
  const intro: string[] = [];
  const outro: string[] = [];
  const sections: { id: string; title: string; body: string[] }[] = [];
  let target = intro;
  for (const line of md.replace(/\r\n/g, "\n").split("\n")) {
    const h = HEADING.exec(line);
    if (h && target !== outro) {
      const withId = HEADING_ID.exec(h[1]!);
      if (withId) {
        const section = { id: withId[2]!, title: withId[1]!, body: [] as string[] };
        if (!ID.test(section.id)) throw new Error(`invalid step id "${section.id}" in heading`);
        sections.push(section);
        target = section.body;
        continue;
      }
      target = outro;
    }
    target.push(line);
  }
  const text = (a: string[]) => a.join("\n").trim();
  return {
    intro: text(intro),
    sections: sections.map((s) => ({ id: s.id, title: s.title, body: text(s.body) })),
    outro: text(outro),
  };
}

function readYaml(file: string): unknown {
  return parseYaml(readFileSync(file, "utf8"));
}

function formatZod(e: z.ZodError): string {
  return e.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`).join("; ");
}

/** Loads and validates a ready lesson. Throws an Error listing every problem found. */
export function loadLesson(
  slug: string,
  opts: { technology?: string; locale?: string } = {},
): Lesson {
  const { technology = "go", locale = "az" } = opts;
  const dir = join(CONTENT_ROOT, technology, "examples", slug);
  const files = {
    code: join(dir, "main.go"),
    text: join(dir, `lesson.${locale}.md`),
    steps: join(dir, "steps.yaml"),
    quiz: join(dir, `quiz.${locale}.yaml`),
    takeaways: join(dir, `takeaways.${locale}.yaml`),
    output: join(dir, "output.txt"),
  };
  const problems: string[] = [];
  const missing = Object.values(files).filter((f) => !existsSync(f));
  if (missing.length) {
    throw new Error(`${slug}: missing ${missing.map((f) => f.slice(dir.length + 1)).join(", ")}`);
  }

  const { code, steps: codeSteps } = parseCode(readFileSync(files.code, "utf8"));
  const text = parseLessonText(readFileSync(files.text, "utf8"));
  const output = readFileSync(files.output, "utf8").replace(/\r\n/g, "\n");

  const stepsParsed = stepsFileSchema.safeParse(readYaml(files.steps) ?? {});
  if (!stepsParsed.success) problems.push(`steps.yaml: ${formatZod(stepsParsed.error)}`);
  const stepData = stepsParsed.success ? stepsParsed.data : {};

  const quizParsed = quizSchema.safeParse(readYaml(files.quiz));
  if (!quizParsed.success) problems.push(`quiz.${locale}.yaml: ${formatZod(quizParsed.error)}`);

  const takeawaysParsed = takeawaysSchema.safeParse(readYaml(files.takeaways));
  if (!takeawaysParsed.success) {
    problems.push(`takeaways.${locale}.yaml: ${formatZod(takeawaysParsed.error)}`);
  }

  // Step ids must agree across main.go, the lesson text and steps.yaml.
  const codeIds = codeSteps.map((s) => s.id).join(", ");
  const textIds = text.sections.map((s) => s.id).join(", ");
  if (!codeSteps.length) problems.push("main.go: no //@step markers");
  if (codeIds !== textIds) {
    problems.push(`step ids differ: main.go [${codeIds}] vs lesson.${locale}.md [${textIds}]`);
  }
  for (const id of Object.keys(stepData)) {
    if (!codeSteps.some((s) => s.id === id)) problems.push(`steps.yaml: unknown step "${id}"`);
  }

  // Expected outputs must appear in output.txt, whole lines, in step order.
  let cursor = 0;
  for (const s of codeSteps) {
    const out = stepData[s.id]?.out;
    if (out === undefined) continue;
    const want = out.replace(/\n$/, "");
    let at = output.indexOf(want, cursor);
    while (
      at >= 0 &&
      !((at === 0 || output[at - 1] === "\n") && /^(\n|$)/.test(output.slice(at + want.length)))
    ) {
      at = output.indexOf(want, at + 1);
    }
    if (at < 0)
      problems.push(
        `step "${s.id}": out ${JSON.stringify(want)} not found in output.txt (in order)`,
      );
    else cursor = at + want.length;
  }

  if (problems.length) throw new Error(`${slug}:\n  - ${problems.join("\n  - ")}`);

  return {
    slug,
    code,
    lang: "go",
    file: "main.go",
    run: "go run main.go",
    intro: text.intro,
    steps: codeSteps.map((s) => {
      const section = text.sections.find((t) => t.id === s.id)!;
      const data = stepData[s.id] ?? {};
      // YAML block scalars (`out: |`) end with a newline; the terminal shows one span per line.
      const out = data.out?.replace(/\n$/, "");
      return { ...s, title: section.title, body: section.body, ...data, out };
    }),
    outro: text.outro,
    quiz: quizParsed.success ? quizParsed.data : [],
    takeaways: takeawaysParsed.success ? takeawaysParsed.data : { rules: [], practices: [] },
    output,
  };
}

const sessionStepsSchema = z.record(
  z.string().regex(ID),
  z
    .object({ vis: z.enum(["areas"]).optional() })
    .strict()
    .nullable()
    .transform((v) => v ?? {}),
);

/** Marks what is new or changed in `cur` compared with the previous step's frame. */
function areasVis(cur: AreasFrame, prev: AreasFrame | null): VisAreas {
  const had = (
    list: { name: string; state: string }[] | undefined,
    f: { name: string; state: string },
  ) => !!list?.some((p) => p.name === f.name && p.state === f.state);
  return {
    kind: "areas",
    work: cur.work.map((f) => ({ ...f, fresh: !had(prev?.work, f) })),
    index: cur.index.map((f) => ({ ...f, fresh: !had(prev?.index, f) })),
    repo: { ...cur.repo, fresh: cur.repo.commit?.hash !== prev?.repo.commit?.hash },
  };
}

/**
 * Loads and validates a ready terminal-session lesson: content/<technology>/lessons/<slug>/ with
 * `session.sh`, the generated `session.json` and `output.txt`, `lesson.<locale>.md`, `steps.yaml`,
 * `quiz.<locale>.yaml` and `takeaways.<locale>.yaml`. Throws an Error listing every problem found.
 */
export function loadSessionLesson(
  technology: string,
  slug: string,
  opts: { locale?: string } = {},
): Lesson {
  const { locale = "az" } = opts;
  const dir = join(CONTENT_ROOT, technology, "lessons", slug);
  const files = {
    session: join(dir, "session.sh"),
    recorded: join(dir, "session.json"),
    text: join(dir, `lesson.${locale}.md`),
    steps: join(dir, "steps.yaml"),
    quiz: join(dir, `quiz.${locale}.yaml`),
    takeaways: join(dir, `takeaways.${locale}.yaml`),
    output: join(dir, "output.txt"),
  };
  const missing = Object.values(files).filter((f) => !existsSync(f));
  if (missing.length) {
    const names = missing.map((f) => f.slice(dir.length + 1)).join(", ");
    const hint = missing.includes(files.recorded)
      ? ` (run: pnpm content:run ${technology}/${slug})`
      : "";
    throw new Error(`${technology}/${slug}: missing ${names}${hint}`);
  }

  const problems: string[] = [];
  const session = parseSession(readFileSync(files.session, "utf8"));
  const text = parseLessonText(readFileSync(files.text, "utf8"));
  const output = readFileSync(files.output, "utf8").replace(/\r\n/g, "\n");

  let recorded: SessionFile | null = null;
  const rec = sessionFileSchema.safeParse(JSON.parse(readFileSync(files.recorded, "utf8")));
  if (!rec.success) problems.push(`session.json: ${formatZod(rec.error)}`);
  else recorded = rec.data;

  // session.json must come from the current session.sh.
  const sameCommands =
    recorded !== null &&
    recorded.commands.length === session.commands.length &&
    recorded.commands.every((c, i) => {
      const s = session.commands[i]!;
      return c.cmd === s.cmd && c.step === s.step && c.hidden === s.hidden && c.fail === s.fail;
    });
  if (recorded && !sameCommands) {
    problems.push(`session.json is out of date: run pnpm content:run ${technology}/${slug}`);
  }
  if (recorded && transcript(recorded.commands) + "\n" !== output) {
    problems.push(
      `output.txt does not match session.json: run pnpm content:run ${technology}/${slug}`,
    );
  }

  const stepsParsed = sessionStepsSchema.safeParse(readYaml(files.steps) ?? {});
  if (!stepsParsed.success) problems.push(`steps.yaml: ${formatZod(stepsParsed.error)}`);
  const stepData = stepsParsed.success ? stepsParsed.data : {};

  const quizParsed = quizSchema.safeParse(readYaml(files.quiz));
  if (!quizParsed.success) problems.push(`quiz.${locale}.yaml: ${formatZod(quizParsed.error)}`);
  const takeawaysParsed = takeawaysSchema.safeParse(readYaml(files.takeaways));
  if (!takeawaysParsed.success) {
    problems.push(`takeaways.${locale}.yaml: ${formatZod(takeawaysParsed.error)}`);
  }

  const codeIds = session.steps.map((s) => s.id).join(", ");
  const textIds = text.sections.map((s) => s.id).join(", ");
  if (!session.steps.length) problems.push("session.sh: no #@step markers");
  if (codeIds !== textIds) {
    problems.push(`step ids differ: session.sh [${codeIds}] vs lesson.${locale}.md [${textIds}]`);
  }
  for (const id of Object.keys(stepData)) {
    if (!session.steps.some((s) => s.id === id)) problems.push(`steps.yaml: unknown step "${id}"`);
  }
  for (const s of session.steps) {
    if (stepData[s.id]?.vis === "areas" && !recorded?.frames[s.id]?.areas) {
      problems.push(`step "${s.id}": vis areas, but the step does not end inside a Git repository`);
    }
  }

  if (problems.length) throw new Error(`${technology}/${slug}:\n  - ${problems.join("\n  - ")}`);

  let prev: AreasFrame | null = null;
  return {
    slug,
    code: session.code,
    lang: "bash",
    file: "terminal",
    run: null,
    intro: text.intro,
    steps: session.steps.map((s) => {
      const section = text.sections.find((t) => t.id === s.id)!;
      const ran = recorded!.commands.filter((c) => c.step === s.id);
      const frame = recorded!.frames[s.id]?.areas ?? null;
      const vis = stepData[s.id]?.vis === "areas" && frame ? areasVis(frame, prev) : undefined;
      prev = frame;
      const out = transcript(ran);
      return { ...s, title: section.title, body: section.body, out: out || undefined, vis };
    }),
    outro: text.outro,
    quiz: quizParsed.data!,
    takeaways: takeawaysParsed.data!,
    output,
  };
}
