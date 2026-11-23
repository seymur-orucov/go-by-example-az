# Roadmap

Last updated: 2026-11-23

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

## Phase 1 — Design prototype `[~]` (current phase)

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
- [ ] Platform name (working name "Nümunələrlə" for now)
- [ ] **Final approval** of Variant D — the user's final feedback
- [ ] Final palette choice (currently 4 options: Nebula, İndiqo, Okean, Qrafit; Nebula by default)
- [x] A separate review of the mobile view for D — home, Go page and lesson page (incl. the topics drawer) checked at 390px in headless Chrome, no horizontal scroll (2026-11-23); a check on a real phone is still worth doing
- [x] Final check of the light theme for D — platform home, Go page and lesson page checked in light (and the home in dark) with the palettes (2026-11-23)
- [ ] Optional: an **arrow/curved line** linking explanation and code (the user's idea, not done yet)
- [ ] After approval, move variants A, B, C to an archive (e.g. `design/archive/`) or delete them

---

## Phase 2 — Project skeleton `[ ]`

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

- [ ] pnpm workspaces (version pinned via `packageManager`), Astro, Content Collections + Zod schema
- [ ] Tooling: commitlint + git hooks (husky or lefthook), Prettier + ESLint, `CHANGELOG.md` (Keep a Changelog) and SemVer from the first release
- [ ] Move Variant D's tokens and components into `packages/theme`
- [ ] Build-time syntax highlighting with Shiki (replacing the prototype's simple highlighter)
- [ ] Static search with Pagefind (`Ctrl+K` palette)
- [ ] CodeMirror 6 — lazy-loaded only when "Edit" is clicked
- [ ] `/api/run` — Cloudflare Pages Function, proxy to `go.dev/_/compile` (no CORS, so a proxy is needed)
- [ ] Progress in `localStorage` (with try/catch)
- [ ] View modes (sidebar, width, zen) and animations move into components; `prefers-reduced-motion` is preserved

## Phase 3 — Pilot content `[ ]`

10 examples, each simpler than the original, with a compact explanation in Azerbaijani:

- [ ] hello-world · values · variables · constants · for · if-else · slices · maps · functions · goroutines
- [ ] Terminology glossary (`docs/GLOSSARY.md`): English term + short Azerbaijani explanation
- [ ] Step visuals for topics that need them (slice, map, channel, goroutine)

## Phase 4 — CI/CD `[ ]`

- [x] GitHub repo (public): https://github.com/seymur-orucov/go-by-example-az
- [ ] GitHub Actions: `setup-go` → `go vet` + `go run` for each `main.go` → compare against `output.txt`; `pnpm install --frozen-lockfile && pnpm build`; lint + type-check; commit message check; link check
- [ ] Cloudflare Pages: GitHub integration (main → production, PR → preview URL). The account is connected by the user

## Phase 5 — Remaining ~74 examples `[ ]`

- [ ] Added section by section (84 examples in total, 9 sections — the list is in `design/data.js`)

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
- [ ] Two kinds of roadmap:
  - **technology** roadmap — e.g. "Go": the language itself, from simple to complex;
  - **direction** roadmap — e.g. "Backend": combines nodes from several technologies (Go, SQL, HTTP, Docker…); nodes reference technology content, content is not duplicated
- [ ] **User accounts**: sign-up / sign-in, server-side progress and sync across devices, a personal path along the roadmap. This needs a backend + database; content pages stay static. Technology choice is an open question ([DECISIONS.md](DECISIONS.md#open-questions-awaiting-decision))
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
- [ ] Reach out to the authors of hellointerview.com and algomaster.io (texts only with written consent — [DECISIONS.md](DECISIONS.md#vision-2026-11-23))
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

1. `node design/serve.mjs` → open http://localhost:4321/d/ (platform home) and http://localhost:4321/d/go.html (Go page).
2. Next topic: the user's **feedback on the new platform home page**; the platform name is still open.
3. Continue from the "Phase 1 → Remaining" list, or apply the user's new feedback.
4. Once D is approved, move to Phase 2: first agree on the skeleton in plan mode.
5. Work on a branch and commit with Conventional Commits (see [CONTRIBUTING.md](../CONTRIBUTING.md)).

Note: **Go is not installed** on the local machine (Node 22 is). Installing Go before Phase 3 is recommended so examples can be verified locally.
