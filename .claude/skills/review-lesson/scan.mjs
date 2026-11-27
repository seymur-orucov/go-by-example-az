#!/usr/bin/env node
// Triage scan for Azerbaijani lesson text: phrase-level "AI tone" signals and sentence metrics.
// It is a first filter, not a verdict — the review-lesson skill reads the lesson itself.
//
//   node .claude/skills/review-lesson/scan.mjs go/maps git/first-commit
//   node .claude/skills/review-lesson/scan.mjs git            # every lesson of a technology
//   node .claude/skills/review-lesson/scan.mjs --detail go/maps
//   node .claude/skills/review-lesson/scan.mjs --json go
//
// Targets: <technology>/<id>, <technology>, or a lesson directory path.
// Go lessons live in content/go/examples/<slug>/, others in content/<technology>/lessons/<id>/.
// Extend PHRASES when the user flags a new pattern (and document it in ai-tells.md).

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");

// [category, pattern, weight]. Patterns are lower-case Azerbaijani; a pattern matches at a word
// start and may take suffixes ("güclü" also matches "güclüdür"). A trailing "$" means whole word.
// strong: one hit is worth a look. weak: normal Azerbaijani, suspicious only when repeated.
const PHRASES = [
  // Openers and reader-addressing frames
  ["opener", "təsəvvür edin", "strong"],
  ["opener", "gəlin baxaq", "strong"],
  ["opener", "gəlin görək", "strong"],
  ["opener", "gəlin öyrənək", "strong"],
  ["opener", "gəlin birlikdə", "strong"],
  ["opener", "qeyd etmək lazımdır", "strong"],
  ["opener", "qeyd etmək vacibdir", "strong"],
  ["opener", "onu da qeyd edək", "strong"],
  ["opener", "bilməlisiniz ki", "strong"],
  ["opener", "bəs bu nə deməkdir", "strong"],
  ["opener", "sual yarana bilər", "strong"],
  ["opener", "maraqlıdır ki", "strong"],
  ["opener", "əziz oxucu", "strong"],
  ["opener", "hörmətli oxucu", "strong"],
  ["opener", "qeyd edək ki", "weak"],
  ["opener", "bu dərsdə biz", "weak"],
  // Closers that restate
  ["closer", "beləliklə", "strong"],
  ["closer", "nəticə etibarilə", "strong"],
  ["closer", "bir sözlə", "strong"],
  ["closer", "xülasə", "strong"],
  ["closer", "yekun olaraq", "strong"],
  ["closer", "ümid edirik", "strong"],
  ["closer", "ümid edirəm", "strong"],
  ["closer", "artıq siz", "strong"],
  ["closer", "uğurlar$", "strong"],
  ["closer", "nəticədə", "weak"],
  // Hype and ornament
  ["hype", "güclü alət", "strong"],
  ["hype", "möhtəşəm", "strong"],
  ["hype", "sehrli", "strong"],
  ["hype", "sehr$", "strong"],
  ["hype", "inanılmaz", "strong"],
  ["hype", "heyrətamiz", "strong"],
  ["hype", "fantastik", "strong"],
  ["hype", "əvəzsiz", "strong"],
  ["hype", "həyati əhəmiyyət", "strong"],
  ["hype", "ayrılmaz hissə", "strong"],
  ["hype", "təməl daş", "strong"],
  ["hype", "qapı açır", "strong"],
  ["hype", "qapılarını açır", "strong"],
  ["hype", "dünyasına", "strong"],
  ["hype", "sirlərin", "strong"],
  ["hype", "səyahət", "strong"],
  ["hype", "onurğa sütunu", "strong"],
  ["hype", "ürəyidir", "strong"],
  ["hype", "zərif", "strong"],
  ["hype", "mükəmməl", "strong"],
  ["hype", "güclü", "weak"],
  ["hype", "mühüm rol", "weak"],
  ["hype", "əsas rol", "weak"],
  ["hype", "rol oynayır", "weak"],
  ["hype", "böyük əhəmiyyət", "weak"],
  ["hype", "asanlıqla", "weak"],
  ["hype", "rahatlıqla", "weak"],
  ["hype", "effektiv", "weak"],
  ["hype", "səmərəli", "weak"],
  // Filler and vague claims
  ["filler", "çox vacibdir", "strong"],
  ["filler", "son dərəcə", "strong"],
  ["filler", "mahiyyət etibarilə", "strong"],
  ["filler", "müəyyən mənada", "strong"],
  ["filler", "sadəcə olaraq", "strong"],
  ["filler", "əslində", "weak"],
  ["filler", "bir növ", "weak"],
  ["filler", "bir çox hallarda", "weak"],
  ["filler", "müxtəlif ssenari", "weak"],
  ["filler", "real layihələrdə", "weak"],
  ["filler", "geniş istifadə olunur", "weak"],
  ["filler", "geniş yayılmış", "weak"],
  ["filler", "ən yaxşı təcrübə", "weak"],
  ["filler", "vacibdir", "weak"],
  ["filler", "əhəmiyyətlidir", "weak"],
  ["filler", "demək olar ki", "weak"],
  ["filler", "xüsusilə də", "weak"],
  ["filler", "həmçinin də", "weak"],
  // Calques (English / Russian syntax in Azerbaijani words)
  ["calque", "hansı ki", "strong"],
  ["calque", "öz növbəsində", "strong"],
  ["calque", "oyuna daxil olur", "strong"],
  ["calque", "günün sonunda", "strong"],
  ["calque", "imkan verir", "weak"],
  ["calque", "imkanı verir", "weak"],
  ["calque", "imkan yaradır", "weak"],
  ["calque", "ilə gəlir", "weak"],
  ["calque", "həyata keçir", "weak"],
  ["calque", "təmin edir", "weak"],
  ["calque", "nəzərə alaraq", "weak"],
  ["calque", "istifadə edərək", "weak"],
  ["calque", "bu o deməkdir ki", "weak"],
  ["calque", "tərəfindən", "weak"],
  ["calque", "baxımından", "weak"],
  ["calque", "problem odur ki", "weak"],
  ["calque", "etibarilə", "weak"],
];

const STRUCTURES = [
  // "Bu sadəcə X deyil, Y-dir" — the AI antithesis. Weak: "yalnız X deyil, Y də" is also plain
  // Azerbaijani (the approved what-is-version-control lesson uses it once).
  ["antithesis", /(?:sadəcə|yalnız|təkcə)\s[^.!?]{1,80}?\sdeyil\s*[,;:—–-]/u, "weak"],
  ["antithesis", /deyil\s*[—–]\s*(?:bu|o)\s/u, "strong"],
  ["exclamation", /!(?:\s|$)/u, "strong"],
  ["emoji", /\p{Extended_Pictographic}/u, "strong"],
];

const LONG_WORDS = 20; // Azerbaijani is agglutinative: 20 words is already a long sentence.
// write-lesson §3: "split a sentence that needs two commas and a colon". 4+ commas alone also
// counts; plain enumerations ("A, B və C") stay below both.
const isHeavy = (s) => {
  // Commas that only separate quoted strings or code ("A", "B" / `x`, `y`) are a list, not clauses.
  const plain = s
    .replace(/"[^"]*"|«[^»]*»/g, "Q")
    .replace(/(?<!\p{L})(CODE|Q)(\s*\([^)]*\))?,\s*(?=(CODE|Q)(?!\p{L}))/gu, "$1 ");
  const commas = (plain.match(/,/g) || []).length;
  return (commas >= 2 && s.includes(":")) || commas >= 4;
};
const INTRO_MAX = 4; // write-lesson §3: intro is 2–4 sentences
const CODE_MAX = 35; // write-lesson §3: main.go fits on one screen (~30 lines)

// The quiz is parsed with the site's own YAML package; without `pnpm install` the quiz checks
// are skipped.
let parseYaml = null;
try {
  const req = createRequire(join(ROOT, "apps/site/package.json"));
  parseYaml = req("yaml").parse;
} catch {
  /* quiz checks skipped */
}

const lower = (s) => s.toLocaleLowerCase("az");

function phraseRegex(p) {
  const whole = p.endsWith("$");
  const body = (whole ? p.slice(0, -1) : p).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?<!\\p{L})${body}${whole ? "(?!\\p{L})" : ""}`, "gu");
}
const COMPILED = PHRASES.map(([cat, p, w]) => ({
  cat,
  label: p.replace(/\$$/, ""),
  re: phraseRegex(p),
  w,
}));

// Markdown → plain prose; inline code becomes a single token so it still counts as a word.
function clean(line) {
  return line
    .replace(/`[^`]*`/g, "CODE")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\*\*|__|\*/g, "")
    .replace(/^>\s?/, "")
    .replace(/^(Diqqət|Bilgi):\s*/, "")
    .replace(/\{#[^}]*\}/g, "")
    .trim();
}

// Splits lesson.az.md into prose units with their first line number. Headings are skipped
// (for metrics), list items are their own units, fenced code is ignored.
function proseUnits(text) {
  const units = [];
  let buf = [];
  let start = 0;
  let fence = false;
  const flush = () => {
    if (buf.length) units.push({ line: start, text: buf.join(" ") });
    buf = [];
  };
  text.split(/\r?\n/).forEach((raw, i) => {
    if (/^\s*(```|~~~)/.test(raw)) {
      fence = !fence;
      flush();
      return;
    }
    if (fence) return;
    if (!raw.trim() || /^#{1,6}\s/.test(raw)) return flush();
    const item = /^\s*([-*+]|\d+\.)\s+/.test(raw);
    if (item) flush();
    const t = clean(raw.replace(/^\s*([-*+]|\d+\.)\s+/, ""));
    if (!t) return;
    if (!buf.length) start = i + 1;
    buf.push(t);
    if (item) flush();
  });
  flush();
  return units;
}

function sentences(unit) {
  return unit.text
    .split(/(?<=[.!?…])\s+(?=[\p{Lu}"«(0-9C])/u)
    .map((s) => s.trim())
    .filter((s) => /\p{L}/u.test(s));
}

// Text lines of the YAML files that a reader sees (questions, options, explanations, takeaways),
// without `code: |` blocks.
function yamlProse(text) {
  const out = [];
  let codeIndent = -1;
  text.split(/\r?\n/).forEach((raw, i) => {
    const indent = raw.search(/\S/);
    if (codeIndent >= 0) {
      if (indent === -1 || indent > codeIndent) return;
      codeIndent = -1;
    }
    if (/^\s*-?\s*code:\s*[|>]/.test(raw)) {
      codeIndent = indent;
      return;
    }
    const m = raw.match(/^\s*(?:-\s+)?(?:[a-z]+:\s*)?(.*)$/);
    const t = m ? clean(m[1].replace(/^["']|["']$/g, "")) : "";
    if (/\p{L}{3}/u.test(t) && !/^[a-z]+:$/.test(raw.trim())) out.push({ line: i + 1, text: t });
  });
  return out;
}

function scanLesson(dir, id) {
  const lessonFile = join(dir, "lesson.az.md");
  const md = readFileSync(lessonFile, "utf8");
  const units = proseUnits(md);
  const sents = units.flatMap((u) => sentences(u).map((s) => ({ line: u.line, text: s })));
  const lens = sents.map((s) => wordCount(s.text));
  const words = lens.reduce((a, b) => a + b, 0);
  const avg = sents.length ? words / sents.length : 0;
  const sd = sents.length
    ? Math.sqrt(lens.reduce((a, l) => a + (l - avg) ** 2, 0) / sents.length)
    : 0;

  const hits = [];
  const sources = [["lesson.az.md", units]];
  for (const f of ["quiz.az.yaml", "takeaways.az.yaml"]) {
    const p = join(dir, f);
    if (existsSync(p)) sources.push([f, yamlProse(readFileSync(p, "utf8"))]);
  }
  for (const [file, items] of sources) {
    for (const { line, text } of items) {
      const low = lower(text);
      for (const { cat, label, re, w } of COMPILED) {
        re.lastIndex = 0;
        for (const m of low.matchAll(re))
          hits.push({ file, line, cat, label, w, ctx: context(text, m.index) });
      }
      if (file !== "lesson.az.md") continue;
      for (const [cat, re, w] of STRUCTURES) {
        const m = low.match(re);
        // Weak structures are counted per pattern, so the label is the category, not the match.
        const label = w === "weak" ? cat : m?.[0].trim().slice(0, 40);
        if (m) hits.push({ file, line, cat, label, w, ctx: context(text, m.index) });
      }
    }
  }

  // Long sentences in the lesson and in the quiz/takeaways text the reader also sees.
  const yamlSents = sources
    .slice(1)
    .flatMap(([file, items]) =>
      items.flatMap((u) => sentences(u).map((text) => ({ file, line: u.line, text }))),
    );
  const long = [
    ...sents.map((s, i) => ({ file: "lesson.az.md", ...s, words: lens[i] })),
    ...yamlSents.map((s) => ({ ...s, words: wordCount(s.text) })),
  ].filter((s) => s.words > LONG_WORDS);
  const heavy = sents.filter((s) => isHeavy(s.text));
  const prose = units.map((u) => u.text).join(" ");
  const dashes = (prose.match(/\s[—–]\s|—/g) || []).length;
  const questions = sents.filter((s) => s.text.endsWith("?")).length;
  const checks = structureChecks(dir, md);

  const strong = hits.filter((h) => h.w === "strong");
  const weakCounts = {};
  for (const h of hits.filter((h) => h.w === "weak"))
    weakCounts[h.label] = (weakCounts[h.label] || 0) + 1;
  const weakRepeated = Object.entries(weakCounts).filter(([, n]) => n >= 2);
  const dashFlag = words > 0 && dashes / words > 1 / 80 ? 1 : 0;
  const points =
    strong.length +
    weakRepeated.reduce((a, [, n]) => a + n - 1, 0) +
    long.length +
    heavy.length +
    dashFlag +
    checks.length;

  return {
    id,
    dir,
    words,
    sentences: sents.length,
    avgWords: +avg.toFixed(1),
    sdWords: +sd.toFixed(1),
    long: long.map((s) => ({
      file: s.file,
      line: s.line,
      words: s.words,
      start: s.text.slice(0, 70),
    })),
    heavy: heavy.map((s) => ({ line: s.line, start: s.text.slice(0, 70) })),
    dashes,
    questions,
    checks,
    strong: strong.map(({ w: _w, ...h }) => h),
    weakRepeated: weakRepeated.map(([label, n]) => ({ label, n })),
    weak: hits.filter((h) => h.w === "weak").map(({ w: _w, ...h }) => h),
    points,
  };
}

function wordCount(text) {
  return text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}

// Cheap shape checks from write-lesson §3–4. Each failed check is one point.
function structureChecks(dir, md) {
  const out = [];
  const intro = md.split(/^##\s/m)[0];
  const introSents = proseUnits(intro).flatMap(sentences).length;
  if (introSents > INTRO_MAX) out.push(`intro has ${introSents} sentences (2–${INTRO_MAX})`);

  const goFile = join(dir, "main.go");
  if (existsSync(goFile)) {
    const n = readFileSync(goFile, "utf8").trimEnd().split(/\r?\n/).length;
    if (n > CODE_MAX) out.push(`main.go has ${n} lines (~30)`);
  }

  const quizFile = join(dir, "quiz.az.yaml");
  if (!parseYaml || !existsSync(quizFile)) return out;
  let quiz;
  try {
    quiz = parseYaml(readFileSync(quizFile, "utf8"));
  } catch (e) {
    out.push(`quiz.az.yaml does not parse: ${e.message.split("\n")[0]}`);
    return out;
  }
  if (!Array.isArray(quiz)) return out;
  if (quiz.length < 5 || quiz.length > 10) out.push(`quiz has ${quiz.length} questions (5–10)`);

  const positions = {};
  quiz.forEach((q, i) => {
    positions[q.answer] = (positions[q.answer] || 0) + 1;
    const opts = (q.options || []).map(String);
    const right = opts[q.answer];
    const others = opts.filter((_, j) => j !== q.answer);
    if (right === undefined || !others.length) return;
    // The right option is much longer than every distractor, usually because only it
    // carries a reason — a giveaway.
    const longest = Math.max(...others.map((o) => o.length));
    if (right.length >= longest * 1.6 && right.length - longest >= 15)
      out.push(`quiz question ${i + 1}: the right option is much longer than the others`);
  });
  const top = Math.max(...Object.values(positions));
  if (quiz.length >= 4 && top > quiz.length / 2)
    out.push(`quiz answers bunch up: ${JSON.stringify(positions)} (position: count)`);
  return out;
}

function context(text, index) {
  const from = Math.max(0, index - 30);
  return (
    (from ? "…" : "") + text.slice(from, index + 50).trim() + (index + 50 < text.length ? "…" : "")
  );
}

function lessonDirsOf(tech) {
  const base =
    tech === "go" ? join(ROOT, "content/go/examples") : join(ROOT, "content", tech, "lessons");
  if (!existsSync(base)) return [];
  return readdirSync(base)
    .filter((d) => existsSync(join(base, d, "lesson.az.md")))
    .map((d) => ({ dir: join(base, d), id: `${tech}/${d}` }));
}

function resolveTarget(t) {
  const asPath = resolve(t);
  if (existsSync(join(asPath, "lesson.az.md"))) return [{ dir: asPath, id: basename(asPath) }];
  const [tech, id] = t.replace(/\/$/, "").split("/");
  if (!id) return lessonDirsOf(tech);
  const dir =
    tech === "go"
      ? join(ROOT, "content/go/examples", id)
      : join(ROOT, "content", tech, "lessons", id);
  return existsSync(join(dir, "lesson.az.md")) ? [{ dir, id: `${tech}/${id}` }] : [];
}

const args = process.argv.slice(2);
const detail = args.includes("--detail");
const json = args.includes("--json");
const targets = args.filter((a) => !a.startsWith("--"));
if (!targets.length) {
  console.error("usage: scan.mjs [--detail] [--json] <technology>[/<id>] | <lesson dir> ...");
  process.exit(2);
}
const lessons = targets.flatMap((t) => {
  const found = resolveTarget(t);
  if (!found.length) console.error(`not found: ${t}`);
  return found;
});
const results = lessons
  .filter(({ dir }) => statSync(dir).isDirectory())
  .map(({ dir, id }) => scanLesson(dir, id))
  .sort((a, b) => b.points - a.points);

if (json) {
  console.log(JSON.stringify(results, null, 2));
} else {
  const pad = (s, n) => String(s).padEnd(n);
  console.log(
    pad("lesson", 38) +
      pad("pts", 5) +
      pad("strong", 7) +
      pad("weak×", 6) +
      pad("long", 5) +
      pad("heavy", 6) +
      pad("dash", 5) +
      pad("?", 3) +
      pad("chk", 4) +
      pad("sent", 5) +
      pad("avg±sd", 9),
  );
  for (const r of results) {
    console.log(
      pad(r.id, 38) +
        pad(r.points, 5) +
        pad(r.strong.length, 7) +
        pad(
          r.weakRepeated.reduce((a, w) => a + w.n, 0),
          6,
        ) +
        pad(r.long.length, 5) +
        pad(r.heavy.length, 6) +
        pad(r.dashes, 5) +
        pad(r.questions, 3) +
        pad(r.checks.length, 4) +
        pad(r.sentences, 5) +
        pad(`${r.avgWords}±${r.sdWords}`, 9),
    );
    if (!detail) continue;
    for (const h of r.strong)
      console.log(`    [${h.cat}] "${h.label}"  ${h.file}:${h.line}  ${h.ctx}`);
    for (const w of r.weakRepeated) {
      const where = r.weak.filter((h) => h.label === w.label).map((h) => `${h.file}:${h.line}`);
      console.log(`    [weak ×${w.n}] "${w.label}"  ${where.join(", ")}`);
    }
    // Single weak hits cost no points but are still worth a look (e.g. one "tərəfindən").
    for (const h of r.weak.filter((h) => !r.weakRepeated.some((w) => w.label === h.label)))
      console.log(`    [weak ×1, ${h.cat}] "${h.label}"  ${h.file}:${h.line}  ${h.ctx}`);
    for (const s of r.long) console.log(`    [long ${s.words}w] ${s.file}:${s.line}  ${s.start}…`);
    for (const s of r.heavy) console.log(`    [commas] lesson.az.md:${s.line}  ${s.start}…`);
    for (const c of r.checks) console.log(`    [check] ${c}`);
  }
  console.log(
    "\npts = strong + repeated weak + long (>20 words, lesson + quiz + takeaways) + heavy (2 commas" +
      " and a colon, or 4+ commas) + dash density + failed checks (chk).\nTriage only: read the lesson.",
  );
}
