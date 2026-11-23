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

## Product and content

| Decision | Rationale |
|---|---|
| Site name: **Nümunələrlə Go** | Natural translation of the original name |
| Content based on gobyexample.com, but with **simplified** examples | The user's wish: simpler, clearer |
| The original's **compact explanation style** is kept: 2–3 sentences per step | A strength of Go by Example |
| **Terms stay in English** (`slice`, `goroutine`, `channel`), with a short explanation on first use | Consistency with official docs and search; translated terms confuse |
| License **CC BY 3.0**; footer credits Mark McGranaghan and Eli Bendersky with a "based on, adapted and simplified" note | License requirement |
| Lesson structure: explanation → run → "Remember" → "Check yourself" question → "Learned" → next | Learning loop |
| 84 examples, 9 sections (list: `design/data.js`) | The original's structure, grouped |

## Technical architecture

| Decision | Rationale |
|---|---|
| ~~**Static site**, no backend or DB~~ | ~~Free hosting, simplicity; DB only if accounts/comments are needed~~ |
| The Go prototype (Phases 1–5) is a **static site** with no backend or DB; in the platform phase (6+) a **backend + database** is added for accounts. Content pages stay static (2026-11-23) | Accounts will be needed after the first prototype; static content gives speed and free hosting |
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
| Commit messages follow [**Conventional Commits 1.0**](https://www.conventionalcommits.org/en/v1.0.0/): `<type>(<scope>): <subject>`, imperative mood, subject ≤ 72 chars. Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`. Scopes: `design`, `site`, `theme`, `content`, `docs`, `ci`, `deps` | The user's decision; enables automatic changelogs and semver |
| Commits made before 2026-11-23 stay as they are (Azerbaijani, free format); history is not rewritten | The repo is public; rewriting `main` would break clones |
| **GitHub Flow:** `main` is always deployable; work happens on short-lived branches (`feat/…`, `fix/…`, `docs/…`, `chore/…`, `refactor/…`), merged through a pull request with **squash merge** | Simple, fits continuous deployment to Cloudflare Pages |
| Versioning with [**SemVer**](https://semver.org/) and a `CHANGELOG.md` in the [**Keep a Changelog**](https://keepachangelog.com/) format, starting with the first release in Phase 2 | Standard, readable release history |
| `.editorconfig` (UTF-8, 2 spaces, final newline) and `.gitattributes` (`* text=auto eol=lf`) | Consistent formatting across editors; Windows development must not introduce CRLF |
| Package manager: **pnpm** (workspaces); the version is pinned via `packageManager` in `package.json` (Corepack) from Phase 2 | The user's decision |
| From Phase 2: **commitlint** + git hooks (husky or lefthook), **Prettier** + **ESLint**, lint and type-check in CI | Conventions are enforced by tools, not by memory |
| Licenses: code under **MIT** ([LICENSE](../LICENSE)), learning content under **CC BY 3.0** ([LICENSE-CONTENT](../LICENSE-CONTENT)), because it is derived from Go by Example | Code and content have different needs; CC BY 3.0 is required for the derived content |
| GitHub templates: PR template and issue templates (bug report, feature request) in `.github/` | Consistent, reviewable contributions |

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
| Technology switcher in the header (`Go ▾` → Python, Rust… "coming soon") and a "One platform, several languages" section | Preparation for the hub |
| Narrow screens: < 1200px a code snippet under each step; < 980px the sidebar becomes a drawer | Mobile UX |

## Open questions (awaiting decision)

- Final palette choice: keep 4 options, or one default?
- Is an arrow/curved line between explanation ↔ code needed?
- Should variants A, B, C be deleted after approval, or archived?
- Which technology comes after Go?
- Consent from the authors of roadmap.sh (Kamran Ahmed) and itbooster.ru to translate and publish texts — who reaches out, and when? Consent records: _none yet_.
- How will the backend for accounts be built: our own API (e.g. Go + PostgreSQL — which also fits the project's own subject) or a hosted service (Supabase, etc.)? Sign-in method: GitHub / Google OAuth, email? Must hosting stay free? — Must be decided before Phase 6.
- Users without an account: does progress stay in `localStorage` and get migrated to the server when they sign up?
- **Platform sections** (to be discussed in detail): how tests/quizzes, interview preparation, algorithms, live coding and visual code explanations are modelled, how they link to roadmap nodes, and which of them come first.
- **Home page redesign:** how the home page presents the choice of technology and direction and the platform sections (today it presents only Go).
- **Platform and repo name:** "Nümunələrlə Go" and `go-by-example-az` no longer describe the whole platform. Rename before or after Phase 2?
- Consent from the authors of hellointerview.com and algomaster.io (same as for roadmap.sh and itbooster.ru). Consent records: _none yet_.
- Which languages come after Azerbaijani, and who reviews translation quality?
