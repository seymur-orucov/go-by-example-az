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
| **Monorepo** (npm workspaces): `packages/theme`, a **single** `apps/site`, `content/<technology>/`, `content/roadmaps/` (2026-11-23) | There will be no separate sites; all technologies on one site |
| First release with Go content only, but routes are `/<technology>/...` from the start (e.g. `/go/slices`) (2026-11-23) | So links don't break when new technologies are added |
| Content comes in two kinds: **theory** (concept) and **practice** (example, exercise); a roadmap node links to both (2026-11-23) | Vision: theory + practice together |
| Content: each example is a directory — `meta.yaml`, `main.go`, `az.md`, `output.txt` | Code is verified in CI, output is generated automatically, switching to other languages is easy |
| Progress in `localStorage` | No account required |
| **Hosting: Cloudflare Pages**, no domain → `*.pages.dev` | Free, preview URL for every PR |
| CI: GitHub Actions — `go vet`, `go run`, output comparison, build, link check | Examples must never break |
| Repo is **public**: https://github.com/seymur-orucov/go-by-example-az (2026-11-23) | Content is CC BY licensed; open source, for suggested fixes |

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
