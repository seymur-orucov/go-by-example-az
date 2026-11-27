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
- **Context check:** the context must show *why* the concept is needed, not just rename
  variables. Good: the booking error carries the room and hour because the caller needs
  them; the photo kiosk must keep running after one bad order. Bad: one theme stretched
  over unrelated helpers (counting answers, clamping ratings and a shortlist under "a hotel
  survey"). If the context only renames things, pick another one. For abstract mechanics
  (generics, iterators, `defer` order) choose a context where the problem the feature solves
  appears naturally (the same function needed for several types), let the first step show
  that problem, and keep the context light so the mechanism stays in focus.
- Quizzes may use other small contexts on purpose: they check that the reader can apply
  the idea in a new situation.
- **Money is in US dollars** (`USD` in output, "dollar" in text and comments), never manat
  or another local currency: lessons will be translated, and readers in other countries
  must understand the example without local knowledge.

## 3. Language and style

- Text is Azerbaijani. **Programming terms are not translated**: slice, map, struct,
  interface, method, receiver, pointer, goroutine, channel, closure, package, zero value,
  literal, … are written in English (explain a term in Azerbaijani the first time it
  appears, then just use it). Ordinary words stay Azerbaijani: dəyişən, sabit, funksiya,
  dövr, şərt, tip, dəyər. Keywords and identifiers go in backticks.
  [docs/GLOSSARY.md](../../../docs/GLOSSARY.md) lists how every term is written in the
  lessons and where it is first explained: follow it, link back instead of explaining a
  term again, and add a row when a lesson introduces a new term.
- **Short but high quality**: every sentence adds something (no filler like "bu çox
  vacibdir"). Say *what* the code does and *why*.
- **Length follows the topic, not a fixed count.** One sentence is rarely enough to
  introduce a concept a beginner has not met:
  - **Intro**: 2–4 sentences, one or two short paragraphs. Cover what the concept is (one
    plain example at most), how it differs from the closest concept already taught (constant
    vs variable, slice vs array, method vs function), and what it is good for. Explain any
    new word it relies on in passing ("kompilyasiya zamanı, yəni proqram işə düşməzdən
    əvvəl").
  - **Steps**: usually 2–3 sentences; a harder idea (untyped constants, shared slice
    memory, closures capturing variables, goroutine scheduling) may take 4–5 or a second
    paragraph. Do not stretch an easy step to match.
  - Do not repeat in the intro what a step explains, and vice versa.
- **Plain voice, no AI tone** (the user's review of the first 84 lessons, 2026-11-27: some
  explanations read like AI text, some examples are convoluted):
  - At most **one short comparison per lesson**, and only if it explains something the
    code cannot. No running metaphor (a kitchen, a café, a pizzeria) carried through every
    step; name what the code does in programming terms.
  - Short sentences, one idea each. Split a sentence that needs two commas and a colon.
    No ornate or solemn wording, no filler openers ("Təsəvvür edin ki…"), no summary
    sentence that repeats the step.
  - The example is the simplest data that shows the idea: few fields, plain names, no
    story to keep in mind. If the reader must follow the scenario to follow the code, cut
    the scenario.
- At most one note per step: `> **Diqqət:** …` for a pitfall, `> **Bilgi:** …` for a tip.
- 3–5 steps. Code stays short: the whole `main.go` should fit on one screen (~30 lines).

## 4. Files

- `main.go`: plain runnable Go, `//@step <id>` before each step's code (`// @step` is fine
  above a top-level declaration, gofmt writes it that way), `//@end` to close a step early.
  Step ids are short English kebab-case and **stable** once published.
- `lesson.az.md`: intro, then `## Title {#id}` per step in the same order, optional outro.
  Step headings are plain text: backticks there render literally.
- `steps.yaml`: per step `out` (exactly what that step prints; use `|` for several lines)
  and optional `vis` (see `visSchema` in `apps/site/src/lib/lesson.ts`): `slice` (memory
  cells, `len`/`cap`), `map` (entries in print order, `fresh` / `gone` keys, a `lookup`),
  `channel` (`cap`, `buf`, `from` → `to`, `took`, who `waited`), `timeline` (goroutines as
  bars in ms: `work`, `wait`, `cut`). A visual shows the state **after** the step and must
  match what the code really does; `pnpm content:check` rejects inconsistent data. Adding a
  kind means a schema entry and a branch in `apps/site/src/components/Vis.astro`.
- `quiz.az.yaml`: **5–10 questions** depending on the topic; mostly "Bu kod nə çap
  edəcək?" with a short `code`, plus "which line does not compile?" for typical mistakes.
  2–4 options, one `answer` (0-based), an `explain` of one sentence. Distractors must be
  plausible mistakes, not jokes. Spread the correct `answer` over all positions (0, 1, 2, 3)
  roughly evenly; the quiz does not shuffle options, so a fixed position can be guessed.
- When `output.txt` or a quiz quotes a Go error message verbatim (`day out of range`,
  `invalid syntax`), mention it in the hand-off: the wording may change in a later Go.
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

From the repo root, `pnpm content:go --write <slug>` runs `gofmt -l` and `go vet`, builds the
lesson, runs it in an empty temporary directory (stdout and stderr together,
`GOTRACEBACK=none`) and writes `output.txt`. Without `--write` it compares instead; CI runs
`pnpm content:go` on Linux for every lesson.

- **Concurrency and timing lessons:** the output must not depend on scheduling or machine
  speed. Collect results (a slice slot per goroutine, a fixed channel handoff, a count) and
  print from one goroutine; never print durations or timestamps. When timing is the point,
  print a comparison with a wide margin (at least ~100 ms; a relative one such as
  "concurrent < sequential" is safest). A lower bound equal to the exact sum of the
  `time.Sleep` calls can fail now and then on Windows. Run the program 20+ times, also while
  the machine is busy, and confirm the output never changes. Never run a data race as
  lesson code; describe it in the text or a quiz.
- A program that ends in a panic on purpose (the `panic` lesson) exits with code 2 and its
  stack trace holds paths and addresses. `GOTRACEBACK=none` (set by `content:go`) makes the
  file end with the bare `panic: <message>` line. Add every lesson that exits non-zero on
  purpose to `EXIT_CODES` in `apps/site/scripts/run-go.ts`.
- A Unix-only lesson (such as `syscall.Exec`) goes into `UNIX_ONLY` in the same script: it is
  skipped on Windows and checked by CI on Linux.
- Verify **every quiz answer** by compiling or running the snippet (a scratch file in the
  scratchpad, not in the repo); for "does not compile" questions, check the compiler error.
- Check every claim in `takeaways.az.yaml` against the lesson text and the compiler.
- From the repo root: `pnpm content:check` (ids, `out` in order, quiz and takeaways shape, `source`).
- `pnpm build`, then look at `/go/<slug>/` (steps, highlighted lines, output, visual, summary card, quiz).

## 6. Review before hand-off

Run the review-lesson skill on the lesson in a **fresh subagent** (it gets the lesson path and
the review-lesson files, not your view of the lesson — you wrote it, so you are the wrong
reader). Fix its `blocker` and `major` findings with the polish-lesson skill, then section 5
again if the code changed. Leave `minor` findings for the user to decide.

## 7. Hand-off

- Tell the user, in Azerbaijani, what the lesson teaches, which real-life context it uses
  and what was verified; give the review verdict and scores (before → after polish) and the
  open `minor` findings; ask them to review tone and clarity. Do not mark a lesson done in
  docs/ROADMAP.md before the user has reviewed it.
- Commit on a content branch: `feat(content): …` (new) or `refactor(content): …` (rewrite).
