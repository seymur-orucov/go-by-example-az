---
name: plan-syllabus
description: Research a technology (Git, Docker, SQL, HTTP, Go…) and propose a syllabus for it — modules, nodes with learning outcomes, prerequisites, lesson kind and facets — then, after the user approves it, write content/<technology>/syllabus.yaml. Use when the user types /plan-syllabus <technology>, or asks to plan, propose or revise a syllabus, curriculum or roadmap for a technology.
---

# Plan a syllabus

The syllabus is the contract between research and content: `write-content` builds lessons
from it, and the roadmap page is drawn from it. Nothing is written into `content/` before the
user approves the proposal.

Read first: docs/DECISIONS.md ("Vision", "Platform sections", "Original content") — what
may be taken from other sites, the five node facets, the rollout order.

## 0. Input

- The technology id is a short kebab-case slug; it becomes the route `/<id>/` and the folder
  `content/<id>/`. Confirm it with the user if it is not obvious (`git`, not `git-github`).
- If `content/<id>/syllabus.yaml` exists, this is a **revision**: read it, keep every
  published node id (ids are stable), and propose changes as a diff (added / moved /
  removed), not a new syllabus.

## 1. Research

Collect **topic lists, ordering and depth** — never texts. Sources, in this order:

1. roadmap.sh — the roadmap for the technology. The page is rendered by JavaScript, but
   `https://roadmap.sh/<id>.json` (e.g. `git-github.json`) serves its graph: `nodes` with
   `type` (`topic` = section, `subtopic`), `data.label` and `position` — the topic names
   **and** the order. Fallback: the file names in the `kamranahmedse/developer-roadmap` repo
   (`src/data/roadmaps/<id>/content/`), which carry no order.
2. itbooster.ru — also rendered by JavaScript, its topic list cannot be fetched. Ask the user
   to paste it if they want it in the merge; do not probe the site's private API.
3. The official documentation or the canonical book of the technology (for Git: the Pro Git
   table of contents at git-scm.com/book). Use it for order, depth and fact checking.
4. Our existing content: `content/*/syllabus.yaml` and `content/go/sections.yaml` — reuse
   node ids where the same topic already exists, and link instead of duplicating.

Fetch independent sources in parallel (one `web-fetch` agent per source, asking only for
structure). On Windows `curl` fails on the corporate certificate; use PowerShell
`Invoke-RestMethod` for plain API calls. Write the merged notes to
`content-private/research/<id>.md` (not tracked by git): per source, the topic list and the
URL it came from, then a merged list with a note on what each source adds.

## 2. Audience and scope

State them before designing, and put them in the proposal so the user can correct them:

- **Audience**: default — a developer who knows one programming language and has never used
  the technology.
- **End level**: default — confident daily use plus the understanding asked in interviews
  (the *why*, the internal model), not administrator or tool-author depth.
- **Out of scope**: say what you left out and why (vendor-specific services, rare commands,
  server administration). A topic outside the scope can return as a later module.

## 3. Design (backward design)

Write the **outcome first**, then derive the node from it.

- **One node = one idea**, 5–15 minutes to read. Split a topic that needs two outcomes;
  merge topics that make sense only together.
- **Outcome**: one Azerbaijani sentence, "Oxucu … bacarır / izah edə bilir / seçə bilir",
  with an observable verb (Bloom's taxonomy: izah etmək, istifadə etmək, müqayisə etmək,
  seçmək, düzəltmək). Not "… haqqında öyrənir".
- **Prerequisites** (`requires`): only direct ones. They form a DAG; a node appears after all
  of its prerequisites.
- **Modules**: 4–8 nodes each, ordered so that every module ends with something the reader
  can do on their own. The first node of the syllabus answers "what problem does this solve".
- **Mental model early**: when the technology has an internal model that explains the
  commands (Git's commit graph, the HTTP request/response cycle, a database index), teach it
  in the first module and let later nodes refer back to it.
- Prefer the order a learner needs over the order a reference book uses.

## 4. Lesson kind per node

Every node gets exactly one `kind` — the main "stage" of its step-by-step walkthrough. Choose
by what the reader must *see* to understand the idea:

| kind | stage | use when |
|---|---|---|
| `code` | source code with highlighted lines + output | the idea is a language feature or an API |
| `terminal` | commands and their output, step by step | the idea is a CLI workflow (git, docker, psql) |
| `state` | a data structure or graph that changes per step | commands change an invisible state (commit graph, index, a B-tree) |
| `diagram` | actors and messages, frame by frame | the idea is a protocol or a flow between parts (HTTP, TCP, CI pipeline) |
| `compare` | two variants side by side | the node exists to choose between two approaches (merge vs rebase) |
| `concept` | text with one static illustration | a principle with no runnable form |
| `ui` | screenshots of a web interface with numbered callouts, step by step | the idea is done in a product's web UI (GitHub settings, issues, Projects) |

Only `code` exists on the site today; the others are planned and are built when the first
syllabus needs them. If no kind fits, propose a new one in the proposal with one sentence on
why — do not stretch an existing kind.

## 5. Facets

Per node, list the facets it gets (docs/DECISIONS.md "Platform sections"):
`theory`, `practice`, `visual`, `test`, `interview`.

- `test` is always present (every ready lesson has a 5–10 question quiz).
- `visual` when the kind is `state`, `diagram` or `compare`.
- `practice` when the reader can repeat it on their machine (a command, a small program).
- `interview` only for topics really asked in interviews (merge vs rebase, reset modes).

## 5b. Coverage check

**Default: the full roadmap, one node per roadmap topic** (the user's rule, 2026-11-26: the
first Git syllabus folded 155 topics into 39 nodes and dropped the GitHub part, and the user
asked "why did you shorten it?"). Do not cut scope or fold topics on your own; if the roadmap
looks too large, propose a split into `parts` and ask. Fold only true fragments of one idea
that cannot stand as a lesson. Put the roadmap topic name first in the node's `topics`.

Map **every** topic of the main source (roadmap.sh) to a node or a section header, and list
anything else by name with the reason. Check it with a script against roadmap.sh's
`https://roadmap.sh/<id>.json` (`nodes` of type `topic` / `subtopic`; their `position.y` gives
the order). Report the counts in the proposal, e.g. "156 topics: 149 in 146 nodes, 6 headers,
1 typo".

## 6. Proposal (stop and wait)

Present in Azerbaijani, compact:

1. Audience, end level, out of scope (2–4 lines).
2. One table per module: node title · outcome · kind · requires · minutes.
3. Totals: number of nodes, minutes, count per kind; which kinds are new for the site.
4. Coverage (5b), and what the sources disagreed on and what you chose. List the left-out
   topics by name — the user should not have to ask what was removed.
5. Open questions for the user (at most 3).

Then **stop**. Apply the user's edits and show only the changed parts, until they approve.

## 7. Write the syllabus

After approval, write `content/<id>/syllabus.yaml`:

```yaml
technology: git
title: "Git"
status: approved            # draft while the user is still editing
audience: "Bir proqramlaşdırma dilini bilən, Git-dən istifadə etməmiş developer."
level: "Gündəlik iş + müsahibə səviyyəsində anlayış"
updated: 2026-11-26
syntax: "Modern commands (git switch, git restore) are the main syntax; checkout is only mentioned."
outOfScope:
  - "GitHub platform features — a separate GitHub or CI/CD technology later"
sources:
  - { name: roadmap.sh, url: "https://roadmap.sh/git-github", used: "topic list" }
  - { name: Pro Git, url: "https://git-scm.com/book/en/v2", used: "order, fact checking" }
parts:                      # optional, for a large syllabus (2+ parts); every module then names one
  - { id: git, title: "Hissə 1 · Git", description: "…" }
  - { id: github, title: "Hissə 2 · GitHub", description: "…" }
modules:
  - id: basics
    part: git                 # only with `parts`; a part's modules are contiguous
    title: "Əsaslar"
    description: "…"
    nodes:
      - id: what-is-version-control      # stable slug, becomes /git/<id>/
        title: "Version control nədir"
        outcome: "Oxucu version control-un hansı problemi həll etdiyini izah edə bilir."
        kind: concept
        facets: [theory, test]
        requires: []
        duration: 6
        topics: [why version control, centralized vs distributed]   # English; folded-in topics
```

- `syntax` (optional): which command or API style the lessons use when there are several.
- `outOfScope`: what was left out and why — `write-content` must not bring it back.
- `topics`: English keywords the lesson must cover; `write-content` uses them as a checklist.

- Ids are English kebab-case and **stable** once a lesson is published.
- Titles, descriptions and outcomes are Azerbaijani; Git/Docker/… terms stay English.
- Validate before committing (a script in the scratchpad until `pnpm content:check` covers
  syllabi): ids unique across the file, every `requires` id exists, no cycles, every node
  comes after its prerequisites, `kind` and `facets` from the lists above.

## 8. Hand-off

- Add a short entry to docs/HISTORY.md and the syllabus to docs/ROADMAP.md; record the
  scope decisions in docs/DECISIONS.md.
- Commit on a branch: `feat(content): add the <technology> syllabus`.
- Tell the user the next step: `/write-content <id>` (pilot lessons, one per kind).
