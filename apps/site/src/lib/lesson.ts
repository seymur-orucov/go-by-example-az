// Lesson loader and validator. Format: docs/DECISIONS.md, "Lesson content format".
// Pure Node + yaml + zod, so the build and `pnpm content:check` share it.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { z } from "astro/zod";
import { parse as parseYaml } from "yaml";
import {
  parseSession,
  sessionFileSchema,
  transcript,
  type AreasFrame,
  type GraphFrame,
  type SessionFile,
} from "./session.ts";
import { layoutGraph, type GraphLayout } from "./graph.ts";
import { renderPreview } from "./markdown.ts";

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

/** A value as the program prints it; YAML numbers and booleans are kept as their text. */
const visValue = z.union([z.string(), z.number(), z.boolean()]).transform(String);

/** A map after the step: entries in print order (fmt sorts the keys). */
const visMap = z
  .object({
    kind: z.literal("map"),
    name: z.string(),
    entries: z.record(z.string(), visValue),
    /** Keys added or changed by the step. */
    fresh: z.array(z.string()).optional(),
    /** Keys deleted by the step: drawn struck through, not counted in len. */
    gone: z.array(z.string()).optional(),
    /** A read in the step: `v, ok := m[key]`. */
    lookup: z.object({ key: z.string(), value: visValue, ok: z.boolean() }).strict().optional(),
  })
  .strict()
  .superRefine((v, ctx) => {
    for (const k of v.fresh ?? [])
      if (!(k in v.entries))
        ctx.addIssue({ code: "custom", message: `fresh key "${k}" is not in entries` });
    for (const k of v.gone ?? [])
      if (k in v.entries)
        ctx.addIssue({ code: "custom", message: `gone key "${k}" is still in entries` });
    if (v.lookup && v.lookup.ok !== v.lookup.key in v.entries)
      ctx.addIssue({
        code: "custom",
        message: `lookup "${v.lookup.key}": ok does not match entries`,
      });
  });

/** A channel after the step: its buffer, who sends, who receives and what went through. */
const visChannel = z
  .object({
    kind: z.literal("channel"),
    name: z.string(),
    /** 0 for an unbuffered channel: one hand-to-hand slot is drawn. */
    cap: z.number().int().nonnegative(),
    /** Values waiting in the buffer, oldest first. */
    buf: z.array(visValue).default([]),
    /** Indexes into `buf` added by the step. */
    fresh: z.array(z.number().int().nonnegative()).optional(),
    from: z.string().optional(),
    to: z.string().optional(),
    /** Values the receiver took during the step, in order. */
    took: z.array(visValue).optional(),
    /** Who had to wait during the step. */
    waited: z.enum(["sender", "receiver"]).optional(),
    closed: z.boolean().optional(),
  })
  .strict()
  .superRefine((v, ctx) => {
    if (v.buf.length > v.cap)
      ctx.addIssue({
        code: "custom",
        message: `buf holds ${v.buf.length} values, cap is ${v.cap}`,
      });
    for (const i of v.fresh ?? [])
      if (i >= v.buf.length)
        ctx.addIssue({ code: "custom", message: `fresh index ${i} is outside buf` });
  });

/** Goroutines on a time axis: one row per goroutine, bars in milliseconds. */
const visTimeline = z
  .object({
    kind: z.literal("timeline"),
    /** Length of the axis in ms. */
    total: z.number().positive(),
    rows: z
      .array(
        z
          .object({
            name: z.string(),
            bars: z.array(
              z
                .object({
                  from: z.number().nonnegative(),
                  to: z.number().nonnegative(),
                  label: z.string().optional(),
                  /** work (default), wait (blocked), cut (stopped because main returned) */
                  state: z.enum(["work", "wait", "cut"]).default("work"),
                })
                .strict(),
            ),
          })
          .strict(),
      )
      .min(1),
    note: z.string().optional(),
  })
  .strict()
  .superRefine((v, ctx) => {
    for (const r of v.rows)
      for (const b of r.bars)
        if (b.from >= b.to || b.to > v.total)
          ctx.addIssue({
            code: "custom",
            message: `${r.name}: bar ${b.from}–${b.to} is outside 0–${v.total}`,
          });
  });

/** Tone of a box: plain, the good / bad side of a choice, or the point of the step. */
const tone = z.enum(["good", "bad", "accent"]).optional();

/**
 * A row of boxes (text lessons, hand-written): versions on a timeline, copies of a file, the
 * parts of something. `arrows` draws › between the boxes.
 */
const visFlow = z
  .object({
    kind: z.literal("flow"),
    caption: z.string().min(1),
    arrows: z.boolean().optional(),
    items: z
      .array(z.object({ label: z.string().min(1), sub: z.string().optional(), tone }).strict())
      .min(1)
      .max(8),
    note: z.string().optional(),
  })
  .strict();

/** Two variants side by side, compared aspect by aspect (text lessons, hand-written). */
const visCompare = z
  .object({
    kind: z.literal("compare"),
    caption: z.string().min(1),
    a: z.object({ title: z.string().min(1), sub: z.string().optional() }).strict(),
    b: z.object({ title: z.string().min(1), sub: z.string().optional() }).strict(),
    rows: z
      .array(
        z
          .object({
            aspect: z.string().min(1),
            a: z.string().min(1),
            b: z.string().min(1),
            /** Which side wins on this aspect, if any. */
            better: z.enum(["a", "b"]).optional(),
          })
          .strict(),
      )
      .min(1)
      .max(8),
    note: z.string().optional(),
  })
  .strict();

/**
 * Places side by side — computers, servers, repositories — with labelled arrows between
 * neighbours (diagram lessons, hand-written): `links[i]` joins `nodes[i]` and `nodes[i + 1]`;
 * `right` labels the → arrow, `left` the ← arrow. Stacked top to bottom on a phone.
 */
const visDiagram = z
  .object({
    kind: z.literal("diagram"),
    caption: z.string().min(1),
    nodes: z
      .array(
        z
          .object({
            title: z.string().min(1),
            sub: z.string().optional(),
            /** Short lines inside the box: branches, commits, files. */
            lines: z.array(z.string().min(1)).max(6).optional(),
            tone,
          })
          .strict(),
      )
      .min(2)
      .max(4),
    links: z.array(
      z.object({ right: z.string().optional(), left: z.string().optional() }).strict(),
    ),
    note: z.string().optional(),
  })
  .strict()
  .superRefine((v, ctx) => {
    if (v.links.length !== v.nodes.length - 1) {
      ctx.addIssue({
        code: "custom",
        message: `${v.nodes.length} nodes need ${v.nodes.length - 1} links, got ${v.links.length}`,
      });
    }
    v.links.forEach((l, i) => {
      if (!l.right && !l.left) {
        ctx.addIssue({ code: "custom", message: `link ${i}: give it a right or a left label` });
      }
    });
  });

/**
 * A drawn mockup of a web page (ui lessons, hand-written — not a screenshot, so it does not go
 * stale and follows the site theme): an address bar, optional tabs, a main column and an
 * optional side column of simple elements. `mark` puts a numbered badge on an element (or tab)
 * and its text in the legend under the mockup; numbers follow the order of the page (tabs,
 * main, side).
 */
const uiMark = { mark: z.string().min(1).optional() };
const uiIcon = z.enum(["folder", "file", "open", "closed", "merged", "key", "device", "user"]);
const uiBase = z.discriminatedUnion("type", [
  z
    .object({
      type: z.literal("heading"),
      text: z.string().min(1),
      sub: z.string().optional(),
      ...uiMark,
    })
    .strict(),
  z.object({ type: z.literal("text"), text: z.string().min(1), ...uiMark }).strict(),
  z
    .object({
      type: z.literal("field"),
      label: z.string().min(1),
      value: z.string().optional(),
      placeholder: z.string().optional(),
      hint: z.string().optional(),
      /** A green check (`ok`) or a red message (`error`) under the field. */
      state: z.enum(["ok", "error"]).optional(),
      ...uiMark,
    })
    .strict(),
  z
    .object({
      type: z.literal("select"),
      label: z.string().min(1),
      value: z.string().min(1),
      ...uiMark,
    })
    .strict(),
  z
    .object({
      type: z.literal("button"),
      label: z.string().min(1),
      tone: z.enum(["primary", "default", "danger"]).optional(),
      ...uiMark,
    })
    .strict(),
  z
    .object({
      type: z.literal("check"),
      label: z.string().min(1),
      sub: z.string().optional(),
      checked: z.boolean().optional(),
      radio: z.boolean().optional(),
      ...uiMark,
    })
    .strict(),
  z
    .object({
      type: z.literal("list"),
      items: z
        .array(
          z
            .object({
              title: z.string().min(1),
              sub: z.string().optional(),
              icon: uiIcon.optional(),
              /** Short text on the right: a date, a count, a label. */
              meta: z.string().optional(),
            })
            .strict(),
        )
        .min(1)
        .max(8),
      ...uiMark,
    })
    .strict(),
  /** Monospace box: a clone URL, recovery codes, a token. */
  z
    .object({
      type: z.literal("code"),
      text: z.string().min(1),
      label: z.string().optional(),
      ...uiMark,
    })
    .strict(),
  /** A grey placeholder for a picture: a QR code, an avatar, an image. */
  z
    .object({
      type: z.literal("box"),
      label: z.string().min(1),
      shape: z.enum(["square", "round", "wide"]).optional(),
      ...uiMark,
    })
    .strict(),
  z.object({ type: z.literal("divider") }).strict(),
]);
const uiElement = z.union([
  uiBase,
  /** Elements side by side (stacked on a phone). */
  z.object({ type: z.literal("row"), items: z.array(uiBase).min(2).max(4), ...uiMark }).strict(),
]);
export type UiElement = z.infer<typeof uiElement>;
const visUi = z
  .object({
    kind: z.literal("ui"),
    caption: z.string().min(1),
    /** Shown in the address bar, e.g. `github.com/signup`. */
    url: z.string().min(1),
    tabs: z
      .array(
        z
          .object({
            label: z.string().min(1),
            count: z.number().int().nonnegative().optional(),
            active: z.boolean().optional(),
            ...uiMark,
          })
          .strict(),
      )
      .max(8)
      .optional(),
    main: z.array(uiElement).min(1).max(14),
    side: z.array(uiElement).max(8).optional(),
    note: z.string().optional(),
  })
  .strict()
  .superRefine((v, ctx) => {
    const marks = uiMarks(v);
    if (marks.length > 6) {
      ctx.addIssue({ code: "custom", message: `${marks.length} marks; keep it to 6 per mockup` });
    }
  });

/** The mark texts of a mockup in page order (tabs, main, side), numbered from 1 by the renderer. */
export function uiMarks(v: {
  tabs?: { mark?: string }[];
  main: UiElement[];
  side?: UiElement[];
}): string[] {
  const out: string[] = [];
  const walk = (els: UiElement[]) => {
    for (const el of els) {
      if ("mark" in el && el.mark) out.push(el.mark);
      if (el.type === "row") walk(el.items);
    }
  };
  for (const t of v.tabs ?? []) if (t.mark) out.push(t.mark);
  walk(v.main);
  walk(v.side ?? []);
  return out;
}

export const visSchema = z.discriminatedUnion("kind", [
  visSlice,
  visMap,
  visChannel,
  visTimeline,
  visFlow,
  visCompare,
  visDiagram,
  visUi,
]);

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
/**
 * The commit graph after a step, recorded like `areas`; `files` (set in steps.yaml) also shows
 * each commit's parent and snapshot: which files are new, changed or the same as in the parent.
 */
export interface VisGraph extends GraphLayout {
  kind: "graph";
  files: boolean;
  head: GraphFrame["head"];
  count: number;
}
export type Vis = z.infer<typeof visSchema> | VisAreas | VisGraph;

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
  /** Markdown code lessons: the step's lines rendered as GitHub shows them (HTML). */
  preview?: string;
}

export interface Lesson {
  slug: string;
  /** `code`: Go program; `session`: recorded terminal session; `text`: no code pane (concept, compare). */
  mode: "code" | "session" | "text";
  /** The code pane: `main.go` (Go) or `session.sh` (terminal sessions), markers removed. */
  code: string;
  lang: "go" | "bash" | "markdown";
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
  /** Markdown code lessons: the whole file rendered (the "full result" view). */
  fullPreview?: string;
}

// "// @step" is accepted too: gofmt adds the space when a marker sits right above a top-level declaration.
const MARKER = /^\s*\/\/ ?@step\s+(\S+)\s*$/;
const END_MARKER = /^\s*\/\/ ?@end\s*$/;
const indentOf = (line: string): number => /^\s*/.exec(line)![0].replace(/\t/g, "    ").length;

/** Strips `//@step <id>` / `//@end` markers and computes each step's line range. */
export function parseCode(
  src: string,
  markers: { step: RegExp; end: RegExp } = { step: MARKER, end: END_MARKER },
): { code: string; steps: CodeStep[] } {
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
    const m = markers.step.exec(line);
    if (m) {
      if (!ID.test(m[1]!)) throw new Error(`invalid step id "${m[1]}"`);
      close();
      open = { id: m[1]!, from: lines.length + 1, to: 0 };
    } else if (markers.end.test(line)) {
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
    mode: "code",
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
    .object({
      vis: z.enum(["areas", "graph"]).optional(),
      /** graph only: show each commit's parent and files. */
      files: z.boolean().optional(),
    })
    .strict()
    .refine((v) => v.files === undefined || v.vis === "graph", {
      message: "files is an option of vis: graph",
    })
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
    if (stepData[s.id]?.vis === "graph" && !recorded?.frames[s.id]?.graph) {
      problems.push(
        `step "${s.id}": vis graph, but no graph was recorded (outside a repository, or run: pnpm content:run ${technology}/${slug})`,
      );
    }
  }

  if (problems.length) throw new Error(`${technology}/${slug}:\n  - ${problems.join("\n  - ")}`);

  let prev: AreasFrame | null = null;
  let prevGraph: GraphFrame | null = null;
  return {
    slug,
    mode: "session",
    code: session.code,
    lang: "bash",
    file: "terminal",
    run: null,
    intro: text.intro,
    steps: session.steps.map((s) => {
      const section = text.sections.find((t) => t.id === s.id)!;
      const ran = recorded!.commands.filter((c) => c.step === s.id);
      const frame = recorded!.frames[s.id]?.areas ?? null;
      const graph = recorded!.frames[s.id]?.graph ?? null;
      const want = stepData[s.id] ?? {};
      let vis: Vis | undefined;
      if (want.vis === "areas" && frame) vis = areasVis(frame, prev);
      if (want.vis === "graph" && graph) {
        vis = {
          kind: "graph",
          files: !!want.files,
          head: graph.head,
          count: graph.commits.length,
          ...layoutGraph(graph, prevGraph, { detail: !!want.files }),
        };
      }
      prev = frame;
      prevGraph = graph;
      const out = transcript(ran);
      return { ...s, title: section.title, body: section.body, out: out || undefined, vis };
    }),
    outro: text.outro,
    quiz: quizParsed.data!,
    takeaways: takeawaysParsed.data!,
    output,
  };
}

/** steps.yaml of a text lesson: an optional hand-written visual per step (no slice: it is Go's). */
const textStepsSchema = z.record(
  z.string().regex(ID),
  z
    .object({ vis: visSchema.optional() })
    .strict()
    .nullable()
    .transform((v) => v ?? {}),
);

/**
 * Loads and validates a ready text lesson (kinds `concept` and `compare`): content/<technology>/
 * lessons/<slug>/ with `lesson.<locale>.md`, `steps.yaml` (optional `vis` per step: `flow`,
 * `compare`, `diagram` or `ui`), `quiz.<locale>.yaml` and `takeaways.<locale>.yaml` — no code, no
 * session. `require` demands that visual in at least one step (compare, diagram and ui lessons).
 */
export function loadTextLesson(
  technology: string,
  slug: string,
  opts: { locale?: string; require?: "compare" | "diagram" | "ui" } = {},
): Lesson {
  const { locale = "az", require } = opts;
  const dir = join(CONTENT_ROOT, technology, "lessons", slug);
  const files = {
    text: join(dir, `lesson.${locale}.md`),
    steps: join(dir, "steps.yaml"),
    quiz: join(dir, `quiz.${locale}.yaml`),
    takeaways: join(dir, `takeaways.${locale}.yaml`),
  };
  const missing = Object.values(files).filter((f) => !existsSync(f));
  if (missing.length) {
    const names = missing.map((f) => f.slice(dir.length + 1)).join(", ");
    throw new Error(`${technology}/${slug}: missing ${names}`);
  }
  for (const stray of ["session.sh", "main.go"]) {
    if (existsSync(join(dir, stray))) {
      throw new Error(`${technology}/${slug}: a text lesson has no ${stray} (check the node kind)`);
    }
  }

  const problems: string[] = [];
  const text = parseLessonText(readFileSync(files.text, "utf8"));
  const stepsParsed = textStepsSchema.safeParse(readYaml(files.steps) ?? {});
  if (!stepsParsed.success) problems.push(`steps.yaml: ${formatZod(stepsParsed.error)}`);
  const stepData = stepsParsed.success ? stepsParsed.data : {};
  const quizParsed = quizSchema.safeParse(readYaml(files.quiz));
  if (!quizParsed.success) problems.push(`quiz.${locale}.yaml: ${formatZod(quizParsed.error)}`);
  const takeawaysParsed = takeawaysSchema.safeParse(readYaml(files.takeaways));
  if (!takeawaysParsed.success) {
    problems.push(`takeaways.${locale}.yaml: ${formatZod(takeawaysParsed.error)}`);
  }

  if (text.sections.length < 2 || text.sections.length > 6) {
    problems.push(`lesson.${locale}.md: ${text.sections.length} steps, expected 2–6`);
  }
  const ids = text.sections.map((s) => s.id);
  const dup = ids.find((id, i) => ids.indexOf(id) !== i);
  if (dup) problems.push(`lesson.${locale}.md: duplicate step id "${dup}"`);
  for (const id of Object.keys(stepData)) {
    if (!ids.includes(id)) problems.push(`steps.yaml: unknown step "${id}"`);
  }
  const vises = Object.values(stepData).map((d) => d.vis);
  const TEXT_VIS = ["flow", "compare", "diagram", "ui"];
  const goOnly = vises.find((v) => v && !TEXT_VIS.includes(v.kind));
  if (goOnly) {
    problems.push(
      `steps.yaml: "${goOnly.kind}" is a Go visual; text lessons use flow, compare, diagram or ui`,
    );
  }
  if (require && !vises.some((v) => v?.kind === require)) {
    problems.push(
      `steps.yaml: a ${require} lesson needs a \`${require}\` visual in at least one step`,
    );
  }

  if (problems.length) throw new Error(`${technology}/${slug}:\n  - ${problems.join("\n  - ")}`);

  return {
    slug,
    mode: "text",
    code: "",
    lang: "bash",
    file: "",
    run: null,
    intro: text.intro,
    steps: text.sections.map((s) => ({
      id: s.id,
      from: 0,
      to: 0,
      title: s.title,
      body: s.body,
      vis: stepData[s.id]?.vis,
    })),
    outro: text.outro,
    quiz: quizParsed.data!,
    takeaways: takeawaysParsed.data!,
    output: "",
  };
}

/** Step markers of a Markdown file: `<!-- @step id -->` and `<!-- @end -->` on their own lines. */
const MD_MARKERS = {
  step: /^\s*<!--\s*@step\s+(\S+)\s*-->\s*$/,
  end: /^\s*<!--\s*@end\s*-->\s*$/,
};

/**
 * Loads and validates a ready `code` lesson of a syllabus technology about Markdown:
 * content/<technology>/lessons/<slug>/ with ONE Markdown file (e.g. `README.md`) split into steps by
 * `<!-- @step id -->` markers, `lesson.<locale>.md` with the same step ids, an optional
 * `steps.yaml` (hand-written `vis` per step), quiz and takeaways. Instead of a program's output each
 * step shows its lines rendered as GitHub shows them (`preview`), and the pane can show the whole
 * file rendered (`fullPreview`).
 */
export function loadCodeLesson(technology: string, slug: string, locale = "az"): Lesson {
  const dir = join(CONTENT_ROOT, technology, "lessons", slug);
  const docs = readdirSync(dir).filter((n) => /\.md$/i.test(n) && !/^lesson\./.test(n));
  if (docs.length !== 1) {
    throw new Error(
      `${technology}/${slug}: a code lesson needs exactly one Markdown file besides lesson.${locale}.md, found ${docs.length ? docs.join(", ") : "none"}`,
    );
  }
  const file = docs[0]!;
  const files = {
    text: join(dir, `lesson.${locale}.md`),
    quiz: join(dir, `quiz.${locale}.yaml`),
    takeaways: join(dir, `takeaways.${locale}.yaml`),
  };
  const missing = Object.values(files).filter((f) => !existsSync(f));
  if (missing.length) {
    const names = missing.map((f) => f.slice(dir.length + 1)).join(", ");
    throw new Error(`${technology}/${slug}: missing ${names}`);
  }

  const problems: string[] = [];
  let parsed: { code: string; steps: CodeStep[] } = { code: "", steps: [] };
  try {
    parsed = parseCode(readFileSync(join(dir, file), "utf8"), MD_MARKERS);
  } catch (e) {
    problems.push(`${file}: ${(e as Error).message}`);
  }
  const { code, steps: codeSteps } = parsed;
  const text = parseLessonText(readFileSync(files.text, "utf8"));
  const stepsFile = join(dir, "steps.yaml");
  const stepsParsed = textStepsSchema.safeParse(
    existsSync(stepsFile) ? (readYaml(stepsFile) ?? {}) : {},
  );
  if (!stepsParsed.success) problems.push(`steps.yaml: ${formatZod(stepsParsed.error)}`);
  const stepData = stepsParsed.success ? stepsParsed.data : {};
  const quizParsed = quizSchema.safeParse(readYaml(files.quiz));
  if (!quizParsed.success) problems.push(`quiz.${locale}.yaml: ${formatZod(quizParsed.error)}`);
  const takeawaysParsed = takeawaysSchema.safeParse(readYaml(files.takeaways));
  if (!takeawaysParsed.success) {
    problems.push(`takeaways.${locale}.yaml: ${formatZod(takeawaysParsed.error)}`);
  }

  const codeIds = codeSteps.map((s) => s.id).join(", ");
  const textIds = text.sections.map((s) => s.id).join(", ");
  if (!codeSteps.length) problems.push(`${file}: no <!-- @step --> markers`);
  if (codeIds !== textIds) {
    problems.push(`step ids differ: ${file} [${codeIds}] vs lesson.${locale}.md [${textIds}]`);
  }
  for (const id of Object.keys(stepData)) {
    if (!codeSteps.some((s) => s.id === id)) problems.push(`steps.yaml: unknown step "${id}"`);
  }
  if (problems.length) throw new Error(`${technology}/${slug}:\n  - ${problems.join("\n  - ")}`);

  const lines = code.replace(/\n$/, "").split("\n");
  return {
    slug,
    mode: "code",
    code,
    lang: "markdown",
    file,
    run: null,
    intro: text.intro,
    steps: codeSteps.map((s) => {
      const section = text.sections.find((t) => t.id === s.id)!;
      return {
        ...s,
        title: section.title,
        body: section.body,
        vis: stepData[s.id]?.vis,
        preview: renderPreview(lines.slice(s.from - 1, s.to).join("\n")),
      };
    }),
    outro: text.outro,
    quiz: quizParsed.data!,
    takeaways: takeawaysParsed.data!,
    output: "",
    fullPreview: renderPreview(code),
  };
}
