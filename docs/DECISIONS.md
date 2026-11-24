# Decisions

Agreed decisions and their rationale. When a decision changes, don't delete the old one: strike it through (`~~...~~`) and write the new one with a date.

## Vision (2026-11-23)

| Decision | Rationale |
|---|---|
| "Nümunələrlə Go" is **the first prototype**; the end goal is a **learning platform** in the spirit of roadmap.sh and itbooster.ru | The user's main goal |
| Developers learn **by roadmap**; at every step both **theory** and **practice** come from this resource | Developers should learn in the right order, from one source |
| **All technologies on one site**; no separate sites | The user's decision; shared design, search, progress |
| ~~roadmap.sh and itbooster.ru are only **structure and UX references**; their content and roadmaps are not copied, we write our own roadmaps~~ | ~~Legal safety~~ |
| Concrete roadmaps (Go, Backend, etc.) are refined **based on a merge of [roadmap.sh](https://roadmap.sh) and [itbooster.ru](https://itbooster.ru/)**: the topic lists and ordering of both are compared and merged, and gaps are filled (2026-11-23) | The user's decision: the strengths of both resources in one roadmap |
| ~~From these resources, **topics, their ordering and dependencies** are taken; **texts, explanations and diagrams are written by us**, not copied directly~~ | ~~Neither site's content is openly licensed~~ |
| From these resources, **topics, ordering and dependencies** are taken. **Texts** are taken from these resources and **translated** into Azerbaijani **when the user marks** a specific topic. If the user hasn't marked it, we write the text ourselves (2026-11-23) | The user's decision |
| **Condition:** before text translated from roadmap.sh or itbooster.ru is **committed to the public repo or published on the site**, written consent must be obtained from the author. Until consent is obtained, translations are kept only locally / privately (the `content-private/` directory in `.gitignore`). When consent is obtained, it is recorded in this file and attribution to the source is shown on the site | roadmap.sh license (the `license` file in its repo, checked 2026-11-23): text and images are for personal use only; publishing in any other form, including as text, requires the author's prior consent. itbooster.ru states no open license — all rights are considered reserved by default |
| Two kinds of roadmap: by **technology** (e.g. "Go") and by **direction** (e.g. "Backend"). A direction roadmap can combine nodes from several technologies | The user: "Go is a technology, backend is a direction" — both are needed |
| **User accounts** will be needed after the first prototype (in the platform phase) | Progress should persist across devices; a personal path along the roadmap should be tracked |
| The platform follows the itbooster.ru and roadmap.sh approach: users choose by **technology** (Go, Python…) **and** by **direction** (Backend, Frontend…). Planned sections: **roadmaps**, **tests/quizzes**, **interview preparation** (incl. system design), **algorithms and data structures**, **live coding**, **visual code explanations**. The detailed model of each section will be discussed separately (2026-11-23) | The user's decision |
| Variant **D** stays the base design, but it **will change** to fit the platform scope. The **home page** in particular will likely be redesigned: today it presents only Go, while the platform needs a technology + direction choice and the new sections. To be done after the discussion (2026-11-23) | The user's decision |
| **Language policy:** the site's primary language is **Azerbaijani** (`az`, default locale, no URL prefix). Other languages are added **only after a quality translation** of the existing content is ready; unreviewed machine translation is not published. The content structure is i18n-ready from the start (one file per locale: `az.md`, `en.md`…) (2026-11-23) | The user's decision; quality over quantity |
| [hellointerview.com](https://www.hellointerview.com/) and [algomaster.io](https://algomaster.io/) are added as sources for interview preparation, system design and algorithms. The same rule as for roadmap.sh applies: topics, coverage and ordering are used as a reference; texts are translated only when the user marks them, kept in `content-private/`, and published only after the author's written consent (2026-11-23) | Both sites' terms (checked 2026-11-23) keep all rights reserved: hellointerview.com ([terms](https://www.hellointerview.com/terms)) forbids copying, publishing and derivative works; algomaster.io ([terms](https://algomaster.io/policies/terms-of-service)) declares the content its exclusive property and grants no reuse rights |
| [greatfrontend.com](https://www.greatfrontend.com/) is added as a source for **both content and design**: front-end interview preparation, coding/UI practice, study plans. The same rule as for the other sources applies: topics, coverage and ordering are a reference; texts are translated only when the user marks them, kept in `content-private/`, and published only after the author's written consent. Its terms could **not be verified** (HTTP 429, 2026-11-23), so it is treated as all rights reserved until checked (2026-11-23) | The user's decision. Never assume a license that was not read |

## Platform sections (2026-11-23)

| Decision | Rationale |
|---|---|
| Everything hangs off a **roadmap node**. A node has up to five facets: **Theory** (concept article), **Practice** (working example, exercise), **Visual** (step-by-step explanation), **Test** (node quiz), **Interview** (questions on this topic). Sections are different views of the same content, not separate sites | One platform; content is not duplicated |
| **Tests/quizzes:** 5–10 questions per node (multiple choice, "what does this code print?"), plus a final test per roadmap; linked by `node-id` | Cheap to build, measures learning |
| **Interview preparation:** questions by topic and level with answers; linked to nodes **and** browsable as a standalone list. **System design** is a separate sub-section (reference: hellointerview.com) | Questions are useful both inside a lesson and on their own |
| **Algorithms and data structures** are a **separate, technology-independent track**, organised by pattern (two pointers, sliding window, BFS/DFS…), each pattern with theory + exercises (reference: algomaster.io) | The user agreed; patterns don't belong to one language |
| **Live coding** is **postponed** until after the other sections: it needs a test-case runner (the `go.dev/_/compile` proxy returns output only), and the work repeats per language | The user's decision; highest technical risk |
| **Rollout order:** 1) roadmap + theory/practice → 2) visual explanations → 3) tests/quizzes → 4) interview preparation → 5) algorithms → 6) live coding | The user agreed; ordered by value vs. cost and risk |
| **Home page** (itbooster style): hero → **choose your path** (by technology / by direction) → **node model** (one node, five facets) → **platform sections** with status → visual demo. Each technology gets its own page (prototype: `design/d/go.html`, future route `/go/`) | Chosen by Claude at the user's request ("up to you"): the platform needs a technology + direction choice up front, while the Go landing content stays one click away |
| A dedicated **roadmap page** (`design/d/roadmap.html`, future `/go/roadmap` and `/roadmaps/<id>`) is a first-class part of the platform, reachable from the header nav, the home page, the Go page and lessons. It shows a technology roadmap (Go) and a **direction roadmap preview** (Backend: Git → HTTP → Go → SQL → Docker → Deploy, Go nodes are real, the rest "coming soon"). Clicking a node opens the 5-facet panel; the selected node is in the URL hash (`#slices`, `#backend/goroutines`) | The user did not see the roadmap after the home page redesign: it was hidden as the third tab of the Go page, but the roadmap is the core of the platform and "will be used in the project and will develop" (2026-11-23) |
| Until the platform name is decided, the prototype uses the **working name "Nümunələrlə"**, kept in one place per page (`data-brand`) so it's easy to replace | The user is still thinking about the name |

## Product and content

| Decision | Rationale |
|---|---|
| Site name: **Nümunələrlə Go** | Natural translation of the original name |
| Content based on gobyexample.com, but with **simplified** examples | The user's wish: simpler, clearer |
| The original's **compact explanation style** is kept: 2–3 sentences per step | A strength of Go by Example |
| **Terms stay in English** (`slice`, `goroutine`, `channel`), with a short explanation on first use | Consistency with official docs and search; translated terms confuse |
| License **CC BY 3.0**; footer credits Mark McGranaghan and Eli Bendersky with a "based on, adapted and simplified" note | License requirement |
| Lesson structure: explanation → run → "Remember" → "Check yourself" question → "Learned" → next | Learning loop |
| 84 examples, 9 sections (list: `design/shared/data.js`) | The original's structure, grouped |

## Technical architecture

| Decision | Rationale |
|---|---|
| ~~**Static site**, no backend or DB~~ | ~~Free hosting, simplicity; DB only if accounts/comments are needed~~ |
| The Go prototype (Phases 1–5) is a **static site** with no backend or DB; in the platform phase (6+) a **backend + database** is added for accounts. Content pages stay static (2026-11-23) | Accounts will be needed after the first prototype; static content gives speed and free hosting |
| **Backend for accounts (Phase 6+):** our own **Go API** on top of a **managed PostgreSQL**. **Paid hosting is allowed** for the backend and the database; the static site stays on the free Cloudflare Pages (2026-11-23) | The user's decision: Go + PostgreSQL fits the project's own subject and the later live-coding runner, and paid hosting avoids free-tier limits (sleeping instances, quotas). Candidates for the managed Postgres and the API host (Neon, Supabase Postgres, Cloud SQL, Cloud Run, Fly.io, Render…) are compared with live prices when Phase 6 starts. Rejected for now: all-in-one hosted backends (Supabase auth/API, Firebase, Nhost) and PocketBase (SQLite) |
| **Astro** + Content Collections + Zod | Fast HTML with zero JS, Markdown/MDX, multiple collections |
| **Shiki** (build-time syntax highlighting) | VS Code quality, no JS needed in the browser |
| **Pagefind** (static search) | Serverless, with a `Ctrl+K` palette |
| **CodeMirror 6**, lazy-loaded only when "Edit" is clicked | Keep the initial load light |
| Running code: Cloudflare Pages Function → `go.dev/_/compile` proxy; Playground link as a fallback | `go.dev` sends no CORS header; the free limit (100k requests/day) is enough |
| ~~**Monorepo**: `packages/theme`, `apps/go`, `content/go`; later `apps/hub`~~ | ~~Both a separate site and a hub can be built from the same content~~ |
| ~~First release is a **single site**, hub later~~ | ~~YAGNI — a hub-ready structure is enough~~ |
| ~~**Monorepo** (npm workspaces): `packages/theme`, a **single** `apps/site`, `content/<technology>/`, `content/roadmaps/` (2026-11-23)~~ | ~~There will be no separate sites; all technologies on one site~~ |
| **Monorepo** (**pnpm** workspaces): `packages/theme`, a **single** `apps/site`, `content/<technology>/`, `content/roadmaps/` (2026-11-23) | No separate sites; the user chose pnpm (fast, strict dependency resolution, first-class workspaces) |
| First release with Go content only, but routes are `/<technology>/...` from the start (e.g. `/go/slices`) (2026-11-23) | So links don't break when new technologies are added |
| Content comes in two kinds: **theory** (concept) and **practice** (example, exercise); a roadmap node links to both (2026-11-23) | Vision: theory + practice together |
| Content: each example is a directory — `meta.yaml`, `main.go`, `az.md`, `output.txt` | Code is verified in CI, output is generated automatically, switching to other languages is easy |
| Progress in `localStorage` | No account required |
| **Hosting: Cloudflare Pages**, no domain → `*.pages.dev` | Free, preview URL for every PR |
| CI: GitHub Actions — `go vet`, `go run`, output comparison, build, link check | Examples must never break |
| Repo is **public**: https://github.com/seymur-orucov/go-by-example-az (2026-11-23) | Content is CC BY licensed; open source, for suggested fixes |

## Engineering conventions (2026-11-23)

The project follows widely used international conventions and best practices. Details for contributors: [CONTRIBUTING.md](../CONTRIBUTING.md).

| Decision | Rationale |
|---|---|
| **Language:** code, identifiers, code comments, technical docs, commit messages, branch names and PR descriptions are in **English**. Site UI text and learning content are in **Azerbaijani**; communication with the user is in Azerbaijani | The user's decision; open source contributors and tooling expect English |
| Commit messages follow [**Conventional Commits 1.0**](https://www.conventionalcommits.org/en/v1.0.0/): `<type>(<scope>): <subject>`, imperative mood, subject ≤ 72 chars. Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`. Scopes: `design`, `site`, `theme`, `content`, `docs`, `ci`, `deps`, `repo`, `api` | The user's decision; enables automatic changelogs and semver |
| Commits made before 2026-11-23 stay as they are (Azerbaijani, free format); history is not rewritten | The repo is public; rewriting `main` would break clones |
| **GitHub Flow:** `main` is always deployable; work happens on short-lived branches (`feat/…`, `fix/…`, `docs/…`, `chore/…`, `refactor/…`), merged through a pull request with **squash merge** | Simple, fits continuous deployment to Cloudflare Pages |
| Versioning with [**SemVer**](https://semver.org/) and a `CHANGELOG.md` in the [**Keep a Changelog**](https://keepachangelog.com/) format, starting with the first release in Phase 2 | Standard, readable release history |
| `.editorconfig` (UTF-8, 2 spaces, final newline) and `.gitattributes` (`* text=auto eol=lf`) | Consistent formatting across editors; Windows development must not introduce CRLF |
| Package manager: **pnpm** (workspaces); the version is pinned via `packageManager` in `package.json` (Corepack), done in Phase 2 | The user's decision |
| From Phase 2: **commitlint** + git hooks (**lefthook**), **Prettier** + **ESLint**, lint and type-check in CI | Conventions are enforced by tools, not by memory |
| Licenses: code under **MIT** ([LICENSE](../LICENSE)), learning content under **CC BY 3.0** ([LICENSE-CONTENT](../LICENSE-CONTENT)), because it is derived from Go by Example | Code and content have different needs; CC BY 3.0 is required for the derived content |
| GitHub templates: PR template and issue templates (bug report, feature request) in `.github/` | Consistent, reviewable contributions |

## Phase 2 technical decisions (2026-11-23)

| Decision | Rationale |
|---|---|
| Phase 2 is delivered in **3 PR modules**: 1) repo skeleton + tooling + CI, 2) content model + `packages/theme` + the 4 pages, 3) search (Pagefind), edit (CodeMirror), run (`/api/run`) | The user's rule: group PRs into modules instead of many small PRs |
| Interactivity is **vanilla TypeScript** (the prototype's `d.js`, `nodes.js`, `b.js`, `c.js`, `app.js` are ported); no UI framework | The user's choice; zero extra dependencies, minimal JS in the browser, exact prototype behaviour |
| Workspace packages are **private** with a neutral scope (`@platform/site`, `@platform/theme`) | The platform name is still undecided; renaming costs nothing |
| Git hooks: **lefthook** (pre-commit: Prettier + ESLint on staged files; commit-msg: commitlint) | One config file, fast, works on Windows; picked from "husky or lefthook" |
| Commit scopes extended with `repo` (root config and tooling) and `api` (Cloudflare functions) | Needed by Phase 2 commits |
| **Node 24** is pinned through `devEngines.runtime` (pnpm downloads it); `engines.node >= 22.23.4`; CI uses `.node-version` | Astro 7 requires Node >= 22.23.4 while the system Node is 22.13; no system change is needed |
| Versions: **Astro 7**, **TypeScript ~6.0** (not 7), ESLint 10, Prettier 3, pnpm 12 | `typescript-eslint` supports TypeScript < 6.1 only; revisit when it supports 7 |
| Routes: `/` (platform home), `/go/` (technology page), `/go/<slug>/` (lesson), `/go/roadmap/` (technology roadmap), `/roadmaps/backend/` (direction roadmap) | Fits the `/<technology>/...` rule; directions live under `/roadmaps/` |
| Content layout: `content/go/examples/<slug>/{meta.yaml, main.go, steps.yaml, az.md, output.txt}`; localized files carry a locale suffix (`az`); roadmaps in `content/roadmaps/*.yaml`; all 84 topics exist as `meta.yaml` (`status: ready | planned`) | `main.go` stays pure Go so CI can run it; i18n-ready; planned topics render as "tezliklə" |
| `design/` stays untouched as the visual reference until the site reaches parity | Side-by-side comparison; nothing is lost |

## Lesson content format (2026-11-24)

Supersedes the file list in the "Content layout" row above (`az.md` becomes `lesson.az.md`; `quiz.az.yaml` is added).

| Decision | Rationale |
|---|---|
| A lesson is `content/<technology>/examples/<slug>/` with `meta.yaml`, `main.go`, `lesson.<locale>.md`, `steps.yaml`, `quiz.<locale>.yaml` and the generated `output.txt` | Code, language-independent data and localized text are separate; a new locale only adds `*.<locale>.*` files |
| Code ↔ step link: **marker comments** `//@step <id>` in `main.go`; a step runs until the next marker or the end of `main`. Markers are stripped at build time and line ranges are computed | Hand-written line numbers (`lines: [9, 13]` in the prototype) break on every code edit; `main.go` stays plain, runnable Go |
| Text lives in `lesson.<locale>.md`: an intro, then one `## Title {#id}` heading per step, then optional closing text. Step ids must match the markers; a mismatch fails the build | Long prose is easier to write, review and translate in Markdown than in YAML |
| `steps.yaml` holds per-step data keyed by step id: `out` (expected output) and optional `vis` with a `kind` (`slice`, `map`, `channel`, `goroutine`, …) | Visual data is language-independent; `kind` leaves room for new visualizers |
| CI checks that the steps' `out` values appear in `output.txt` in order | Wrong output never reaches the site |
| **Quiz**: required for every `status: ready` lesson, **5–10 questions** depending on the topic (the user's rule); stored in `quiz.<locale>.yaml` | Self-check on every lesson; kept in its own file because tests become a separate platform section in Phase 6 |
| Slugs and step ids are **stable** once published | Future server-side progress and roadmap nodes (Phase 6) reference them |

## Design

| Decision | Rationale |
|---|---|
| Chosen variant: **D** (A + B + C merged) | The user picked what they liked from each variant ([HISTORY.md](HISTORY.md), 7–8) |
| Colors: neutral black/gray + **blue → purple** gradient; 4 palettes (Nebula default, İndiqo, Okean, Qrafit) | The user: "modern blue, purple, gray, black"; frontscope's yellow was not liked |
| **Dark theme first**, opens according to the system preference; light theme fully supported | |
| Fonts: **Inter** (text) + **JetBrains Mono** (code); ligatures disabled in code | Support for `ə ı ş ç ğ ö ü`; beginners shouldn't see `<=` as `≤` |
| B's Unbounded/Syne heading fonts are not used | frontscope's fonts were not liked; Syne lacks `ə` |
| In lessons the **code is full height**, not trimmed per step; output under the code | Liked in A |
| **Two-way** explanation ↔ code highlighting | Not in Go by Example; the user's favorite feature |
| Memory visual inside each step; step controls (‹ 01/05 › ▶) in the code window header | Merged in D |
| Sidebar: all sections, collapsible groups, progress bar | Liked in A |
| Lesson page view modes: hide sidebar, centered/full width, Zen (always centered) | The user's wish |
| Home page background: a **slowly moving gradient** in two palette colors (not waves) | The user rejected waves and sent a reference image |
| Scroll, tab switch and bento animations in the spirit of frontscope; all disabled under `prefers-reduced-motion` | The user's wish + accessibility |
| Palettes: **Nebula is the default**; the other three (İndiqo, Okean, Qrafit) stay as user-selectable options (2026-11-23) | The user agreed to the proposal |
| The explanation ↔ code **arrow / curved line** is moved to Phase 2 and built with the real components (2026-11-23) | The user agreed; it needs the final lesson layout |
| Variants A, B and C are **archived** under `design/archive/`, not deleted (2026-11-23) | The user agreed; kept for reference. D's shared files live in `design/shared/` (done 2026-11-23) |
| Technology switcher in the header (`Go ▾` → Python, Rust… "coming soon") and a "One platform, several languages" section | Preparation for the hub |
| Narrow screens: < 1200px a code snippet under each step; < 980px the sidebar becomes a drawer | Mobile UX |
| Lesson quiz ("Özünü yoxla") is a **slider**: one question at a time, prev/next and `←`/`→`, progress dots (green = right on the first try, amber = after a retry), a result slide with the score and "Yenidən başla" (2026-11-24) | The user's wish |

## Open questions (awaiting decision)

- ~~Final palette choice: keep 4 options, or one default?~~ — decided 2026-11-23: Nebula default, 4 options stay.
- ~~Is an arrow/curved line between explanation ↔ code needed?~~ — moved to Phase 2 (2026-11-23).
- ~~Should variants A, B, C be deleted after approval, or archived?~~ — archived under `design/archive/` (2026-11-23).
- Which technology comes after Go?
- Consent from the authors of roadmap.sh (Kamran Ahmed) and itbooster.ru to translate and publish texts — who reaches out, and when? Consent records: _none yet_.
- ~~How will the backend for accounts be built: our own API (Go + PostgreSQL) or a hosted service? Must hosting stay free?~~ — decided 2026-11-23: Go API + managed PostgreSQL, hosting may be paid (see Technical architecture).
- Backend details for Phase 6: sign-in method (GitHub / Google OAuth, email?), session/token approach (own code or a library such as Better Auth / an OAuth library), which managed Postgres and which API host, budget. Compare with live prices before Phase 6.
- Users without an account: does progress stay in `localStorage` and get migrated to the server when they sign up?
- ~~**Platform sections**: how they are modelled, linked to nodes, and ordered~~ — decided 2026-11-23, see "Platform sections".
- ~~**Home page redesign**~~ — first version done 2026-11-23 (`design/d/index.html`); awaiting the user's feedback.
- **Platform and repo name:** "Nümunələrlə Go" and `go-by-example-az` no longer describe the whole platform. The prototype uses the working name "Nümunələrlə"; the user is still thinking (2026-11-23). Rename before or after Phase 2?
- Live coding runner: write `go test`-style checks through the `go.dev` proxy, or run our own sandbox? — Decide when the section is started (last in the order).
- Consent from the authors of hellointerview.com and algomaster.io (same as for roadmap.sh and itbooster.ru). Consent records: _none yet_.
- greatfrontend.com: read its terms (could not be fetched on 2026-11-23) and record the license here; then ask the authors for consent if texts are wanted. Consent records: _none yet_.
- Which languages come after Azerbaijani, and who reviews translation quality?
