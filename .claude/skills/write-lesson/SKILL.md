---
name: write-lesson
description: Write or rewrite an original Go lesson in content/go/examples/<slug>/ (main.go, lesson.az.md, steps.yaml, quiz.az.yaml, takeaways.az.yaml, output.txt, meta.yaml) and verify it with Go. Use when the user asks to write, rewrite or add a lesson, or to make an adapted lesson original.
---

# Write an original lesson

Rules come from docs/DECISIONS.md ("Original content", "Lesson content format"). Read the
format section there and one existing `source: original` lesson before starting.

## 1. Brief (before writing anything)

- Read `content/go/examples/<slug>/meta.yaml` (title, section, order) and the **previous
  lessons** in course order (`content/go/sections.yaml` + `order`): use only what they
  taught. If the lesson needs a later concept, keep it out or explain it in one clause.
- Write down for yourself: the 3–5 ideas the lesson teaches, one per step, and one
  real-life context for the whole program (see section 2).

## 2. Originality (required)

- Write the code and text **from scratch**. Do not open, recall or translate Go by Example
  (or any other site's) code or text for this topic.
- **Self-check:** list the best-known examples of this topic (Go by Example, the Go Tour,
  popular tutorials: `"go" + "lang"`, `"hello world"`, `math.Sin(n)`, `3e20 / n`,
  `make([]string, 3)` with `"a", "b", "c"`, `"apple"`, `"initial"`, …). If your code
  shares values, names or structure with any of them, change it.
- Use a **real-life context** so the example is clearly ours and easy to remember: prices,
  a shopping cart, a library, bus routes, exam grades, a phone contact list, temperatures,
  a café menu. One context per lesson, kept consistent across steps. **Everything in
  `main.go` and `output.txt` is English** — strings, printed text, comments, identifiers
  (`"tea house"`, not `"çay evi"`): these files are shared by every locale, so Azerbaijani
  there would clash with a translated lesson text. Azerbaijani goes only into the
  `*.az.*` files. Do not tie the text to a locale-specific value ("the word has two `ə`");
  the text may only refer to values the English code really contains. Exception: unicode
  and rune lessons use language-neutral multi-byte characters (`café`, `Zürich`), and the
  text may mention Azerbaijani letters such as `ə` in prose.
- **Money is in US dollars** (`USD` in output, "dollar" in text and comments), never manat
  or another local currency: lessons will be translated, and readers in other countries
  must understand the example without local knowledge.

## 3. Language and style

- Text is Azerbaijani. **Programming terms are not translated**: slice, map, struct,
  interface, method, receiver, pointer, goroutine, channel, closure, package, zero value,
  literal, … are written in English (explain a term in Azerbaijani the first time it
  appears, then just use it). Ordinary words stay Azerbaijani: dəyişən, sabit, funksiya,
  dövr, şərt, tip, dəyər. Keywords and identifiers go in backticks.
- **Short but high quality**: every sentence adds something (no filler like "bu çox
  vacibdir"). Say *what* the code does and *why*.
- **Length follows the topic, not a fixed count.** One sentence is rarely enough to
  introduce a concept a beginner has not met:
  - **Intro**: 2–4 sentences, one or two short paragraphs. Cover what the concept is (with
    everyday examples), how it differs from the closest concept already taught (constant
    vs variable, slice vs array, method vs function), and what it is good for. Explain any
    new word it relies on in passing ("kompilyasiya zamanı, yəni proqram işə düşməzdən
    əvvəl").
  - **Steps**: usually 2–3 sentences; a harder idea (untyped constants, shared slice
    memory, closures capturing variables, goroutine scheduling) may take 4–5 or a second
    paragraph. Do not stretch an easy step to match.
  - Do not repeat in the intro what a step explains, and vice versa.
- A real-life comparison is welcome in the text when it makes the idea clearer
  ("slice — rezin çanta kimi: lazım olanda böyüyür").
- At most one note per step: `> **Diqqət:** …` for a pitfall, `> **Bilgi:** …` for a tip.
- 3–5 steps. Code stays short: the whole `main.go` should fit on one screen (~30 lines).

## 4. Files

- `main.go`: plain runnable Go, `//@step <id>` before each step's code (`// @step` is fine
  above a top-level declaration, gofmt writes it that way), `//@end` to close a step early.
  Step ids are short English kebab-case and **stable** once published.
- `lesson.az.md`: intro, then `## Title {#id}` per step in the same order, optional outro.
- `steps.yaml`: per step `out` (exactly what that step prints; use `|` for several lines)
  and optional `vis` (see `visSchema` in `apps/site/src/lib/lesson.ts`; only `kind: slice`
  exists today — adding a kind means a schema entry and a branch in
  `apps/site/src/components/Vis.astro`).
- `quiz.az.yaml`: **5–10 questions** depending on the topic; mostly "Bu kod nə çap
  edəcək?" with a short `code`, plus "which line does not compile?" for typical mistakes.
  2–4 options, one `answer` (0-based), an `explain` of one sentence. Distractors must be
  plausible mistakes, not jokes.
- `takeaways.az.yaml`: the "Yadda saxla" card shown left of the quiz. `rules`: 3–6 key points
  and gotchas of **this** lesson (what a reader must remember: syntax rules, typical compile
  errors, behaviours that surprise beginners). `practices`: 1–4 best practices (habits that
  make the code clearer or safer). Base both on what the lesson and its quiz actually teach;
  do not introduce new concepts, and never recommend something unsafe (for example `float64`
  for money). One sentence each, inline Markdown (backticks) only.

  ```yaml
  rules:
    - "`append` yeni slice qaytarır, nəticəni saxlamaq lazımdır: `s = append(s, x)`."
  practices:
    - "`append`-in nəticəsini həmişə eyni dəyişənə yazın."
  ```
- `meta.yaml`: `status: ready`, `source: original`, `duration` (minutes, honest).
- `output.txt`: generated, never typed (step 5).

## 5. Verify (all of it, every time)

Run from the lesson folder:

```sh
gofmt -l .            # must print nothing
go vet main.go
go run main.go > output.txt
```

- Verify **every quiz answer** by compiling or running the snippet (a scratch file in the
  scratchpad, not in the repo); for "does not compile" questions, check the compiler error.
- Check every claim in `takeaways.az.yaml` against the lesson text and the compiler.
- From the repo root: `pnpm content:check` (ids, `out` in order, quiz and takeaways shape, `source`).
- `pnpm build`, then look at `/go/<slug>/` (steps, highlighted lines, output, visual, summary card, quiz).

## 6. Hand-off

- Tell the user, in Azerbaijani, what the lesson teaches, which real-life context it uses
  and what was verified; ask them to review tone and clarity. Do not mark a lesson done in
  docs/ROADMAP.md before the user has reviewed it.
- Commit on a content branch: `feat(content): …` (new) or `refactor(content): …` (rewrite).
