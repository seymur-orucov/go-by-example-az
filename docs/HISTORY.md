# Work log

The user's request and the work done in each iteration. Newest at the bottom.

---

## 2026-11-22 — Session 1: concept and first designs

### 1. Initial request
An Azerbaijani-language alternative to gobyexample.com: modern design, comfortable UX, the original's compact explanation style, simpler and clearer examples. Later, CI/CD with GitHub and deployment to a free server. In the future there could be a separate site per technology or a single hub. The design must be approved first.

### 2. Proposals and agreement
License (CC BY 3.0), architecture (Astro, Shiki, Pagefind, Cloudflare Pages), content model, monorepo, UX proposals and 5 questions were presented. The user's answers:
1. Hosting — agreed to Cloudflare Pages
2. Design direction — agreed to the proposal (clean, dark theme, Go blue)
3. No domain
4. Terms stay in English — agreed
5. Code should run inside the site; if it's too resource-heavy, a Playground link

Verified: `go.dev/_/compile` works but sends no CORS → a small proxy is needed. The plan was approved ([ROADMAP.md](ROADMAP.md)).

### 3. Variant A — "Clean"
`design/index.html`, `design/example.html`. Hero + code card, section cards; in the lesson, steps on the left and a sticky full program on the right, `Ctrl+K` search, progress, light/dark theme.

### 4. Feedback: two-way highlighting
The user really liked explanation → code highlighting and asked for the reverse: hovering the code should highlight the explanation on the left. Done. The idea of showing it with an arrow was noted for the future.

### 5. Variant B — "Scope" (based on frontscope.dev)
Large hero, floating tags, step player, memory visualizer, a "Program" section (track cards + numbered rows + filter). Files: `design/b/`.

Feedback: too similar to frontscope. New references were given: itbooster.ru (structure), roadmap.sh (simple, compact), frontscope.dev (visualizations — but its fonts and yellow color were not liked). Desired colors: modern blue, purple, gray, black.

### 6. Variant C — "Roadmap"
roadmap.sh's dense tile grid and roadmap, itbooster's code-style section labels and bento cards, scroll-spy dots, a technology switcher in the header (hub preparation), 4 color palettes. Files: `design/c/`.

### 7. Feedback: what was liked in each variant
- **A:** the Go version is shown on the home page; the "All topics" part; the lesson page sidebar is clearer and more solid; code isn't trimmed per step, it's shown full height.
- **B:** the "Don't read — see." section; the "Program — 9 sections. 84 examples." section.
- **C:** overall colors and design, structure, palette.

### 8. Variant D — merged
On top of C's colors, palette and structure: A's version badge, "All topics" cards, solid sidebar and full-height code; B's "Don't read — see." demo and "Program" section. "Program" switches between 3 views: All topics · By section · Roadmap. Files: `design/d/`.

---

## 2026-11-23 — Session 2: iterating on Variant D

### 9. The user chose D, additional requests
- A simple animation on the home page (e.g. a background wave).
- On the lesson page the sidebar should be hideable, there should be a Zen mode, and content should be either full width or centered.

Done:
- Lesson page: a "View" menu in the header; sidebar button and `[`; content width "Centered" (1220px) / "Full width" and `F`; Zen mode (`Z`, `Esc`) — header/sidebar/footer hidden, content centered, reading progress at the top, output panel bottom-left. Choices are remembered (zen only for the tab). File: `design/d/d.js`.
- Home page: SVG waves in the hero, entrance animations.

### 10. Feedback: not waves, a moving gradient
What was meant was not wave lines, but D's original background gradient moving slowly (two colors, possibly the current palette colors). Reference: a soft dark blue-purple gradient image.

Done: waves removed; in two palette colors, 3 large soft blobs drift along different paths on 28–40 second cycles and blend. The colors change with the palette.

### 11. Feedback: no scroll animations between sections (like on frontscope)
Done: the code label types out letter by letter, h2 words rise from under a mask, the "9 sections. 84 examples." numbers count up, the subtitle sharpens from blur, cards arrive in sequence, the hero fades on scroll, the demo player straightens from a 3D tilt.

### 12. Feedback: no animation on tab switches or in the "Why this site?" blocks
Done:
- Tab switches: cards arrive in sequence; on the roadmap the central line draws, nodes grow, branches come in from the sides; on section/filter changes rows slide in from the left.
- Bento cards: each has a topic-appropriate mini-animation (append, typing in a terminal, explanation ↔ code glow, quiz choice, button press, bar filling, shimmer). Runs only while on screen. On hover the card lifts and a cursor-following glow appears.

### 13. Repo and documentation
A git repo was created to continue the work; `README.md`, `docs/` (roadmap, log, decisions, references) and `CLAUDE.md` were written. By the user's choice a **public** repo was opened on GitHub: https://github.com/seymur-orucov/go-by-example-az

### 14. Main goal clarified: a unified learning platform
The user: after the first prototype, moving to a site in the spirit of itbooster.ru and roadmap.sh is the main goal. Developers should get both practice and theory from this resource along the right roadmap. All technologies will be on one site.

Done: the vision was written into the README and [ROADMAP.md](ROADMAP.md); Phase 6 (moving to the platform: roadmap model, theory + practice) and Phase 7 (new technologies) were added. In [DECISIONS.md](DECISIONS.md) the "separate sites / hub later" decision was revoked and replaced with a single site (`apps/site`, `/<technology>/...` routes); new open questions were added.

### 15. Answers to open questions
- Roadmap kind: **both** — "Go is a technology, Backend is a direction".
- Accounts: **will be needed after the first prototype**.

Done: the two roadmap kinds and accounts were recorded as decisions in [DECISIONS.md](DECISIONS.md); the "static site, no backend" decision was refined (prototype static, backend + DB on the platform). Direction roadmaps and accounts were added to Phase 6 in [ROADMAP.md](ROADMAP.md). New open question: backend technology, sign-in method and hosting for accounts.

### 16. Source of the roadmaps
The user: concrete roadmaps will be refined based on a merge of roadmap.sh and itbooster.ru resources.

Done: [DECISIONS.md](DECISIONS.md), [ROADMAP.md](ROADMAP.md) (a 4-step procedure in Phase 6) and [REFERENCES.md](REFERENCES.md) (new "Roadmap sources" section) were updated. Clarification: topics, ordering and dependencies are taken from these resources, while texts and diagrams are written by us, because their content is not openly licensed.

### 17. Translating texts
The user: texts are taken from those resources and translated when the user marks them.

Verified: roadmap.sh's `license` file allows only personal use of text and images and requires the author's prior consent for publishing in other forms; itbooster.ru has no open license.

Done: the rule was written into [DECISIONS.md](DECISIONS.md) with a condition — translations are kept in `content-private/` (not tracked by git) until the author consents, and move into the repo and onto the site after consent. A step to reach out to the authors was added to [ROADMAP.md](ROADMAP.md), and a license column to [REFERENCES.md](REFERENCES.md).

### 18. Platform scope, sources and engineering conventions
The user:
- Variant D is chosen, but it will change.
- The platform uses the itbooster.ru and roadmap.sh approach: choice by technology and by direction, roadmaps, tests, interview preparation, algorithms, live coding, visual code explanations. To be discussed in detail later.
- Because of that the home page will probably change: today it presents only Go.
- The primary site language is Azerbaijani; other languages are added after a quality translation of the existing content.
- Add https://www.hellointerview.com/ and https://algomaster.io/ to sources and references.
- The project must follow international conventions and best practices (git commits, etc.).

Answers to clarifying questions: commits in **Conventional Commits, English**; **code and docs in English**; add convention files now, tooling in Phase 2 with **pnpm**.

Verified: the terms of hellointerview.com and algomaster.io keep all rights reserved → the same rule as for roadmap.sh (texts only with the author's consent, in `content-private/` until then).

Done (branch `docs/platform-scope-and-conventions`):
- All docs translated to English ([README](../README.md), [CLAUDE.md](../CLAUDE.md), `docs/*`, [design/README.md](../design/README.md)).
- [DECISIONS.md](DECISIONS.md): platform scope, D as a base that will change, home page redesign, language policy, new sources; new "Engineering conventions" section (Conventional Commits, GitHub Flow, SemVer, Keep a Changelog, pnpm, MIT + CC BY 3.0); `npm` → `pnpm`; new open questions (platform sections, home page, platform/repo name, translation languages).
- [REFERENCES.md](REFERENCES.md): "Interview and algorithms sources" and "Engineering conventions" sections.
- [ROADMAP.md](ROADMAP.md): vision table, Phase 1 "Remaining" (sections discussion, home page redesign), pnpm and tooling in Phase 2, platform sections in Phase 6.
- New files: [CONTRIBUTING.md](../CONTRIBUTING.md), [LICENSE](../LICENSE) (MIT), [LICENSE-CONTENT](../LICENSE-CONTENT) (CC BY 3.0), `.editorconfig`, `.gitattributes`, `.github/` PR and issue templates.

### 19. Platform sections discussed, platform home page
Proposal: every section hangs off a roadmap node (theory · practice · visual · test · interview); a model per section; rollout order roadmap → visual → tests → interview → algorithms → live coding. The user's answers:
1. Order — agreed.
2. Algorithms and interview as separate sections — agreed.
3. Live coding — postpone.
4. Home page layout — "up to you" → itbooster style chosen.
5. Name — still thinking.

Done (branch `feat/d-platform-home`):
- [DECISIONS.md](DECISIONS.md): new "Platform sections" section; open questions updated (working name, live coding runner).
- `design/d/index.html` is now the **platform home**: hero, choose your path (technology / direction), node explorer (Go fragment, 5 tabs, clickable quiz), platform sections bento with status and mini-animations, visual demo.
- The former Go home moved to `design/d/go.html` (breadcrumbs, no hub section); lesson page links updated; working name "Nümunələrlə" in the logo.
- Checked in headless Chrome at desktop and 390px widths; mobile tweaks (2-column technology cards, compact node list).

### 20. Light theme and palette check of the platform home
The user merged both PRs (#1, #2) and asked to continue. Checked `d/index.html` in light and dark with all four palettes (palette ids are `nebula`, `indigo`, `ocean`, `graphite`). Everything works; one fix: the dimmed "coming soon" path cards had text below WCAG AA contrast, so they are now dimmed through the icon and a dashed border only, and card descriptions use `--text-muted`.

### 21. Light theme and mobile review of the Go and lesson pages
The user merged PR #3 and asked to continue. Checked `go.html` and the lesson page in the light theme and at 390px (lesson, topics drawer, Go page sections). No problems found, so no code changes. ROADMAP items for the light theme and the mobile review are closed; remaining Phase 1 items: palette decision, optional explanation ↔ code arrow, archiving variants A–C, final approval of D.

### 22. Roadmap page
The user agreed to the proposals (Nebula default with 4 palettes kept, archive variants A–C instead of deleting, arrow idea moved to Phase 2) and added: after the last changes the **roadmap tab was not visible**, and it will be used and developed in the project.

Cause: after the home page redesign the full roadmap was only the third tab inside the Go page; the home page showed a 6-node fragment.

Done (branch `feat/d-roadmap-page`):
- New `design/d/roadmap.html`: technology roadmap (Go, 9 sections / 84 topics, filter, progress) and a Backend direction preview; a sticky node panel with Theory · Practice · Visual · Test · Interview; deep links in the URL hash.
- Sample node content and the panel moved to `design/d/nodes.js` and are shared by the home page explorer and the roadmap page.
- “Yol xəritəsi” in the header nav of all D pages, the home page links, the Backend card/menu item (preview) and the Go hero now lead to the roadmap page.
- Checked in headless Chrome (desktop, 390px, light theme): 84 nodes, node selection, quiz, filter, kind switch, deep links, no JS errors, no horizontal scroll.
- [DECISIONS.md](DECISIONS.md), [ROADMAP.md](ROADMAP.md) and [design/README.md](../design/README.md) updated. Archiving A–C comes next, as a separate change.

### 23. New source: greatfrontend.com
The user asked to add https://www.greatfrontend.com/ to the sources, for both design and content.

Done: added to [REFERENCES.md](REFERENCES.md) (content sources and design references), [DECISIONS.md](DECISIONS.md), [CLAUDE.md](../CLAUDE.md) and [CONTRIBUTING.md](../CONTRIBUTING.md), and a ROADMAP item. **Not verified:** the site returned HTTP 429 to the fetch tool, so its terms were not read; it is treated as all rights reserved until checked. What to take for design and content is still to be agreed.

### 24. Archiving variants A, B, C
The user asked to archive the unchosen variants.

Done (branch `chore/archive-variants-a-c`, built on the roadmap page branch):
- D's shared files moved to `design/shared/`: `app.js`, `data.js`, `b.js` (was `b/b.js`), `c.js` (was `c/c.js`), `base.css` (was `c/style.css`).
- Variant A (`index.html`, `example.html`, `app.css`, `tokens.css`), B and C moved to `design/archive/{a,b,c}/`; moves done with `git mv`, so history is kept.
- Paths updated in all pages; the A | B | C | D switch now points to `/archive/*` and `/d/`; `serve.mjs` redirects `/` to `/d/`.
- Checked in headless Chrome: all 11 pages (4 in D, 2 each in A, B, C) load without JS errors or missing files.
- Docs updated: [CLAUDE.md](../CLAUDE.md), [CONTRIBUTING.md](../CONTRIBUTING.md), both READMEs, [ROADMAP.md](ROADMAP.md), [DECISIONS.md](DECISIONS.md).

### 25. Phase 2 plan and module 1: repo skeleton
The user asked to start Phase 2 in plan mode (after merging the archive PR #5) and to send PRs grouped into modules.

Plan (approved): 3 PR modules — 1) repo skeleton + tooling + CI, 2) content model + theme package + the 4 pages, 3) Pagefind search, CodeMirror edit, `/api/run` proxy. Interactivity stays **vanilla TypeScript** (user's choice). Details: [DECISIONS.md](DECISIONS.md#phase-2-technical-decisions-2026-11-23).

Module 1 done (branch `chore/repo-skeleton`):
- pnpm workspace (`apps/*`, `packages/*`), Astro 7 placeholder site that builds, TypeScript 6.0, ESLint 10, Prettier, commitlint, lefthook hooks, `CHANGELOG.md`, minimal CI workflow.
- Found while installing: Astro 7 needs Node >= 22.23.4 (system Node is 22.13) and `typescript-eslint` does not support TypeScript 7. Solved by pinning Node 24 through pnpm `devEngines.runtime` (downloaded automatically, system Node untouched) and TypeScript 6.0.
- Checked: `pnpm lint`, `format:check`, `check`, `build` pass; the commit-msg hook rejects bad messages and scopes; the pre-commit hook rejects badly formatted / lint-failing files.
- Docs updated (CLAUDE.md, CONTRIBUTING.md, ROADMAP, DECISIONS). Phase 1 is marked done; "Go is not installed" was stale (Go 1.26 is installed).

### 26. Backend decision
The user asked whether the backend will be written in Go and whether the database will be PostgreSQL, then asked for alternatives to Supabase, and chose the paid option: **Go API + managed PostgreSQL, paid hosting allowed**.

Done: recorded in [DECISIONS.md](DECISIONS.md) (Technical architecture); the open question was narrowed to the details (sign-in method, auth approach, Postgres and API host, budget), to be compared with live prices when Phase 6 starts; [ROADMAP.md](ROADMAP.md) Phase 6 updated. Phases 2–5 are unaffected (static site).

### 27. Phase 2, module 2 (part 1): content model, theme package, /go/
The user asked to continue with module 2, step by step: content, then theme, then the `/go/` page.

Done (branch `feat/site-content-theme`, built on module 1):
- Astro `glob`/`file` loaders read `content/go/` from outside the Astro root (the planned spike worked). `sections.yaml` + `meta.yaml` for all 84 topics (generated once from `design/shared/data.js`); `hello-world` is `ready`, the rest `planned`. Levels are provisional.
- `packages/theme`: styles split into tokens / base / platform; `Layout`, `Header`, `Footer`, `Icon`; vanilla TypeScript shell (theme, palette picker, menus, toast, Ctrl+K search that ignores Azerbaijani diacritics, drawer, spy). The demo progress (8 topics pre-learned) was dropped; progress starts empty. `goaz:*` storage keys are kept.
- `/go/`: statically rendered hero, section cards, tracks and roadmap views; progress painted from `localStorage`.
- Found: the `file()` loader does not keep the yaml order, so sections carry an explicit `order`.
- Checked in headless Chrome over DevTools (progress, views, filter, search, no JS errors). Mobile not verified (headless minimum width).
- Left out on purpose: demo player and the "Niyə bu sayt" bento (they promise features that do not exist yet); "Go 1.27" badge (unverified claim).
- Tooling note: `astro preview` must be stopped with `astro preview stop`; stopping the wrapper does not stop the server.
