---
name: polish-lesson
description: Fix a lesson using its review-lesson report — rewrite only the sentences, steps, examples or quiz items named in the findings so the Azerbaijani reads like an experienced instructor, then verify and re-score. Use when the user types /polish-lesson <technology>/<id> [F1 F3 | major], or asks to fix, rewrite or polish a reviewed lesson or apply review findings. Needs a report in .reviews/ (runs review-lesson first if there is none).
---

# Polish a lesson from its review

`review-lesson` found the problems; this skill fixes **those and nothing else**. The user reads
lessons one by one; unasked changes elsewhere cost them a re-read and lose wording they already
approved.

Read first: the report `.reviews/<technology>/<id>.md`,
[../review-lesson/ai-tells.md](../review-lesson/ai-tells.md) (§7 is the target voice),
write-lesson §2–3 (the house rules), and [docs/GLOSSARY.md](../../../docs/GLOSSARY.md).

## 0. Report and scope

- No report, or `Lesson commit` in it differs from `git log -1 --format=%h -- <lesson dir>`
  (the lesson changed since) → run review-lesson first and show the user its summary.
- **Scope** from the command: finding ids (`F1 F3`), a severity (`major` = blocker + major), or
  nothing → blocker + major. Minor findings only when asked, or when they sit in a sentence you
  are rewriting anyway.
- A finding you disagree with after reading the lesson again: skip it with a reason, do not
  quietly half-fix it.
- `Strengths` in the report must survive.

## 1. Rewrite, finding by finding

For each finding, read the whole step with its code and output first, then:

- **voice / language**: say the same fact the way you would at a whiteboard: the fact first,
  then the reason, pointing at the code or the output line. Short sentences, one idea each,
  finite verbs instead of participle chains, terms as in GLOSSARY. Delete before you rephrase —
  openers, recaps and filler usually just go. Do not swap one tell for another ("Təsəvvür edin"
  → "Deyək ki" is not a fix).
- **clarity**: explain the missing term in one clause where it first appears, or split the
  sentence. Do not add a paragraph where a clause works. A fix that says "GLOSSARY: add <term>"
  also adds the row to docs/GLOSSARY.md.
- **structure**: shorten the intro to what and why, turn a bullet list of explanations into
  prose (or prose into a list when it really is ≥3 parallel items), split an oversized step.
  For a too-long `main.go`, cut what the steps do not explain — that is an `example` change
  and needs section 3.
- **pedagogy**: reorder or resize a step, add the missing pitfall as `> **Diqqət:**`, move a
  repeated intro sentence into the step that needs it. Step ids and their order stay unless the
  finding is about them (ids are stable once published).
- **accuracy**: correct the claim against the code, output and the official docs. If the fix
  needs a code change, it is an `example` fix (below).
- **example**: simplify the data or replace the context per write-lesson §2 (the context must
  show *why*; simplest data; English in code). Then update every place that quotes it —
  `lesson.az.md`, `steps.yaml` (`out`, `vis`), quiz snippets, takeaways — and verify (section 3).
- **quiz**: rewrite the question or distractors; keep 5–10 questions and spread the right
  `answer` over positions. Verify each changed answer by running it.

Keep the lesson's length roughly the same unless the finding says it is too short or too long.
A rewrite that adds sentences should be adding information.

## 2. Read it again as a whole

Read the changed steps in order, start to finish: the new sentences must connect to the ones
around them (no dangling "bu", no repeated fact, the same person — "biz" or "siz" — as the rest).
Then:

```sh
node .claude/skills/review-lesson/scan.mjs --detail <technology>/<id>
```

No new strong hits, and the points must not go up. If they do, look at why before moving on.

## 3. Verify

- Text only: `pnpm content:check`.
- Code or session changed (Go): `pnpm content:go --write <slug>`, then everything in write-lesson
  §5 that applies (every quiz answer compiled, takeaways checked).
- Code or session changed (syllabus technology): `pnpm content:run <technology>/<id>` twice
  (`session.json` must not change), read `output.txt` against the text, verify quiz answers in a
  scratch sandbox — write-content §6.
- Structure changed (steps added, removed or reordered, a new `vis`): `pnpm build` and look at
  the page.

## 4. Re-review and update the report

- If any blocker was fixed, or more than five findings: run review-lesson in a **fresh
  subagent** (it gets the lesson and the skill files, not your summary) and compare.
  Otherwise re-score the touched dimensions yourself.
- In the report: set each finding's `Status` (`fixed`, `skipped (<reason>)`), and append:

```markdown
## After polish (<date>)

| Səs | Dil | Aydınlıq | Pedaqogika | Dəqiqlik | Nümunə | Yoxlama |
|---|---|---|---|---|---|---|
| 4 | 5 | 4 | 4 | 5 | 4 | 4 |

Verdict: Hazırdır · Scan: pts 6 → 1
```

## 5. Hand-off (Azerbaijani)

- For each fixed finding: id, the old sentence and the new one (the user judges tone from the
  pair, not from a description). Skipped findings with the reason.
- Scores before → after, scan points before → after, what was verified.
- Ask the user to read the lesson (local URL from `pnpm dev`: `/go/<slug>/` or
  `/<technology>/<id>/`). When they reject a rewrite or name a new AI pattern, set the finding to
  `rejected by user`, fix it their way, and add the pattern to ai-tells.md and `PHRASES` in
  scan.mjs so the review catches it next time.
- Git: check `git branch --show-current` first (other sessions share the checkout); commit on a
  content branch, `refactor(content): polish the <id> lesson text`. Several polished lessons of
  one module go into one PR (module PRs). Push only when the user asks to ship.
- Add a docs/HISTORY.md entry. Do not mark lessons reviewed in docs/ROADMAP.md before the user
  has read them.
