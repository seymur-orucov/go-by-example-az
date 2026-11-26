# Roadmap

Last updated: 2026-11-24

Markers: `[x]` done · `[~]` in progress · `[ ]` upcoming

---

## Vision: learning platform

**Nümunələrlə Go is the first prototype.** After it, the project becomes a **unified platform** in the spirit of roadmap.sh and itbooster.ru:

| Principle | Meaning |
|---|---|
| **Learning by roadmap** | Developers see what to learn and in which order on a roadmap; they know where they are and what the next step is. Roadmaps come in two kinds: **technology** ("Go") and **direction** ("Backend") |
| **Accounts** | In the platform phase: sign-up and server-side progress (not in the Go prototype) |
| **Theory + practice together** | Every roadmap node leads both to a theoretical explanation (concept) and to practice (working example, exercise, question) |
| **All technologies on one site** | Go, Python, Rust, TypeScript, SQL, etc. on the same platform, with the same design and lesson format. **No** separate sites |
| **Technologies + directions** | Users choose by technology (Go, Python…) or by direction (Backend, Frontend…), as on roadmap.sh and itbooster.ru |
| **Practice formats** | Beyond lessons: tests/quizzes, interview preparation (incl. system design), algorithms and data structures, live coding, visual code explanations. Detailed model to be discussed |
| **In Azerbaijani** | Content in Azerbaijani, terms in English |
| **Language policy** | Azerbaijani is the primary language. Other languages are added only after a quality translation of the existing content |

The prototype already prepares for this vision: a technology switcher in the header, the "Roadmap" view, statuses (learned / next / upcoming), progress, the "One platform, several languages" section.

The phases follow this vision: 1–5 take the Go prototype to a live site, 6–7 turn it into the platform.

---

## Phase 0 — Concept and decisions ✅

- [x] Goal: an Azerbaijani-language, modern-looking, simplified alternative to gobyexample.com
- [x] License researched: CC BY 3.0, translation and adaptation are allowed with attribution
- [x] Architecture proposal accepted: Astro + Shiki + Pagefind, static site, hub-ready monorepo
- [x] Hosting: Cloudflare Pages (no domain, `*.pages.dev`)
- [x] Terms stay in English (`slice`, `goroutine`), with a short explanation on first use
- [x] Code runs inside the site (`go.dev/_/compile` proxy), Playground link as a fallback

Details: [DECISIONS.md](DECISIONS.md).

---

## Phase 1 — Design prototype ✅

Framework-free static HTML/CSS/JS in the `design/` directory.

### Done
- [x] Design tokens (light and dark theme), Inter + JetBrains Mono (`ə ı ş ç ğ ö ü` support)
- [x] **Variant A** "Clean" — Stripe/Linear style, Go blue
- [x] **Two-way** explanation ↔ code highlighting (hover)
- [x] **Variant B** "Scope" — based on frontscope.dev: step player, memory visual
- [x] **Variant C** "Roadmap" — roadmap.sh + itbooster.ru: roadmap, bento, 4 palettes, hub switcher
- [x] **Variant D** — merge of the liked parts of A, B and C (chosen by the user)
- [x] D: animated gradient background (two palette colors drift slowly)
- [x] D: scroll animations — heading words rise from a mask, the code label types out, numbers count up, cards arrive in sequence, the hero fades, the demo player straightens from 3D
- [x] D: animation on the "All topics / By section / Roadmap" tab switches
- [x] D: inner mini-animations and a cursor-following glow in the "Why this site?" bento cards
- [x] D lesson page: hide sidebar (`[`), content width centered / full (`F`), Zen mode (`Z`, `Esc`)
- [x] Git repo and documentation for the project (this file)

- [x] Platform scope, sources (hellointerview.com, algomaster.io), language policy and engineering conventions recorded; docs translated to English; `CONTRIBUTING.md`, licenses, `.editorconfig`, `.gitattributes`, GitHub templates added

### Remaining (before moving to Phase 2)
- [x] Variant D chosen as the base design (2026-11-23); it will still change to fit the platform scope
- [x] **Discussion of the platform sections**: node model (theory · practice · visual · test · interview), algorithms as a separate track, live coding postponed, rollout order — [DECISIONS.md](DECISIONS.md#platform-sections-2026-11-23)
- [~] **Home page redesign** for the platform: first version done (`d/index.html`: path choice, node explorer, sections bento; Go page moved to `d/go.html`) — awaiting feedback
- [~] **Design v2** (`design/v2/`, 2026-11-25): new "Aurora glass" version on top of D — home (aurora hero, ask box, stack map, node anatomy, sections rail, advantages + comparison, resume CTA), Go page, roadmap graph, lesson page — awaiting the user's review
- [x] Design v3, first try ("Aurora editorial", 2026-11-25) — **rejected** by the user ("v2 is better") and deleted
- [~] **Design v3** (`design/v3/`, 2026-11-26), second try with a different idea, "Order from chaos": particle-field hero (dust → roadmap → code → cube → check → bubble), before/after slider, scroll-lit manifesto, pinned exploded five-layer lesson, technology orbit, typographic section list; loads v2's shell, other pages still v2's — awaiting the user's review
- [~] **Design v4** (`design/v4/`, 2026-11-26), "Metro": after the v3 feedback (disliked the pinned "Bir mövzu. Beş qat." section and the running "Seç · Öyrən · Yoxla · Təkrar" line) the user asked for a v4 that is completely different. Transit-map home page with its own look (no `v2.css`): map hero with trains, Go strip map + timetable, lesson demo with a turnstile, tickets, split-flap board, boarding pass; other pages still v2's — **not liked** by the user ("maraqlıdır amma bəyənmədim")
- [~] **Design v5** (`design/v5/`, 2026-11-26): v2 and v3 merged at the user's request — v3's particle intro, before/after slider and manifesto on top of v2's look and sections (ask box, stack map, five facets, rail, advantages, resume card), plus new ideas (the aurora lights up when the particles lock, typed text is drawn by the particles, a click scatters them); other pages still v2's — the user found it "biraz qarışıq" (too mixed)
- [~] **Design v6** (`design/v6/`, 2026-11-26), "Liquid glass": one idea and one look (v2's glass) — a WebGL liquid-glass hero (scattered sources flow into one form; drag, splash, pointer drop) and informative glass sections (roadmap explorer, lesson demo + quiz, stack, platform sections, comparison, FAQ, resume card); other pages still v2's — awaiting the user's review
- [ ] Platform name (working name "Nümunələrlə" for now; candidates `w3hub.dev` / `beststack.dev`, previewed in design v2–v6)
- [x] **Roadmap page** (`d/roadmap.html`): technology roadmap (Go) + direction roadmap preview (Backend), sticky 5-facet node panel, filter, deep links; linked from the header nav, home, Go page and lessons (2026-11-23)
- [x] **Final approval** of Variant D — starting Phase 2 counts as the approval (2026-11-23)
- [x] Final palette choice: Nebula by default, İndiqo, Okean and Qrafit stay as options (2026-11-23)
- [x] A separate review of the mobile view for D — home, Go page and lesson page (incl. the topics drawer) checked at 390px in headless Chrome, no horizontal scroll (2026-11-23); a check on a real phone is still worth doing
- [x] Final check of the light theme for D — platform home, Go page and lesson page checked in light (and the home in dark) with the palettes (2026-11-23)
- [ ] Optional: an **arrow/curved line** linking explanation and code (the user's idea) — moved to Phase 2, built with the real components
- [x] Variants A, B, C archived under `design/archive/`; D's shared files moved to `design/shared/` (2026-11-23)

---

## Phase 2 — Project skeleton `[~]` (current phase)

Delivered in **3 PR modules** (agreed 2026-11-23): 1) repo skeleton and tooling, 2) content model + theme + pages, 3) search, run and edit. Plan details: [DECISIONS.md](DECISIONS.md#phase-2-technical-decisions-2026-11-23).

Monorepo (pnpm workspaces). The first release ships with Go content only, but the structure is built **from the start for a unified platform** (Phases 6–7): routes `/<technology>/...`, content in `content/<technology>/`, shared theme and components.

```
packages/theme/        # tokens.css + Astro components (Layout, Sidebar, CodeStep, Player, SearchPalette, RunButton)
apps/site/             # single Astro site; only /go/... in the first release; content read from ../../content/*
content/go/
  sections.yaml        # sections and ordering
  examples/<slug>/
    meta.yaml          # title, section, order, status, level, duration
    main.go            # working, simplified code; segment boundaries marked with comments
    az.md              # compact explanation per segment
    output.txt         # generated by CI
functions/api/run.ts   # go.dev/_/compile proxy (rate limit + size limit)
.github/workflows/ci.yml
```

- [x] pnpm workspaces (version pinned via `packageManager`, Node 24 via `devEngines`), Astro 7 site skeleton — module 1
- [x] Content Collections + Zod schema: `goSections`, `goExamples`; `content/go/sections.yaml` and `meta.yaml` for all 84 topics (module 2)
- [x] Tooling: commitlint + lefthook git hooks, Prettier + ESLint, `CHANGELOG.md` (Keep a Changelog), SemVer from the first release (`0.1.0`) — module 1
- [x] Minimal CI (`.github/workflows/ci.yml`): lint, format check, type check, build, PR title check — module 1 (Go checks and Cloudflare stay in Phase 4)
- [x] Move Variant D's tokens and components into `packages/theme`: styles, `Layout`, `Header` (+ `ViewMenu` on lessons), `Footer`, `Icon`, shell scripts (theme, palette, menus, Ctrl+K search, spy, view modes); lesson-specific parts (`LessonSidebar`, `Vis`, `Quiz`, walkthrough script) live in `apps/site` (module 2)
- [~] Pages: `/go/` and `/go/<slug>/` done (ready lessons: walkthrough, two-way highlighting, memory visual, quiz; planned topics: an "in preparation" page); `/go/roadmap/`, `/` and `/roadmaps/backend/` remain (module 2)
- [x] Lesson content format: `main.go` with `//@step` markers, `lesson.az.md`, `steps.yaml`, `quiz.az.yaml`, `output.txt`; loader + `pnpm content:check` in CI (module 2)
- [x] "Yadda saxla" summary card (key points + best practices, `takeaways.az.yaml`) at the end of every lesson, left of the quiz — restored from the design prototype (module 2)
- [x] Build-time syntax highlighting with Shiki (replacing the prototype's simple highlighter); scopes are mapped to the theme's `--tok-*` colors, so palettes and light/dark keep working (module 2)
- [ ] Static search with Pagefind (`Ctrl+K` palette)
- [ ] CodeMirror 6 — lazy-loaded only when "Edit" is clicked
- [ ] `/api/run` — Cloudflare Pages Function, proxy to `go.dev/_/compile` (no CORS, so a proxy is needed)
- [x] Progress in `localStorage` (with try/catch): `/go/`, lesson sidebar and the "Öyrəndim" button (module 2)
- [~] View modes (sidebar, width, zen) moved into the theme (`view-modes.ts`, `ViewMenu`); `prefers-reduced-motion` is preserved. Home page animations remain (module 2)

## Phase 3 — Pilot content `[~]`

10 examples, each simpler than the original, with a compact explanation in Azerbaijani:

- [~] hello-world · values · variables · constants · for · if-else · slices · maps · functions · goroutines — **original** (`source: original`, awaiting the user's review): hello-world, values, variables, constants, for, if-else, slices, maps, functions, goroutines
- [~] **"Əsaslar" section complete**: all 7 lessons are original and `ready` (hello-world, values, variables, constants, for, if-else, switch; `switch` is outside the 10-lesson pilot list), awaiting the user's review
- [~] **"Kolleksiyalar" section complete**: all 5 lessons are original and `ready` (arrays, slices, maps, range, strings-and-runes), awaiting the user's review
- [~] **"Funksiyalar" section complete**: all 5 lessons are original and `ready` (functions, multiple-return-values, variadic-functions, closures, recursion), awaiting the user's review
- [~] **"Tiplər və strukturlar" section complete**: all 8 lessons are original and `ready` (pointers, structs, methods, interfaces, enums, struct-embedding, generics, range-over-iterators), awaiting the user's review
- [~] **"Xətalar" section complete**: all 5 lessons are original and `ready` (errors, custom-errors, panic, defer, recover), awaiting the user's review
- [~] **"Konkurentlik" section complete**: all 18 lessons are original and `ready` (goroutines, channels, channel-buffering, channel-synchronization, channel-directions, select, timeouts, non-blocking-channel-operations, closing-channels, range-over-channels, timers, tickers, worker-pools, waitgroups, rate-limiting, atomic-counters, mutexes, stateful-goroutines), awaiting the user's review
- [~] **"Mətn və verilənlər" section complete**: all 16 lessons are original and `ready` (sorting, sorting-by-functions, string-functions, string-formatting, text-templates, regular-expressions, json, xml, time, epoch, time-formatting-parsing, random-numbers, number-parsing, url-parsing, sha256-hashes, base64-encoding), awaiting the user's review
- [x] Project skill `.claude/skills/write-lesson/` for writing original lessons (rules, originality guard, verification checklist)
- [x] Content license CC BY 4.0; no Go by Example credit on the site once no adapted lesson is left; money in examples in USD; intro length rule in the skill
- [ ] Terminology glossary (`docs/GLOSSARY.md`): English term + short Azerbaijani explanation
- [ ] Step visuals for topics that need them (slice, map, channel, goroutine)

## Phase 4 — CI/CD `[ ]`

- [x] GitHub repo (public): https://github.com/seymur-orucov/go-by-example-az
- [ ] GitHub Actions: `setup-go` → `go vet` + `go run` for each `main.go` → compare against `output.txt`; `pnpm install --frozen-lockfile && pnpm build`; lint + type-check; commit message check; link check
- [ ] Cloudflare Pages: GitHub integration (main → production, PR → preview URL). The account is connected by the user

## Phase 5 — Remaining ~74 examples `[ ]`

- [ ] Added section by section (84 examples in total, 9 sections — the list is in `design/shared/data.js`)

## Phase 6 — Moving to the platform: roadmap + theory + practice `[ ]`

Once the Go prototype is live, the site becomes a unified platform.

- [ ] Add a **theory** type to the content model: concept article (short explanation, diagram, related examples). The current examples become the **practice** type
- [ ] **Roadmap model**: nodes (topics), ordering, dependencies, levels; each node links to theory and practice. Roadmaps are stored as files, e.g. `content/roadmaps/<id>.yaml`
- [ ] Roadmap content is refined **based on a merge of roadmap.sh and itbooster.ru resources**. For each roadmap:
  1. collect the topic list and ordering of the matching roadmap/course from both sites;
  2. compare: shared topics, topics only in one, differing orderings;
  3. build the merged list, fill gaps, link to the examples in the Go prototype;
  4. texts: for topics the user marks, taken from those resources and translated into Azerbaijani; for the rest, we write them ourselves
  5. translated text goes into the public repo and onto the site only after the author's written consent; until then it is kept in `content-private/` (not tracked by git) — [DECISIONS.md](DECISIONS.md#vision-2026-11-23)
- [ ] Reach out to the authors of roadmap.sh and itbooster.ru about translation and publishing
- [~] **Content pipeline for new technologies** ([DECISIONS.md](DECISIONS.md#content-pipeline-syllabus--lessons-2026-11-26)):
  - [x] `plan-syllabus` skill (research → proposal → `content/<technology>/syllabus.yaml`)
  - [x] **Git syllabus** approved: 7 modules, 39 nodes, ~4.5 h (`content/git/syllabus.yaml`)
  - [x] Lesson kinds `terminal` and `state` on the site: `session.sh` + `pnpm content:run` (recorded output), the `areas` visual, `/git/` and `/git/<id>/` pages, shared `LessonView`; `pnpm content:check` validates syllabi and session lessons
  - [ ] Lesson kinds `diagram`, `compare`, `concept` and the commit-graph visual (`vis: graph`, needed from `commit-snapshot` on)
  - [x] `write-content` skill (pilot lesson per kind → approval → module by module)
  - [~] Git pilot lessons `three-areas` and `first-commit` — awaiting the user's review
  - [ ] The remaining Git lessons, module by module
  - [ ] CI: run `pnpm content:run` and fail on a diff (needs a pinned Git version: output differs slightly between versions)
  - [~] Technology statuses computed from content (`lib/technologies.ts`: ready / started / soon): done for the plain header switcher; **after the home/header port is merged**, feed them into the port's mega menu, Ctrl+K, home stack map and roadmap page instead of the hand-written `TECHS` statuses in `data/platform.ts`
- [ ] Two kinds of roadmap:
  - **technology** roadmap — e.g. "Go": the language itself, from simple to complex;
  - **direction** roadmap — e.g. "Backend": combines nodes from several technologies (Go, SQL, HTTP, Docker…); nodes reference technology content, content is not duplicated
- [ ] **User accounts**: sign-up / sign-in, server-side progress and sync across devices, a personal path along the roadmap. This needs a backend + database; content pages stay static. Stack decided: Go API + managed PostgreSQL, paid hosting allowed; details (sign-in method, host, budget) are open ([DECISIONS.md](DECISIONS.md#open-questions-awaiting-decision))
- [ ] Using the site without an account stays possible (progress in `localStorage`)
- [ ] Roadmap page: interactive map (roadmap.sh style); clicking a node opens a panel: theory, practice, status
- [ ] Practice expands: exercises (complete / fix the code), test-based checking, "Check yourself" questions
- [ ] Platform sections, in the agreed order ([DECISIONS.md](DECISIONS.md#platform-sections-2026-11-23)):
  1. **roadmap + theory/practice** (above);
  2. **visual code explanations**: building on the step player and memory visual from variants B/D;
  3. **tests / quizzes** per node and per roadmap;
  4. **interview preparation**: questions by topic and level, linked to nodes and as a standalone list; system design sub-section (reference: hellointerview.com);
  5. **algorithms and data structures**: separate, technology-independent, pattern-based track (reference: algomaster.io);
  6. **live coding** (postponed): timed in-browser tasks with automatic checks; needs a test-case runner decision first
- [ ] **Design gaps for the platform** (the prototype and the pages built so far are mostly Go-centric: Go hero, Go section cards, "Niyə bu sayt" bento, demo player, technology switcher with "coming soon" items). Before building each section below, do a short design pass for it directly in `packages/theme` / `apps/site` (the `design/` prototype stays frozen): technology pages that are not Go-specific, direction page (Backend), question list with filters + flashcard trainer (interview), pattern pages (algorithms), study plans / progress. Until then Phase 2 module 2 only finishes `/`, `/go/roadmap/`, `/roadmaps/backend/` from the existing D reference
- [ ] **Source review per section** — for each platform section Claude decides what can be taken from which source (roadmap.sh, itbooster.ru, hellointerview.com, algomaster.io, greatfrontend.com, yeahub.ru): topic structure, UX ideas, or (only with consent) texts; the decision is recorded in [REFERENCES.md](REFERENCES.md)
- [ ] Read the terms of greatfrontend.com (not verified yet) and decide what to take from it for content and design
- [ ] Read yeahub.ru's public offer (Google Docs linked from `/ru/docs`) and the license of its GitHub repo; record the result in [REFERENCES.md](REFERENCES.md)
- [ ] Reach out to the authors of hellointerview.com, algomaster.io, greatfrontend.com and yeahub.ru (texts only with written consent — [DECISIONS.md](DECISIONS.md#vision-2026-11-23))
- [ ] Platform structure (itbooster style): home → technologies and roadmaps → roadmap → node → lesson
- [ ] The technology switcher becomes functional; routes take the form `/<technology>/...` (e.g. `/go/slices`), Go links don't break
- [ ] Shared search across all technologies

## Phase 7 — New technologies `[ ]`

- [ ] Each technology is added in the same format: roadmap + theory + practice
- [ ] Candidates: Python, TypeScript, Rust, SQL (order decided later)
- [ ] Running code needs a separate solution per language (Go uses the `go.dev` proxy; others WASM or an external API) — researched when the language is added

## Future (not needed now)

- [ ] Other directions: Frontend, DevOps, etc.
- [ ] Other site languages (e.g. EN, RU, TR) — only after a quality, reviewed translation of the existing content; easy structurally because code and explanations are stored separately (one file per locale)

---

## Where to start next session

0. **Design:** if the user says to continue the design, read [DESIGN-V2.md](DESIGN-V2.md) (brief, references, v2–v6 status; next: the user's feedback on v6 "Liquid glass", then the other pages in the chosen style).
1. `pnpm install`, then `pnpm lint && pnpm format:check && pnpm check && pnpm build` to confirm the workspace is healthy. The design reference: `node design/serve.mjs` → http://localhost:4321/d/.
2. Phase 2, **module 2** (`feat/site-content-theme`), continued: the lesson page `/go/<slug>/` is done; next `/go/roadmap/`, `/` and `/roadmaps/backend/`. Lesson page leftovers: the explanation ↔ code arrow/curved line (moved to Phase 2), "Redaktə" + live run (module 3: CodeMirror, `/api/run`). Also still to port: the "Oxuma — gör" demo player and the "Niyə bu sayt" bento (left out of `/go/` on purpose).
3. The platform name is still open; nothing in Phase 2 depends on it.
4. Work on a branch and commit with Conventional Commits (see [CONTRIBUTING.md](../CONTRIBUTING.md)); group work into module PRs.

Note: Go 1.27.4 is installed locally (the project targets 1.26; the lessons verify on both), so examples can be checked with `go vet` / `go run`. The system Node is 22.13; the project uses Node 24 through pnpm (`devEngines`).
