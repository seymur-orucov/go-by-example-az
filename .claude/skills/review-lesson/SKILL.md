---
name: review-lesson
description: Review written lessons (Go or any syllabus technology) for AI tone and quality — does the Azerbaijani read like an experienced instructor or like generated text, is it clear, accurate and well taught — and write a scored report with located findings that polish-lesson can fix. Read-only on the lesson. Use when the user types /review-lesson <technology>[/<id>], or asks to analyse, audit, score or check lessons for "AI slop", tone, clarity or quality.
---

# Review a lesson

The lesson is not changed here. The output is a report: scores, a verdict and **findings** —
each one located, quoted and explained — so `polish-lesson` (or the user) can fix exactly those
and nothing else.

Read first: [ai-tells.md](ai-tells.md) (what to look for), write-lesson §3 "Language and style"
(the house rules the lesson must already follow), [docs/GLOSSARY.md](../../../docs/GLOSSARY.md),
and one approved exemplar for calibration:

- syllabus technologies: the exemplar of the same kind (write-content "Exemplars");
- Go: no Go lesson has been approved through this review yet. Calibrate **voice** on the Git
  `concept` exemplar (`what-is-version-control`), and structure on write-lesson §3–4 (a code
  walkthrough legitimately has longer sentences than a concept lesson). When the user approves
  a reviewed Go lesson, add it here as the Go exemplar.

## 0. Targets and independence

- `go/<slug>` → `content/go/examples/<slug>/`; `<technology>/<id>` → `content/<technology>/lessons/<id>/`;
  `<technology>` alone → every ready lesson of it (batch, section 6).
- **Do not review your own fresh text in your own head.** If the lesson was written or rewritten
  in this session, run the review in a fresh `general-purpose` subagent: give it the lesson
  path, this file and ai-tells.md — not what you think is wrong with it. An agent handed your
  suspicion tends to confirm it.

## 1. Triage numbers

```sh
node .claude/skills/review-lesson/scan.mjs --detail <target>
```

Columns: `strong` phrase hits, `weak×` repeated weak hits (single weak hits are listed in
`--detail` but cost no points), `long` sentences over 20 words (lesson, quiz and takeaways),
`heavy` sentences (two commas and a colon, or 4+ commas — write-lesson's "split it" rule), `dash`
count, `?` rhetorical questions, `chk` failed shape checks (intro over 4 sentences, `main.go` over
35 lines, quiz size, quiz answers bunched on one position, a right option much longer than every
distractor), and sentence length `avg±sd`.

Treat it as a list of places to look. A hit is a finding only after you read the sentence and
agree; a lesson with 0 points can still read as generated (structure tells are not counted),
and a long sentence is fine when it is clear. For reference (2026-11-27): Git lessons score
0–7 and average 8–12 words per sentence; the weakest Go lessons score 11–16 at 13–15 words.

## 2. Read everything the reader sees

`lesson.az.md`, the code (`main.go` or `session.sh`), `output.txt`, `steps.yaml`,
`quiz.az.yaml`, `takeaways.az.yaml`, `meta.yaml`. For syllabus technologies also the node in
`content/<technology>/syllabus.yaml` (outcome, `topics`, prerequisites, `outOfScope`). For Go,
what came before: `sections.yaml` orders the sections and each lesson's `meta.yaml` has its
`section` and `order` (grep them); GLOSSARY's "first explained" column tells whether a term was
already taught.

**Check accuracy by running it, not by reading it.** Go: run the lesson
(`pnpm content:go <slug>` compares with `output.txt`), and run every quiz snippet and every
error message the text or quiz quotes in a scratch file in the scratchpad. Syllabus
technologies: read `output.txt` against the text and verify quiz answers in a scratch sandbox
(write-content §6). A finding in `accuracy` must say what you ran.

Read it twice, as two different people:

1. **A beginner** who knows only the previous lessons. Mark every place they would stop: a term
   not explained, a step that jumps, a sentence they must read twice, an example whose story
   they must hold in their head to follow the code.
2. **A senior engineer who teaches.** Mark what is wrong or imprecise, a pitfall that is missing,
   a claim the code/output does not back, and every sentence they would never say out loud
   (ai-tells.md). Ask of each sentence: *what does the reader know after it that they did not
   before?* If nothing — it is a finding.

## 3. Findings

One finding = one problem at one place. Fields:

- **id** `F1`, `F2`, … (stable; polish-lesson and the user refer to them)
- **where** file + step id (`lesson.az.md#missing`) or line (`quiz.az.yaml:42`). The text
  before the first step is `#intro`, after the last step `#outro`.
- **quote** the exact text, verbatim (so it can be found after edits)
- **category** one of
  - `voice` — AI tone (ai-tells §1–4)
  - `language` — calque, grammar, spelling, a term not written as GLOSSARY says
  - `structure` — ai-tells §6, intro length, step size, a list where prose belongs, code length
  - `clarity`, `pedagogy`, `accuracy`, `example`
  - `quiz` — quiz and takeaways
- **severity**
  - `blocker` — wrong fact, text contradicts code/output, a missing prerequisite the reader
    cannot get past, a language error that changes meaning
  - `major` — a tell a reader will notice (opener, recap, hype, running metaphor, calque that
    reads as translation), a step a beginner cannot follow, a convoluted example, a quiz that
    does not test the outcome or can be guessed (giveaway option, answers on one position), a
    missing pitfall that beginners **commonly** hit with this feature
  - `minor` — word choice, one long sentence, rhythm, a rarer missing pitfall
- A new term with no GLOSSARY row is a `minor` `language` finding; add "GLOSSARY: add <term>" to
  its fix (polish-lesson adds the row).
- **why** one sentence: what the reader experiences
- **fix** the direction, concrete. A one-sentence suggested rewrite is welcome for `voice` and
  `language`; do not rewrite whole steps here.

Rules: report what matters, in order of severity. Do not pad the list to look thorough, do not
flag a house-style choice the exemplars use, and never flag the same pattern ten times — one
finding with "also in: #set, #delete" is enough. If the lesson is good, say so: an empty
`major` list is a valid result.

## 4. Scores (1–5)

| Dimension | 5 | 3 | 1 |
|---|---|---|---|
| **Səs** (human voice) | Reads like an instructor talking; no tells | 2–3 noticeable tells | Generated feel throughout: frames, hype, metaphors |
| **Dil** (natural Azerbaijani) | Native, terms per GLOSSARY | Some calques or translated syntax | Reads as a machine translation |
| **Aydınlıq** (clarity) | Every term explained at first use, one idea per sentence | Some sentences need a second read | Beginner gets lost |
| **Pedaqogika** | Outcome and `topics` covered, why before how, steps the right size, pitfalls named | Gaps or uneven steps | Does not teach the outcome |
| **Dəqiqlik** (accuracy) | Every claim matches code, output and docs | Imprecise wording | Wrong facts |
| **Nümunə** (example) | Simplest data that shows *why*; original | Story or data a bit heavy | Convoluted or only renames things |
| **Yoxlama** (quiz + takeaways) | Tests the outcome, plausible distractors, answers spread, takeaways match | Some weak questions | Off-topic or guessable |

4 and 2 sit between the columns: **4** = only minor findings in that dimension; **2** = several
majors, or one major the reader cannot get past. Scores follow from the findings, not from an
overall feeling: a dimension with a `major` finding is at most 3, with a `blocker` at most 2. The
dimension of a finding is its category (`voice` → Səs, `language` → Dil, `structure` → Aydınlıq or
Pedaqogika, whichever the reader feels, `quiz` → Yoxlama).

**Verdict:**

- `Yenidən yazılmalı` — any blocker, or Dəqiqlik ≤ 2, or Səs ≤ 2
- `Düzəliş lazımdır` — any major, or any score ≤ 3
- `Hazırdır` — otherwise

A single giveaway quiz question is enough for `Düzəliş lazımdır` on purpose: it is cheap to fix
and makes the quiz worthless for that question.

Also answer in one line: **"Oxucu bunu AI mətni kimi qəbul edərmi?"** — `bəli` / `ola bilər` /
`xeyr`, with the two or three places that decide it. This is a reader's impression, not a
detector result; never present it as a probability.

## 5. Report file

Write `.reviews/<technology>/<id>.md` (git-ignored; overwrite an older report of the same
lesson). The headings are fixed — polish-lesson parses them:

```markdown
# Review: <technology>/<id>

- Date: <YYYY-MM-DD>
- Lesson commit: <git log -1 --format=%h -- <lesson dir>>
- Verdict: Düzəliş lazımdır
- AI kimi qəbul: ola bilər — intro "Təsəvvür edin ki…", #set recap, running café metaphor

## Scores

| Səs | Dil | Aydınlıq | Pedaqogika | Dəqiqlik | Nümunə | Yoxlama |
|---|---|---|---|---|---|---|
| 3 | 4 | 4 | 4 | 5 | 3 | 4 |

## Scan

```
<the header line and this lesson's row from scan.mjs, pasted as printed, plus its [check] lines>
```

## Findings

### F1 · major · voice · lesson.az.md#intro
> Təsəvvür edin ki, böyük bir anbarınız var…

Why: the reader waits two sentences for the point.
Fix: open with what a map is: "Map açarı dəyərə bağlayır…"
Status: open

### F2 · …

## Strengths

<1–3 bullets: what works and must survive a rewrite (a good example, a precise pitfall note)>
```

`Status` is `open` here; polish-lesson sets `fixed`, `skipped (<reason>)` or `rejected by user`.

## 6. Batch (a whole technology or a list)

1. Run `scan.mjs <technology>` for the table, sorted worst first.
2. Review every lesson (parallel subagents are fine: ~5–8 lessons each, each given this file,
   ai-tells.md and its lesson paths; you then read the reports and make the findings
   consistent — the same pattern gets the same severity everywhere).
3. Write `.reviews/<technology>/SUMMARY.md`: one row per lesson (verdict, the seven scores,
   number of blocker/major/minor, AI kimi qəbul) sorted worst first, then **patterns that recur
   across lessons** (e.g. "intro announces the lesson in 30 of 84") — those are cheaper to fix
   by updating write-lesson / write-content than lesson by lesson.

## 7. Hand-off (Azerbaijani)

- Per lesson: verdict, the score row, the top 3 findings quoted, and what is good.
- Batch: the worst 5–10 lessons and the recurring patterns.
- Say where the report is, and propose the next step — `/polish-lesson <id>` for the lessons
  that need it. **Do not edit the lesson** in this skill, even when a fix is obvious (the user
  reviews lessons one by one and decides what to change).
- If a recurring pattern belongs in the writing rules, propose the exact line for write-lesson
  §3 or ai-tells.md; add it only when the user agrees.
