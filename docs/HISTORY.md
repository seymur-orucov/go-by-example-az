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

### 28. Lesson content format
Before building the lesson page, the content format was agreed with the user (recorded in [DECISIONS.md](DECISIONS.md#lesson-content-format-2026-11-24)): `//@step` markers in `main.go`, text in `lesson.az.md`, per-step data in `steps.yaml`, a required quiz of 5–10 questions in `quiz.az.yaml` (the user's rule), and `output.txt` checked in CI.

Done: lesson loader and validator (`apps/site/src/lib/lesson.ts`), `pnpm content:check` (also in CI), `hello-world` and `slices` rewritten in the new format.

### 29. Phase 2, module 2 (part 2): lesson page /go/<slug>/
The user asked to continue with the lesson page: Shiki, sidebar, steps, two-way highlighting, visual and quiz.

Done (branch `feat/site-content-theme`):
- `/go/<slug>/` for all 84 topics. Ready lessons: intro, steps with Markdown text (a blockquote becomes a note box), the full-height code window, per-step output, memory visual (`Vis`, `kind: slice`), outro, all quiz questions with a first-try score, pager. Planned topics get a short "Hazırlanır" page instead of a 404 (the `/go/` page and the sidebar link to every topic).
- Shiki tokenizes Go at build time; TextMate scopes are mapped to the existing `tok-*` classes, so the palettes and light/dark theme keep working without a Shiki theme.
- Two-way highlighting as in D: hover/click a step → code lines, hover/click a code line → step; scroll picks the step in the middle; `←`/`→` move between steps, `Shift ←/→` between lessons; ▶ plays the steps.
- View modes (sidebar `[`, width `F`, Zen `Z`/`Esc`) ported from `d.js` to `packages/theme` (`view-modes.ts`, `ViewMenu`), applied before first paint.
- Sidebar: all sections, collapsible, progress from `localStorage`; "Öyrəndim" updates it.
- Honest labels: the run button is "Tam çıxış" and shows the recorded `output.txt`; "Redaktə" and the Playground link are left out until module 3 (CodeMirror, `/api/run`).
- Checked in headless Chrome: steps, arrows, hover both ways, full output, quiz, learned, Zen, sidebar toggle, no JS errors; 390px without horizontal scroll. Not yet done: the explanation ↔ code arrow.

### 30. Quiz as a slider
The user asked for the "Özünü yoxla" quiz to be a slider instead of a list of all questions.

Done (branch `feat/site-content-theme`; recorded in [DECISIONS.md](DECISIONS.md#design)):
- One question at a time; "‹ Əvvəlki" / "Növbəti ›" and `←`/`→` while focus is inside the quiz (they do not move lesson steps or switch lessons there); clickable progress dots: green = right on the first try, amber = right after a retry; the "Növbəti" button is highlighted once the question is answered.
- After the last question, a result slide: a ring with the first-try score, a short verdict, "Yenidən başla".
- The viewport follows the height of the visible slide; hidden slides are `inert`; the slide and height transitions are switched off under `prefers-reduced-motion` by the global rule.
- Quiz logic moved from `lesson.ts` to its own `scripts/quiz.ts`.
- Checked in headless Chrome at 1440px and 390px: navigation, dots, arrows, score, no JS errors.

### 31. Lesson sources for future technologies; pilot content (part 1)
The user agreed to start the pilot content with 2–3 lessons for review, in its own module PR, and asked where content and roadmaps for a future technology (e.g. TypeScript) would come from.

Answer given: the roadmap follows the existing decision (topics and order from a merge of roadmap.sh and itbooster.ru; their texts only with the author's consent). For lesson text there is no openly licensed "by example" source like Go by Example, so the default is to write our own examples and explanations, using official docs only to check facts. The TypeScript Handbook's license is **not verified yet**; it is to be read and recorded in DECISIONS.md when that module starts. The lesson format carries over (`main.ts`, same markers); the loader needs the file name, Shiki language and run command per technology.

Done (branch `feat/pilot-content`):
- `values`, `variables`, `constants` written in the lesson format and marked `ready`: code checked with `gofmt`, `go vet`, `go run` (Go 1.26); `output.txt` is the real output; every quiz answer verified by compiling or running the snippet.
- Found: gofmt rewrites a marker above a top-level declaration to `// @step`; the loader accepts both spellings. A multi-line `out:` no longer leaves an empty line in the terminal.
- Checked in headless Chrome: steps, highlighted lines and output for `values` and `constants`.

### 32. Original content; write-lesson skill
The user decided that lessons must be original (own examples and text; topic order and approach may follow Go by Example), asked how best to write original content with AI and where the roadmap comes from, and added rules: programming terms (slice, receiver, interface, struct, …) are not translated; explanations are short but high quality; real-life examples are welcome.

Answers given: Claude Code with a project skill (it sees the format, runs Go, verifies quiz answers, builds and checks the page), the user reviewing tone; official Go docs only for facts; a glossary for consistent terms. Roadmap: our own, built by comparing Go by Example's topic order, roadmap.sh and itbooster.ru (topic lists and order only), plus our own gaps; node texts written by us.

Done (branch `feat/pilot-content`; recorded in [DECISIONS.md](DECISIONS.md#original-content-2026-11-24)):
- `source: original | adapted` in `meta.yaml`, required for ready lessons by `pnpm content:check`. The footer keeps the Go by Example CC BY 3.0 attribution while any ready lesson is adapted, then switches to an "İlham mənbəyi" credit line. `LICENSE-CONTENT` and README explain the split; the final content license (CC BY 3.0 or 4.0) is an open question.
- Skill `.claude/skills/write-lesson/SKILL.md`: brief, originality self-check against the best-known examples, real-life context, terms in English, style, file rules, verification (`gofmt`, `go vet`, `go run`, every quiz answer compiled, `content:check`, build).
- Rewritten with the skill as original lessons: `constants` (a Baku taxi fare: package-level constant, `const ( … )` block, untyped constants, constant expressions) and `slices` (a market cart: nil slice, `append`, index, `make`, slice of a slice sharing elements). All outputs and quiz answers verified with Go 1.26.
- Found and fixed: memory-visual cells had a fixed width, so real words ("çörək") overflowed; cells now grow with their text. "massiv" removed from the empty-slice label and the slices subtitle (term rule).
- Still adapted (to be rewritten): `hello-world`, `values`, `variables`.

### 33. CC BY 4.0, no Go by Example credit, dollars, longer intros
The user decided: content moves to CC BY 4.0; the site will not mention Go by Example (no courtesy credit); money in examples is in US dollars, not manat, because the content will be translated; some topics need more than one sentence of explanation — the `constants` intro was too short.

Done (branch `feat/pilot-content`; recorded in [DECISIONS.md](DECISIONS.md#original-content-2026-11-24)):
- `LICENSE-CONTENT`, README, CONTRIBUTING: CC BY 4.0; the Go by Example CC BY 3.0 attribution now covers only `source: adapted` lessons (and the prototype copies).
- Footer: the "İlham mənbəyi" line is removed; the required attribution stays while `hello-world`, `values`, `variables` are adapted, then disappears on its own; a CC BY 4.0 content line is always shown.
- `constants`: prices in USD (output regenerated with Go 1.26); the intro is two short paragraphs (constant vs variable, compile time explained, why a named constant helps).
- Skill `write-lesson`: money in USD; length follows the topic (intro 2–4 sentences, harder steps up to 4–5).

### 34. `hello-world`, `values`, `variables` rewritten as original lessons
The user agreed to rewrite the last three adapted lessons so the site no longer needs the Go by Example attribution.

Done (branch `feat/pilot-content`), with the `write-lesson` skill:
- `hello-world` (a café sign: `package`, `import`, `main`, `Print` vs `Println`), `values` (a café bill: strings, integer vs float division, bool), `variables` (a student's exam results: `var`, explicit type, zero value, `:=`). All have `source: original`, dollars instead of local currency, a 2-paragraph intro and 7 quiz questions each (4 steps).
- Verified with Go 1.26: `gofmt`, `go vet`, `go run` (`output.txt`); every quiz snippet compiled or run in a scratch directory (21 snippets, compiler messages checked for the "does not compile" questions); `pnpm content:check`, lint, format, check, build; step line ranges in the built pages.
- No ready lesson is `adapted` now, so the footer drops the Go by Example attribution by itself (checked in the build: no mention of Go by Example in any lesson page). The README, `LICENSE-CONTENT` and the design prototype still mention it.
- Awaiting the user's review of tone and clarity.

### 35. New source: yeahub.ru; where the design gaps are handled
The user asked where the remaining design gaps (home page and other parts are mostly Go-oriented) will be handled, asked to add https://yeahub.ru/ to the sources, and said that Claude decides what to take from which section in the future.

Done: yeahub.ru added to [REFERENCES.md](REFERENCES.md) (interview source and design reference) and [DECISIONS.md](DECISIONS.md) (open question) with the license status: no reuse license found, "open" only means source/design can be viewed, public offer not read yet. [ROADMAP.md](ROADMAP.md) Phase 6 got three items: a design pass for the non-Go parts before each platform section, a per-section source review (Claude decides), and reading yeahub.ru's offer. Phase 2 module 2 still only finishes `/`, `/go/roadmap/` and `/roadmaps/backend/` from the D reference.

### 36. "Əsaslar" section completed: `for`, `if-else`, `switch`
The user asked to complete the "Əsaslar" module; three lessons were still `planned`.

Done (branch `feat/pilot-content`), with the `write-lesson` skill:
- `for` (monthly savings in USD: three-part loop, condition-only loop, `for { }` with `break`, `continue`; 4 steps, 8 quiz questions), `if-else` (weather: `&&`/`||`, `else`, `else if` chain, `if` with a short declaration; 4 steps, 8 questions), `switch` (a library: value `switch` with `default`, several values in one `case`, `switch` without an expression; `fallthrough` as a note; 3 steps, 7 questions). All `source: original`, `status: ready`.
- Order note: `for` needs `if` for `break`/`continue` and `if-else` comes next in the course, so the `for` lesson explains `if` in one clause and points to the next lesson.
- Verified with Go 1.26: `gofmt`, `go vet`, `go run` (`output.txt`); all 23 quiz answers checked by running the snippets or reading the compiler message (parenthesised `for`, out-of-scope `if` variable, `else` on a new line, non-bool condition, duplicate `case`); `pnpm content:check` (8/8 ready), format, lint, check, build (86 pages).
- Awaiting the user's review of tone and clarity.

### 37. "Yadda saxla" summary card added to every lesson
The user noticed that the design prototype has a summary section at the end of each topic, left of the quiz, and the real lesson pages did not. They asked for a summary-type module (name may differ) holding the page's key nuances and best practices.

Done (branch `feat/pilot-content`):
- Only the CSS (`.after` two-column grid, `.takeaways`) had been ported from the prototype; the component and the content were missing. New content file `takeaways.az.yaml` (`rules` 3–6, `practices` 1–4, inline Markdown), validated by `lesson.ts` and required for ready lessons; new `Takeaways.astro` ("Yadda saxla" label, "Xülasə" heading, "Əsas məqamlar" and "Yaxşı təcrübə" groups, practices with a green check) rendered left of the quiz; one column on narrow screens.
- Written for all 8 ready lessons (hello-world, values, variables, constants, for, if-else, switch, slices) from each lesson's own text and quiz.
- `write-lesson` skill and DECISIONS ("Lesson content format") updated: every new lesson ships a `takeaways.az.yaml`.
- Verified: `pnpm content:check` (8/8), format, lint, check, build; desktop screenshot of `/go/if-else/` in headless Chrome (summary left, quiz right). Only this prototype-vs-site gap was checked; the rest of the lesson page was not re-audited against `design/d/example.html`.
- Awaiting the user's review of the wording.

### 38. "Kolleksiyalar" section completed: `arrays`, `maps`, `range`, `strings-and-runes`
The user asked to continue with content and prepare the "Kolleksiyalar" module; `slices` was already ready, four lessons were `planned`.

Done (branch `feat/pilot-content`), with the `write-lesson` skill:
- `arrays` (a week of weather: zero value, literal and index, loop to find the warmest day, copy on assignment and `==`; 4 steps, 8 questions, slice-kind memory visual reused for the array), `maps` (a small shop's stock: literal, add/update, missing key and "comma ok", `delete`, `make` + `m[k]++` counter, `nil` map note; 5 steps, 8 questions), `range` (a metro line: index + value, `_`, map iteration with order-independent work, `range` over an integer; 4 steps, 8 questions), `strings-and-runes` (Azerbaijani city names: bytes vs letters, index gives a byte, `[]rune`, `range` jumping over 2-byte letters, rune literal; 5 steps, 8 questions). All `source: original`, `status: ready`, with `takeaways.az.yaml`.
- Map iteration order is random, so no lesson prints inside a map `range` loop (outputs stay deterministic for the future CI comparison).
- Term rule: "Massivlər" removed from the section description and "massiv" from the `arrays` subtitle. The `slices` intro now contrasts slices with arrays, since `arrays` comes first.
- Verified with Go 1.26: `gofmt`, `go vet`, `go run` (`output.txt`); all 32 quiz answers checked by running the snippets or reading the compiler message (index out of bounds, `[3]int` vs `[5]int`, wrong key type, unused range variable, assigning to a string byte, `'Ş'` overflowing `byte`); `pnpm content:check` (12/12 ready), format, lint, check, build (86 pages); screenshots of `/go/arrays/` and `/go/strings-and-runes/` in headless Chrome.
- No `map` memory visual yet (only `kind: slice` exists); still listed under Phase 3 "Step visuals".
- Awaiting the user's review of tone and clarity.

### 39. Language-neutral lesson code
The user noticed that Azerbaijani words in `main.go` (`Lənkəran`, `süd`, `Çay evi`) would clash with translated lesson texts (for example "the word has two `ə`") and that the shared `output.txt` would show Azerbaijani output to other readers. They proposed that all words and sentences in lesson code be English.

Done (branch `feat/pilot-content`):
- Rule recorded in [DECISIONS.md](DECISIONS.md) and the `write-lesson` skill: `main.go` and `output.txt` are fully English (strings, output, comments, identifiers); the real-life contexts stay, in English. Azerbaijani lives only in `*.az.*` files.
- All 12 ready lessons rewritten accordingly (`main.go`, `output.txt`, `steps.yaml`, quoted strings in `lesson.az.md`, quiz snippets and options, takeaways). Examples: the tea house, Lisbon taxi, Central/Harbor/Old Town metro stops, milk/flour/honey stock.
- `strings-and-runes` keeps the same five steps but uses language-neutral multi-byte words (`Zürich`, `Frühstück`); the intro says in one sentence that Azerbaijani `ə`, `ş`, `ç`, `ğ`, `ı`, `ö`, `ü` are 2 bytes too.
- Verified with Go 1.26: `gofmt`, `go vet`, `go run` equals `output.txt` for all 12; `pnpm content:check` (12/12), format, lint, check, build (86 pages). Quiz answers for `strings-and-runes` were recomputed by running the snippets; in the other lessons only string literals changed, and the `range` snippet semantics were re-checked by hand.
- Awaiting the user's review.

### 41. Design v2: platform redesign on top of D
The user asked to redesign the home page and the other pages on top of D as a **new version**, sent five references (glass login cards with an icon row, a light-ribbon brand backdrop, 3D glass feature cards, a glowing prompt box, a workflow node graph), pointed to itbooster.ru and roadmap.sh, and proposed the names `w3hub.dev` / `beststack.dev`. Home page wishes: an intro with an interesting animation or video effect, the technologies and directions shown compactly but visually, and the platform's advantages over the alternatives.

Done (branch `feat/design-v2`, `design/v2/`, D untouched; recorded in [DECISIONS.md](DECISIONS.md#design)):
- Shared `v2.css` / `v2.js`: tokens (D's blue → violet + a warm accent, 4 palettes, dark/light/system), glass cards with corner dots and a pointer light, rotating glowing border, hairline grid with crosshairs, `kicker` code labels, scroll reveal, count-up, tilt, memory cells, Ctrl+K search over technologies, directions, sections and Go topics, a "Görünüş" menu (theme + palette), a technology mega menu, a brand switch (`w3hub.dev` default, `beststack.dev`, also `?brand=`), and a WebGL aurora (three ribbon bundles in the palette colours; paused off-screen, one still frame under `prefers-reduced-motion`, CSS fallback without WebGL).
- Home (`index.html`): aurora hero with a typing "Nə öyrənmək istəyirsən?" box that opens the search, stats, and three tilted glass preview cards (Backend roadmap, an animated slices lesson, a quiz); a stack map (4 directions ↔ 13 technologies wired with flowing SVG lines, the direction's path below); "Bir mövzu. Beş tərəf." (five facet cards wired into one node card with theory, practice, visual, test and interview content); a rail of the 8 platform sections in rollout order with status; "Niyə məhz burada?" with four 3D glass SVG illustrations and a comparison table against generic alternatives (map sites, video courses, official docs; planned features marked "tezliklə"); a resume CTA with Go progress.
- `go.html`: Go-tinted aurora hero, progress per section, directions that include Go, sections / all-topics views, five-facets strip. `roadmap.html`: Go roadmap as a spine graph (9 section hubs, 84 topic pills, statuses, filter) and the Backend direction preview, sticky 5-facet node panel (bottom sheet on narrow screens), "Öyrəndim", deep links. `lesson.html`: the real `slices` lesson ported (markers → line ranges), glass step cards, two-way highlighting with a curved step → code link (a first try at the arrow idea), memory visual, step output, view modes and Zen, takeaways + quiz slider, a "Hazırlanır" state for planned topics.
- Checked in headless Chrome over CDP: all pages at 1440px dark and light and at 390px (no horizontal scroll), no JS errors. Web fonts could not load in the headless run (no network), so text was checked with fallback fonts.
- Known gaps: `design/shared/data.js` still says "Massivlər" in the Kolleksiyalar description (term rule; the shared file was not touched); the roadmap opens on the next topic, which may have no sample facet content.
- Awaiting the user's review.

### 42. Design v3: home page on top of v2
The user asked for a **v3 on the basis of v2 and the earlier references**: in addition to v2's notes, the main goals are "modern but elegant, dynamic but light, a grand intro animation, and headlines and copy that read as if a real copywriter wrote them".

Done (branch `feat/design-v3`, `design/v3/`; recorded in [DECISIONS.md](DECISIONS.md#design), [design/README.md](../design/README.md)):
- **Structure:** v3 reuses v2's shell (`../v2/v2.css`, `../v2/v2.js`) and adds `index.html`, `v3.css`, `v3.js`. `v2.js` got one small hook (`window.W3_PAGES`) so v3 can link v2's Go, roadmap and lesson pages; v2 itself is unchanged otherwise. A **v2 | v3** switch sits bottom-right on the v3 page.
- **Copy (Azerbaijani, terms in English):** hero "Hello, World-dən ilk iş gününə qədər."; sections "Seç. Öyrən. Yoxla. Təkrar.", "Bir dil seç. Ya da bütöv bir peşə.", "Bir mövzu. Beş tərəf. Sıfır tab dəyişmə.", "Xəritə yolu göstərir. Kurs dərsi verir. Sənəd faktı. Burada üçü bir yerdədir.", "Platformanın da öz xəritəsi var.", CTA "Harada qaldığını unut. Platforma xatırlayır."; the chapters and cards are written in the same voice (short sentences, one idea each).
- **Intro:** the headline is drawn as a path — eight glass nodes burst from the centre into place, the path draws itself, the words rise from under a mask (blur → sharp), the aurora blooms, a traveller walks the learned part and settles on the current node (Goroutines). Quicker on a repeat visit in the same session; the final frame at once under `prefers-reduced-motion`.
- **Sections:** technology marquee band; a scroll story with a sticky frame switching map → lesson → quiz (ghost cursor plays the quiz; two-way step ↔ code highlighting in the lesson frame; on narrow screens each frame sits under its chapter); directions with a FLIP-animated technology chain and a technology cloud; five live facet cards; four editorial claims with the 3D glass art + the comparison table; the platform timeline in rollout order; resume CTA. Reading-progress line, hero fade on scroll, pointer parallax, magnetic buttons.
- Checked in headless Chrome over CDP at 1440px (dark, light, reduced motion) and 390px: no JS errors, no horizontal scroll. Fixed on the way: an early flash of the headline words (the hidden state must not transition), code clipped in the facet cards, a faint hero note, the gap after the story.
- Awaiting the user's review; the other pages (Go, roadmap, lesson) are still v2's.

---

## 2026-11-26 — Design v3, second try

### 43. Feedback: v3 rejected; a new v3 with a different idea
The user's feedback on entry 42: **"Bəyənmədim. V2 daha yaxşıdır. V3-ü sil. Yenidən fərqli ideya ilə v3 üçün əsas səhifəni yarat. Animasiyalar filan fərqli olsun V2-dən fərqli amma daha yaxşı olmalıdır."** So: the first v3 is deleted, v2 remains the favourite, and a new v3 home page must have a different idea and animations that differ from v2 and are better.

Done (branch `feat/design-v3`, `design/v3/`; [DECISIONS.md](DECISIONS.md#design), [design/README.md](../design/README.md), [DESIGN-V2.md](DESIGN-V2.md)):
- The first v3 ("Aurora editorial") was deleted. Lesson recorded: reusing v2's look (aurora, glass) with new sections reads as a weaker v2.
- **New v3 — "Order from chaos".** Idea and headline: "Öyrənmək çətin deyil. Azmaq asandır." The page acts it out: chaos first, order after.
  - **Hero:** a canvas 2D particle field (~3200 points; 1500 on phones). Dust drifts while the headline rises, then snaps into a roadmap graph with a light ring; the sculpture morphs through the five sides of a topic — map, `{ }`, a rotating 3D cube, a check, a speech bubble — with tabs and a caption. Points leave light trails (frames are faded, not cleared), flee the pointer and dissolve as the hero scrolls away.
  - **01** "Əvvəl: 47 açıq tab. Sonra: bir xəritə." — a before/after slider (drag, click, arrow keys; sweeps once on entering the view).
  - **02** a manifesto paragraph whose words light up with the scroll ("Biz video çəkmirik. Slayd oxumuruq. …").
  - **03** "Bir mövzu. Beş qat." — a pinned 3D exploded view of a lesson: five plates separate with the scroll, each lights up in turn.
  - **04** "Bütün stack sənin ətrafında fırlanır." — a technology orbit; a chosen direction numbers its technologies in learning order.
  - **05** "Hazır olanlar. Yolda olanlar." — the platform sections as a large typographic list with a cursor-following preview.
  - **Finale** "Növbəti addım bir klik uzaqdadır." with a running outlined line and the resume card. On desktop the header is a floating capsule.
- Not carried over from v2 on purpose: the aurora, the ask box, glass wires, the comparison table (the before/after section and the manifesto make the same point).
- Checked in headless Chrome over CDP at 1440px (dark, light, reduced motion) and 390px: no JS errors, no horizontal scroll; all five shapes checked. Fixed on the way: the particle simulation was frame-rate dependent (now time-based sub-steps); a heading that clips itself never reports as intersecting, so the reveal mask moved to an inner span.
- **Working-tree note:** a parallel session switched the shared checkout to `feat/content-functions` while the first v3 was being committed, so those two commits landed on that branch. They were moved to `feat/design-v3` and the content branch was returned to its base (the content files were not touched). The design work now lives in a separate git worktree (`../go-by-example-design-v3`) so the two sessions do not collide.
- Awaiting the user's review; the other pages (Go, roadmap, lesson) are still v2's.

### 44. Feedback on v3; design v4 "Metro"
The user's feedback on entry 43: the parts of v3 they did not like are **"Bir mövzu. Beş qat"** (the pinned 3D exploded view) and the **"Yoxla · Təkrar · Seç" slide** (the running "Seç · Öyrən · Yoxla · Təkrar" line in the finale). Then: **"V4 hazırla. Tam fərqli."** Nothing was said about the other v3 sections.

Done (branch `feat/design-v3`, worktree `../go-by-example-design-v3`, `design/v4/`; [DECISIONS.md](DECISIONS.md#design), [design/README.md](../design/README.md), [DESIGN-V2.md](DESIGN-V2.md)):
- **v4 — "Metro".** Idea and headline: "Hər peşə bir xətdir. Hər texnologiya bir stansiya." The platform is a transit map: directions are lines, technologies are stations, a lesson is a stop.
- **Own look, not a restyle:** `v4.css` does not load `v2.css`. Flat wayfinding signage (thick lines, sign plates, numbered line bullets, paper tickets, an always-dark board) instead of glass, glow, aurora or particles; the light theme is a warm printed map. `v2.js` is loaded only for the prototype data, the theme/palette switch and the search; the pieces it generates (look menu, search palette, toast) are restyled.
- **Hero:** an octolinear SVG map. Four lines start at Git, share a trunk (Git → Linux → HTTP) and branch; interchanges are capsules; Rust is a dashed planned extension. The lines are drawn from Git on load, stations open as a line reaches them, then one train per line runs stop to stop. A line chooser (and hovering a line) highlights one line and lists its stops in order; stations show a sign. The headline shares the canvas with the map.
- **Sections:** "Go xətti açıqdır." (strip map of the nine sections + a timetable of lessons); "Növbəti stansiya: Slices." (four steps of the real lesson with a sliding highlight band, memory cells and output, plus a turnstile that opens on the right answer to a real quiz question); "Bilet lazım deyil." (four printed and punched tickets: free, no sign-up, in Azerbaijani, verified code); "Növbəti açılışlar tabloda." (the eight platform sections on a split-flap board with a clock); "Qatarın platformadadır." (a boarding pass from the last learned lesson to the next). The header rule is a page line with a train that follows the scroll.
- Left out because of the feedback: any pinned scroll scene, any marquee, and a "one topic, five …" section — the lesson is shown as a working demo instead.
- The stop order of each direction on the map is v4's own prototype data (every line starts at Git); `v2.js` supplies only which technologies belong to a direction.
- Checked in headless Chrome over CDP: 1440px dark and light, 1000px, 390px, reduced motion; the intro at several moments; a selected line, a station sign, the quiz (wrong then right answer), the search palette, the look menu and the Okean palette. No JS errors, no horizontal scroll. Fixed on the way: stations appeared before the lines reached them (the hidden start state was set after a forced style pass, so it was transitioned into); board column heads did not line up with the rows; English terms on the board got a dotted İ from the Azerbaijani upper-casing.
- Not checked: a real phone or a real pointer (hover and clicks were triggered with synthetic events); the İndiqo and Qrafit palettes on this page.
- Awaiting the user's review; the other pages (Go, roadmap, lesson) are still v2's.

### 45. Feedback on v4; design v5 = v2 + v3
The user's feedback on entry 44: **"Maraqlıdır amma bəyənmədim. v2 və v3 qarışığı ilə yeni bir versiya yarat. Hər ikisində daha yaxşı olan konseptləri istifadə et. v3-ün introsu çox maraqlı idi. Maraqlı başqa ideyalar da əlavə edə bilərsən."** So v4 "Metro" is not the direction (kept in the repo for comparison), v3's intro is explicitly liked, and the next version is a merge.

Done (branch `feat/design-v3`, worktree `../go-by-example-design-v3`, `design/v5/`; [DECISIONS.md](DECISIONS.md#design), [design/README.md](../design/README.md), [DESIGN-V2.md](DESIGN-V2.md)):
- **Hero = v3's intro inside v2's world.** The particle field, its five shapes with tabs, and the headline "Öyrənmək çətin deyil. Azmaq asandır." come from v3; the glowing ask box with suggestion chips comes from v2 and replaces v3's two buttons. v2's aurora and hairline grid sit behind the field.
- **From v3 after the hero:** the before/after slider and the scroll-lit manifesto, now with v2's section heads (`kicker`, gradient headings). **From v2:** the stack map, "Bir mövzu. Beş tərəf.", the platform rail, "Niyə məhz burada?" with the comparison table, the resume card.
- **Left out:** v3's pinned "Bir mövzu. Beş qat." and running line (disliked), its orbit, typographic list and capsule header (v2's stack map, rail and header do the same jobs); v2's three showcase cards (the facet demo shows the same lesson).
- **New ideas:** the sky stays dark during the chaos and the aurora and grid fade in when the particles lock; text typed into the ask box (or a hovered chip) is drawn by the particles; a click on an empty part of the hero scatters the field; "Bu tərəfi nümunədə gör" under the tabs opens the matching facet in the demo.
- **How it is built:** `v5.css` and `v5.js` were assembled once from `v3.css`/`v3.js` (hero, slider, manifesto) and `v2/home.js` (sections), then edited; `v2/home.css` is loaded as is. v2 and v3 files were not changed, except for the v5 link in the v3 and v4 switches.
- Checked in headless Chrome over CDP: 1440px dark and light, 390px, reduced motion; the intro at three moments, typed text, the click scatter, the tab → facet link, the whole page after scrolling. No JS errors, no horizontal scroll. Fixed on the way: the dots of "Ö" in the headline were clipped by the line mask.
- Not checked: a real phone or pointer (events were synthetic), frame rate with the aurora and the particle field running together, the other palettes.
- Awaiting the user's review.

### 46. Feedback on v5
The user: **"Biraz qarışıq olub."** — v5 mixes too much. Recorded together with the next request (entry 47).

### 47. Design v6 "Liquid glass"
The user: **"V6 yarat. Introda maraqlı interaktiv animasiya. Əsas səhifə həm çox informativ, həm maraqlı, həm də glass design üslubunda olmalıdır."**

Done (branch `feat/design-v3`, worktree `../go-by-example-design-v3`, `design/v6/`; [DECISIONS.md](DECISIONS.md#design), [design/README.md](../design/README.md), [DESIGN-V2.md](DESIGN-V2.md)):
- **One idea, one look.** Headline "Proqramlaşdırmanı bir yolda öyrən."; only v2's shell is loaded (glass, tokens, header, search) — nothing from v3–v5 and not v2's `home.css`, so the page does not mix languages.
- **Hero — WebGL liquid glass.** Glass drops refract the aurora ribbons and a hairline grid (rim colour, highlight, contact shadow; a clear coloured glass in the light theme). Intro: nine drops labelled with scattered sources (video, məqalə, forum, pdf, kurs, sənəd, 47 tab, qeyd, podkast) flow together into one form with orbiting drops. Then: a small drop follows the mouse and melts into the form, any drop can be grabbed and pulled out, a click on an empty spot splashes it; it always flows back. A glass card on the form shows Go progress and the next lesson; the v2 ask box and four stat tiles sit under the headline.
- **Informative glass sections (prototype data):** roadmap explorer — Go's 9 sections in a serpentine with a wire, "buradasan" marker and per-section progress; the chosen section lists its lessons with keçilib / hazırdır / yazılır and links; a Backend view shows its 7 technologies in order. Lesson demo — real `slices` steps with a sliding code highlight, memory cells, output, a "Hər dərsdə" list (izah, kod, vizual, test, "Yadda saxla", müsahibə tezliklə) and one real quiz question. Directions + 13 technologies with numbered order. The 8 platform sections with a rollout bar. "Niyə məhz burada?" + comparison table. FAQ (free, no account, language, verified code, where to start, what comes after Go). Resume card.
- **Performance, measured on this machine's Intel HD GPU in Chrome:** the first build ran at ~21 fps and, on a fresh profile, froze the page for ~25 s while Chrome/ANGLE compiled the shader (the compile blocked on `LINK_STATUS`). Fixes: the shader samples the backdrop once per pixel (it had called it up to four times), the program compiles in the background (`KHR_parallel_shader_compile`; the canvas fades in when ready, about 1.7 s after navigation on a fresh profile, and the merge waits for it), the render scale adapts to the frame rate, the hero glass panels use a tinted fill instead of a live `backdrop-filter`, the fixed version switch has no blur, and the ask box's rotating ring runs on the compositor. Result: ~60 fps at 1440px.
- Checked in headless Chrome over CDP: 1440px dark and light, 1280/1180/1000/901px headline fit, 390px, reduced motion; the intro at several moments, the splash, the Backend view, the quiz, the whole page. No JS errors, no horizontal scroll. Fixed on the way: the headline was clipped at the first size; the roadmap wire showed through the node text; section gaps were too tall; HTML/CSS sat alone on a row; scattered drops were too big on phones; the light-theme glass looked milky.
- Not checked: a real phone or a real pointer (events were synthetic; drag on touch competes with page scroll), the other palettes, other GPUs.
- Awaiting the user's review.

### 48. "Funksiyalar" section: `functions`, `multiple-return-values`, `variadic-functions`, `closures`, `recursion`
The user asked where the content work stopped and whether there is a skill for it, then asked to start the "Funksiyalar" section; all five lessons were `planned`.

Done (branch `feat/content-functions`), with the `write-lesson` skill:
- `functions` (a cinema box office: declaration, `return`, shared parameter type, a function without a result calling another one, parameters are copies; 4 steps, 8 questions), `multiple-return-values` (a restaurant bill: split with remainder, `(int, bool)` card payment with `=` vs `:=`, named results with a bare `return`, `_`; 4 steps, 8 questions), `variadic-functions` (a running tracker: `...int`, the parameter is a slice and `nil` with no arguments, a regular parameter before the variadic one, `week...` sharing elements; 4 steps, 7 questions), `closures` (a coffee shop: function literal, capturing a variable not its value, `func(string) bool` parameter, a loyalty card closure with its own state; 4 steps, 6 questions), `recursion` (an office: base case with a lift going down, `headcount` over a `map[string][]string` org chart, printing the chart with indentation; 3 steps, 6 questions). All `source: original`, `status: ready`, with `takeaways.az.yaml`.
- Code layout: function bodies are top-level steps (`// @step`, closed with `//@end` before `main`), and `main` calls them in step order so each step's `out` stays in `output.txt` order. In `closures` the helper functions come after `main` (the text says the order of top-level functions does not matter).
- Originality: the well-known shapes for these topics (`plus`/`plusPlus`, `vals()` returning `3, 7`, `sum(nums ...int)` over `1, 2, 3`, `intSeq`, `adder`, factorial and Fibonacci) are not used.
- Verified with Go 1.26.11 (Go was missing on this machine; a checksum-verified zip from go.dev was used from the session scratch directory): `gofmt`, `go vet`, `go run` (`output.txt`) for all five; all 35 quiz answers checked by running the snippets or reading the compiler message (`missing return`, `(no value) used as value`, `not enough arguments`, `assignment mismatch`, `no new variables on left side of :=`, `not enough return values`, `can only use ... with final parameter`, `too many arguments` for `totalKm(1, week...)`, `undefined: add`, func type mismatch, `fatal error: stack overflow`); `pnpm content:check` (17/17), format, lint.
- Build verified after the user installed Go 1.27.4 and the x64 Visual C++ Redistributable: `pnpm lint`, `format:check`, `check` (0 errors), `content:check` (17/17) and `build` (86 pages) pass; all five lessons still match `output.txt` under Go 1.27.4. Built pages checked in headless Chrome at 1440px (steps, highlighted line ranges, output panel, "Yadda saxla", quiz) and for horizontal overflow at 390px (none, same as `slices`).
- Found while checking: step headings do not render inline code, so `## `...` ilə elan` showed literal backticks; the two new headings were changed to plain text. The existing `range` heading "Lazımsız dəyər: `_`" has the same problem (not touched; either reword it or render inline Markdown in step titles).
- Known weak spot: in `functions`, `multiple-return-values`, `variadic-functions` and `closures` the highlighted step is the function definition, while the calls in `main` sit outside any step (or inside a later step), so the text about a call is not matched by highlighted lines.
- Awaiting the user's review of tone and clarity.

### 49. "Tiplər və strukturlar" section: `pointers`, `structs`, `methods`, `interfaces`, `enums`, `struct-embedding`, `generics`, `range-over-iterators`
The user asked to prepare the next content; the next section in course order was "Tiplər və strukturlar", all eight lessons `planned`.

Done (branch `feat/content-types`, started from `feat/content-functions`, which is not merged yet), with the `write-lesson` skill:
- `pointers` (a car park: `&`/`*`, a copy parameter vs a `*int` parameter, `nil` pointer, `new`; 4 steps, 8 questions), `structs` (parcel delivery: type and keyed literal, zero value and partial literal, copy on assignment and `==`, struct pointer with auto-dereference, slice of structs and the `range` copy pitfall; 5 steps, 8 questions), `methods` (a music playlist: value receiver, pointer receiver, a method on `type Minutes int`; 3 steps, 6 questions), `interfaces` (online-shop shipping: implicit implementation, interface as parameter and in a slice, type switch with comma-ok assertion and `any`; 3 steps, 7 questions), `enums` (washing machine stages: `iota`, `String()` as `fmt.Stringer`, `Next()`; 3 steps, 6 questions), `struct-embedding` (delivery labels: promoted fields and methods, shadowing a method, embedding satisfying an interface; 3 steps, 6 questions), `generics` (smart-home sensors: a `maxFloat` that cannot take `[]int` humidity shows the problem, then `Max[T cmp.Ordered]`, `Count[T comparable]` used with `bool` motion data, generic `Log[T any]` with `var zero T`; 4 steps, 8 questions. Rewritten after the user agreed that the first "hotel survey" version only renamed variables, see entry 51), `range-over-iterators` (a bus timetable: `iter.Seq`, `iter.Seq2`, early `break` and `yield` returning false, `slices.Collect` and `slices.Sorted(maps.Keys(m))`; 4 steps, 7 questions). All `source: original`, `status: ready`, with `takeaways.az.yaml`.
- Code layout: where the lesson is about declarations (methods, interfaces, enums, embedding, generics, iterators) the steps mark the top-level declarations and `main` calls them in step order; `pointers` and `structs` keep the steps in `main`. The weak spot from entry 48 (calls in `main` not highlighted) stays for those lessons.
- Only `fmt.Println`/`fmt.Print` are used in lesson code, since `Printf` comes later in "Mətn və verilənlər". Maps are printed whole (fmt sorts keys) or through sorted keys, so outputs stay deterministic.
- Originality: avoided the well-known shapes (`zeroval`/`zeroptr`, `person`/"Bob", `rect`/`circle` with `area`/`perim`, `geometry`/`measure`, `ServerState`, `base`/`container`, `SlicesIndex`/`List[T]`, `SumIntsOrFloats`, `genFib`, Tour `Vertex`).
- Verified with Go 1.27.4: `gofmt`, `go vet`, `go run` (`output.txt`) for all eight; all 55 quiz answers checked by running snippets or reading the compiler/runtime message (`cannot use price (variable of type int) as *int`, `unknown field Zone`, `too few values in struct literal`, `cannot call pointer method Toggle on Lamp`, `cannot define new methods on non-local type int`, `missing method Name`, `method Tick has pointer receiver`, interface conversion panic, `constant 1 of int type Stage`, `type parameter T cannot use operator >`, `type float64 of y does not match inferred type int`, `possibly missing ~`, `cannot use generic type Shortlist[T any] without instantiation`, `range function continued iteration after function for loop body returned false`); `pnpm content:check` (25/25), format, lint, check (0 errors), build (86 pages); `/go/generics/` and `/go/pointers/` checked in headless Chrome at 1440px.
- Found while checking: Go 1.27.4 accepts a promoted field in a struct literal (`Phone{Level: 50}` with an embedded `Battery`), which Go 1.26 rejects. Since the project targets 1.26 and the behaviour differs between versions, that quiz question and the matching "Yadda saxla" rule were replaced (now: an outer field shadowing an embedded one).
- Awaiting the user's review of tone and clarity.

### 50. "Xətalar" section: `errors`, `custom-errors`, `panic`, `defer`, `recover`
The user asked for the next content again; the next section was "Xətalar", all five lessons `planned`.

Done (branch `feat/content-errors`, started from `feat/content-types`, neither merged yet), with the `write-lesson` skill:
- `errors` (a library: `(int, error)` with `errors.New` and `if err != nil`, sentinel `ErrNotFound`/`ErrOnLoan` compared with `==`, wrapping with `fmt.Errorf` `%w` and `errors.Is`; 3 steps, 8 questions), `custom-errors` (meeting-room booking: `*BookingError` with `Error()`, `Unwrap()` so `errors.Is` finds `ErrBusy`, `errors.As`, the typed-nil-in-interface pitfall as a note and a question; 3 steps, 7 questions), `panic` (theatre seat prices: `panic` for an impossible row, runtime panics and an index check, the crash ending the program; 3 steps, 6 questions), `defer` (a bakery day: basic defer, LIFO order in a loop, arguments evaluated at the `defer` line vs a deferred closure, early return; 4 steps, 7 questions), `recover` (a photo kiosk: defers run while a panic unwinds, `recover` in a deferred literal, converting a runtime panic into an `error` with a named result; 3 steps, 6 questions). All `source: original`, `status: ready`, with `takeaways.az.yaml`.
- Course order puts `panic` before `defer`, so the `panic` lesson does not use `defer`; `recover` builds on both.
- The `panic` lesson ends in a real panic (the point of its last step). Its `output.txt` was generated from a built binary with `GOTRACEBACK=none ... > output.txt 2>&1`: stdout plus the bare `panic: unknown row Z` line, no stack trace with paths and addresses. Exit code is 2. The rule was added to the `write-lesson` skill; the future CI (Phase 4) must expect exit code 2 for this lesson (and for `exit` later).
- Printf verbs are not taught yet, so only `%s`, `%w` and `%v` appear, each explained where it is first used; `fmt.Sprint` is explained in one clause in `custom-errors`.
- Verified with Go 1.27.4: `gofmt`, `go vet`, `go run` (`output.txt`) for all five; all 34 quiz answers checked by running snippets or reading the compiler/runtime message (`assignment mismatch`, `declared and not used: err`, `method Error has pointer receiver`, typed nil interface `!= nil`, `index out of range [3] with length 3`, `index 3 out of bounds [0:3]` for the array, `assignment to entry in nil map`, `expression in defer must be function call`, `recover` outside a deferred call and inside a helper called by a deferred literal both not catching, integer division by zero recovered); `pnpm content:check` (30/30), format, lint, check (0 errors), build (86 pages); `/go/panic/` checked in headless Chrome at 1440px.
- Awaiting the user's review of tone and clarity.

### 51. Real-life contexts: keep them, but they must show why
The user asked whether explaining lessons through real-life examples is a good approach. Claude's view: yes, when the context shows why the concept is needed (`custom-errors`: the caller needs the room and hour; `recover`: the kiosk must keep running), but not when it only renames variables (the first `generics` version spread a "hotel survey" over unrelated helpers) or when it distracts from an abstract mechanism. Quizzes switching to other small contexts is fine on purpose. The user agreed and asked to record this in the skill and rewrite `generics`.

Done:
- `write-lesson` skill, section 2: a "Context check" (the context must show why the concept is needed; for abstract mechanics the first step shows the problem the feature solves and the context stays light) and a note that quizzes may use other contexts on purpose.
- `generics` rewritten on `feat/content-types` (smart-home sensors, 4 steps, 8 questions): `maxFloat` cannot take `[]int` humidity, `Max[T cmp.Ordered]` replaces it, `Count[T comparable]` works for `bool` motion data while `Max` does not, `Log[T any]` with `Latest` returning `var zero T`. Step ids changed (`problem`, `generic`, `comparable`, `type`); the lesson was never published, so the stable-id rule is not broken. Verified with Go 1.27.4 (`gofmt`, `go vet`, `go run`, all 8 quiz answers and the two "does not compile" claims in the text), `content:check`, format, lint, check, build. `feat/content-errors` rebased onto it.
- Awaiting the user's review.
- Follow-up: the user asked to check the other ready lessons against the new rule. All 30 were reviewed (context sentence, steps, code). Most contexts already show the need (taxi tariff constants, `50/4` vs `50.0/4` when splitting a bill, a fixed week of weather for arrays, shop stock for maps, the org chart for recursion, which also says a loop is enough for the lift example). Light, mechanism-first steps (`values` booleans, `defer` argument timing, the `closures` literal step) were kept on purpose. One gap fixed on `feat/content-types`: the `pointers` `nil` step now says why a pointer is used ("not open yet" differs from `0` free spots).

### 52. "Konkurentlik" section: 18 lessons
The user asked to start the next section; "Konkurentlik" had all 18 lessons `planned`.

Done (branch `feat/content-concurrency`, started from `feat/content-errors`, none of the content branches merged yet), with the `write-lesson` skill. Claude wrote a section brief (course order inside the section and what each lesson introduces, determinism rules, the well-known Go by Example / Tour shapes to avoid, one context per lesson) and six subagents wrote the lessons in parallel; Claude then read every lesson and re-ran the checks.
- `goroutines` (airline fares asked one by one vs at the same time, `wg.Go` briefly, `main` not waiting), `channels` (a pizza oven handing pizzas to the counter; unbuffered send waits too), `channel-buffering` (a café order rail of 3 tickets, `len`/`cap`, FIFO), `channel-synchronization` (the till waits for the end-of-day backup; `time.Sleep` is only a guess), `channel-directions` (a juice bottling line), `select` (a dispatcher listening to two courier apps), `timeouts` (an online shop and a slow payment gateway; the late reply still arrives and must be refunded), `non-blocking-channel-operations` (a game badge checking chat each frame, dropping a popup when the queue is full, labelled `break`), `closing-channels` (exam questions, a 0-point warm-up question shows why `ok` is needed), `range-over-channels` (a weather station), `timers` (kitchen timers, `Stop`, `AfterFunc`), `tickers` (a fitness watch, stop channel), `worker-pools` (a car wash with bays), `waitgroups` (a deploy tool checking server health, `wg.Wait()` then `close` in its own goroutine), `rate-limiting` (an SMS gateway, ticker + token bucket), `atomic-counters` (stadium turnstiles; the `count++` race only in text), `mutexes` (three ticket desks selling one train's seats), `stateful-goroutines` (a warehouse stock keeper owning the map, requests with a reply channel; outro compares with the mutex approach). All `source: original`, `status: ready`, with `takeaways.az.yaml`; 3–5 steps and 6–8 questions each.
- Determinism: results are collected and printed from one goroutine; timing is printed only as true/false facts with wide margins. Under load (six agents running at once) margins of ~100 ms failed now and then, so they were widened to ~200 ms or turned into relative comparisons (`goroutines`: concurrent vs sequential). A lower bound equal to the exact sum of `time.Sleep` calls (`>= 360ms` for 6 × 60 ms) failed once in 10 runs on Windows and was relaxed (`> 300ms`). The rule was added to the `write-lesson` skill.
- Spelling unified for the section: `buffer`, `buffer-də`, `buffer-siz`, `buffered` (some lessons had `bufer`); the Turkish "veri" in `stateful-goroutines` and `mutexes` became "verilənlər".
- Verified with Go 1.27.4 (nothing newer than 1.26 used; `wg.Go` is 1.25): `gofmt`, `go vet`, each program run 10+ times against `output.txt` (agents ran 20–120 times, partly with the machine under load); every quiz answer checked by the agents by running snippets or reading the compiler/runtime message (deadlocks, `send on closed channel`, `close of closed channel`, `cannot send to receive-only channel`, `select case must be send or receive`, `sync: negative WaitGroup counter`, `passes lock by value`, `sync: unlock of unlocked mutex`, …); `pnpm content:check` (48/48), format, lint, check (0 errors), build (86 pages).
- Known: several `main.go` files are 40–70 lines (over the ~30-line guide) where a lesson needs a worker plus two runs or a full request/owner pair. Quiz answers are mostly at index 0 across the whole course (212 of 335) and the quiz does not shuffle options, so a reader can guess; to be decided (shuffle at render time or rebalance).
- Awaiting the user's review of tone and clarity.

### 54. "Mətn və verilənlər" section: 16 lessons
The user asked to continue the Go content from where it stopped and to use the content skills in the background; the next section was "Mətn və verilənlər", all 16 lessons `planned`.

Done (branch `feat/content-text`, from `main` after the concurrency PR was merged), with the `write-lesson` skill. Claude wrote a section brief (course order and what each lesson introduces, `Printf` only from `string-formatting` on, determinism rules for time and random values, the well-known Go by Example / Tour shapes to avoid, plain-text step headings, quiz answers spread over all positions), and six background agents wrote the lessons in parallel; Claude then read every lesson and re-ran the checks.
- `sorting` (a marathon: bibs, finish times, the `[Bruno Mila Zoe eva]` byte-order pitfall, `slices.Clone` to keep the podium order, `BinarySearch`), `sorting-by-functions` (flight search buttons: `SortFunc` + `cmp.Compare`, `cmp.Or` for two keys, descending, `SortStableFunc`), `string-functions` (a conference registration form: trim/lower, `Index`/`HasSuffix`, `Split`/`Trim`/`Join`/`Fields`, `Replace`/`Repeat` phone mask, `EqualFold` promo code), `string-formatting` (a paint store order slip: `%v %+v %#v %T`, `%q` showing a trailing space, `%x` vs `%02x` colour code, a `%-10s|%8.2f|` table, `%%`), `text-templates` (clinic appointment reminders: `Must`/`Execute`, `if`/`else`, `range`/`else`, `{{-` trimming), `regular-expressions` (issue-tracker keys like `PAY-142` in commit messages: anchors, `FindAllString`, groups, `ReplaceAllString` to links, `Compile` error for a user filter), `json` (parcel tracking: tags, `omitempty`, unexported field, `MarshalIndent`, unknown/missing fields, type error, `map[string]any` and `float64`), `xml` (an invoice for an accounting service: `attr`, `buyer>name`, `xml.Header`, root element check via `XMLName`), `time` (a train timetable: `time.Date`, `Duration`, `Add`/`Sub`, `AddDate`, `Before`/`Equal`), `epoch` (a car park: Unix seconds/millis, `time.Unix(...).UTC()`, fee per started hour, zero `time.Time` vs epoch), `time-formatting-parsing` (a webinar invitation: the reference layout, predefined layouts, `FixedZone`, `Parse` errors), `random-numbers` (a mental-math worksheet generator: `IntN`, ranges, `Shuffle`/`Perm`, seeded PCG to reprint a sheet), `number-parsing` (a thermostat config file: `Atoi`/`Itoa`, `ParseFloat`/`ParseBool`, bases, `ErrSyntax`, `ErrRange` with `int8`, `errors.As` to `*NumError`), `url-parsing` (a hotel-search staging link: parts, `User`/`Redacted`, `Query()` with repeated keys, `url.Values.Encode`, `QueryEscape`), `sha256-hashes` (an installer checksum on a download page: `Sum256`, one changed letter, streaming `New`/`Write`/`Sum`, verifying), `base64-encoding` (a cinema invite link whose text yields `/`, `+` and `=`: Std, URL and RawURL encodings, decode errors). All `source: original`, `status: ready`, with `takeaways.az.yaml`; 4–5 steps and 8–9 questions each, correct answers spread over positions 0–3.
- Determinism: no `time.Now()`, times built with `time.Date`/`time.Unix(...).UTC()`/`time.FixedZone` (not `LoadLocation`, which depends on the machine's tz data); a parsed time is printed through `.UTC()` because `time.Parse` uses the local zone when the offset matches it (seen on this Baku machine); the global random generator is printed only as properties, exact values come from a seeded PCG.
- Verbatim Go messages in `output.txt` that a later Go release could reword: `json: cannot unmarshal string into Go struct field ...` (v1 `encoding/json`; `GOEXPERIMENT=jsonv2` differs), `parsing time ...: day out of range`, `strconv.Atoi: parsing "twenty": invalid syntax`, `illegal base64 data at input byte N`, `error parsing regexp: missing closing )`, `expected element type <invoice> but have <receipt>`; the seeded `random-numbers` values depend on `IntN`'s algorithm. Regenerate `output.txt` and `steps.yaml` if they change.
- Fixed on the way: raw HTML in Markdown (lesson text, quiz, takeaways) is now escaped in `apps/site/src/lib/markdown.ts`, so Go output in quiz options such as `4 <nil>` is shown instead of becoming an invisible tag (existing quizzes `errors`, `recover` and new ones had this).
- Skill: step headings are plain text; spread quiz answer positions; mention verbatim Go error messages in the hand-off.
- Verified with Go 1.26.5: `gofmt`, `go vet`, each program run several times against `output.txt`; every quiz answer checked by the agents by running snippets or reading the compiler message; `pnpm content:check` (64/64), lint, format, check (0 errors), build (86 pages); `/go/json/` checked in headless Chrome at 1440px. One agent saw intermittent `fork/exec ... Access is denied` on the go-build cache binary (antivirus or file locking on this machine, not the lesson).
- Known: most `main.go` files are 30–53 lines (over the ~30-line guide).
- Awaiting the user's review of tone and clarity.

### 56. "Fayllar və test" and "Sistem və şəbəkə" sections: 20 lessons
The user asked to complete the remaining Go modules: "Fayllar və test" (8 lessons) and "Sistem və şəbəkə" (12 lessons), all `planned`.

Done (branch `feat/content-files-system`, from `main` after the text PR was merged), with the `write-lesson` skill. Four background agents wrote the lessons in parallel from a shared brief (deterministic output identical on Windows and Linux, no files left behind, no network); Claude then re-ran the checks.
- Files: `reading-files` (a bus route file: `ReadFile`, `fs.ErrNotExist`, `Open`/`Read`/`io.EOF`, `bufio.Scanner`), `writing-files` (a café menu, sales report, order log: `WriteFile`, `Create`, `O_APPEND`, `bufio.Writer` + `Flush`), `line-filters` (cleaning a shopping list: `io.Reader`/`io.Writer` filter, run on `strings.NewReader`), `file-paths` (a photo archive: `Join`/`Dir`/`Base`/`Ext`/`Rel`, printed through `ToSlash`), `directories` (photos by year/month: `MkdirAll`, `ReadDir`, `WalkDir`, `RemoveAll`), `temporary-files-and-directories` (a CSV export written under a temp name and renamed into place), `embed-directive` (a café kiosk shipped as one binary; small data files and a `menu/` folder live in the lesson folder), `testing-and-benchmarking` (shipping fee edge cases: `TestXxx`, table tests with `t.Run`, `BenchmarkXxx` with `b.Loop`; driven from `main` with `testing.Benchmark` + `testing.Main` for the site, the text says real tests live in `_test.go` and run with `go test`).
- System: `command-line-arguments` (exam grade averages), `command-line-flags` (a weather tool), `command-line-subcommands` (a todo tool with two `FlagSet`s) — real `os.Args`/`flag.Parse` plus simulated command lines so plain `go run` gives meaningful output; `environment-variables` (café kiosk `KIOSK_*` config), `logging` (an order service: `log`, `slog` text/JSON, timestamps dropped for deterministic output), `http-client` (a weather service on `httptest.NewServer`), `http-server` (a café menu API: `ServeMux` patterns, `PathValue`, `Shutdown`), `context` (a taxi app: timeout, cancel, context tree, HTTP), `spawning-processes` (a shipping-label helper: the program re-runs its own executable so it works on every OS), `signals` (a print queue; `os.Interrupt` is put into the channel by the program to simulate Ctrl+C, since a process cannot send itself `SIGINT` on Windows), `exit` (a nightly backup, exits with code 1 on purpose).
- `execing-processes` is fully written but stays `planned`: `syscall.Exec` only returns `not supported by windows` here and there is no Linux runtime (Docker/WSL not running). Missing: `output.txt` generated on Linux, confirming the hand-typed `steps.yaml` outputs and quiz questions 1, 2, 3 and 5; then `status: ready`.
- Exit codes for the future CI: `exit` exits with 1 (its `output.txt` comes from `go run` with the trailing `exit status 1` removed).
- Verbatim Go messages a later release could reword: `open menu/_draft.txt: file does not exist`, `401 Unauthorized`, `Method Not Allowed`, `404 page not found`, `http: Server closed`, `context deadline exceeded`, `context canceled`, `interrupt`, `invalid value "many" for flag -days: parse error`, `flag provided but not defined: -hours` / `-due`.
- Verified with Go 1.26.5: `gofmt`, `go vet`, every program re-run against `output.txt` (agents ran timing lessons 20+ times), every quiz answer checked by the agents in scratch programs; `pnpm content:check` (83/83), Prettier, build (88 pages). Linux was not run (only `GOOS=linux go vet`/`build` for `execing-processes`). The intermittent `fork/exec ... Access is denied` on go-build binaries showed up again (antivirus on this machine).
- Known: `command-line-subcommands` is ~65 lines and several others are over the ~30-line guide.
- Awaiting the user's review of tone and clarity.

### 57. Content pipeline: `plan-syllabus` skill and the Git syllabus
The user wanted two helpers: one researches a technology and proposes a syllabus, the other writes content after approval, starting with a sample — and asked how to handle technologies without code (animations, explanations). Claude proposed two skills with approval gates (agents only inside them), backward design for the syllabus, and **lesson kinds** (`code`, `terminal`, `state`, `diagram`, `compare`, `concept`) with declarative animations rendered by shared components. The user chose **Git** as the pilot.

Done (branch `feat/content-skills`, in a separate worktree so the uncommitted lessons on `feat/pilot-content` stay untouched):
- `.claude/skills/plan-syllabus/SKILL.md`: input, research (sources and how to fetch them), audience and scope, backward design, lesson kinds, facets, a coverage check against roadmap.sh, the proposal format, `syllabus.yaml` format and validation, hand-off.
- Research: roadmap.sh's page is JS-rendered; its 155 topic names were read from the `developer-roadmap` repo through the GitHub API (no order stored there). Pro Git's table of contents gave order and depth. itbooster.ru is JS-rendered too; probing its private API was blocked and dropped. Notes in `content-private/research/git.md`.
- `content/git/syllabus.yaml`, approved by the user: 7 modules (Əsaslar, Tarixçə, Branch-lar, Remote-lar, Səhvləri düzəltmək, Tarixçəni yenidən yazmaq, Komanda işi və dərinlik), 39 nodes, 267 minutes; kinds: terminal 15, state 15, compare 4, diagram 3, concept 2; 12 nodes with the interview facet. Fork and PR stay in Git; `git switch` / `git restore` are the main syntax (the user's decisions).
- The user asked whether much of roadmap.sh was removed: of 155 topics, 74 Git topics are covered (folded into 39 nodes, listed in each node's `topics`), 65 are GitHub platform topics (out of scope), 7 Git topics were left out (filter-branch, LFS, submodules, attributes, patch, post-checkout and post-update hooks), 9 are section headers. The coverage check was added to the skill so the proposal always lists what was left out.
- Validated with a script: ids unique, every `requires` exists and comes earlier (no cycles), kinds and facets valid.

### 58. Lesson kinds `terminal` and `state`, the `write-content` skill and the Git pilot lessons
The user approved the next step: build the two kinds Git needs most, write the `write-content` skill and two pilot lessons.

Done (branch `feat/content-skills`):
- **Terminal sessions**: a Git lesson's "code" is `session.sh` (`#@step`, `#@hide` for setup, `#@end`, `#@fail`). `pnpm content:run` (`apps/site/scripts/run-session.ts`) runs it with real Git in a sandbox — fresh HOME shown as `/home/sam`, author Sam Lee, a clock that ticks one minute per command, no system or user config, inherited `GIT_*` variables dropped, Git Bash located through `git --exec-path` on Windows — and writes `session.json` + `output.txt`. Running it twice gives byte-identical files (same commit hashes).
- **`areas` visual**: after each step the runner records working directory / staging area / repository from the real repository (`git status --porcelain`, `ls-files`, `ls-tree`); the loader marks what changed since the previous step. `Vis.astro` renders three columns (stacked on phones), states "izlənmir", "dəyişib", "yeni", "yenilənib", the commit card with hash and message.
- **Site**: `lib/syllabus.ts` (schema, graph checks, catalog from the syllabus), `lib/session.ts`, `loadSessionLesson` (fails when `session.json` is stale), bash highlighting, `LessonView.astro` shared by `/go/<slug>/` and `/git/<id>/` (Go pages byte-identical to the previous build after normalizing asset hashes), `/git/` index (modules, 39 topics, ready ones linked), `content:check` covers syllabi and session lessons. Quiz code is highlighted in the lesson's language.
- **Fixes found on the way**: inline `code` used `white-space: nowrap`, which collapsed `M  file` and ` M file` into the same text — now `pre`; the terminal font turned `--short` into a dash ligature — ligatures off in the terminal; empty output lines collapsed to zero height (also in Go programs) — they keep a line now; Shiki's per-line time limit made the build fail now and then on a busy machine (`reading 'startIndex'`: the two tokenizer passes disagree) — the limit is off at build time (all 50 code files tokenize in ~4 s under full CPU load).
- **Pilot lessons** (`source: original`): `three-areas` (`state`: a trip plan, the packing list is ready but the budget is not — why the staging area exists; `git status --short` columns, the index keeps the last commit, `MM`; 5 steps, 7 questions) and `first-commit` (`terminal`: a portfolio site; reading long `git status`, `add`, `add .`, the commit output line by line, `commit -a` skipping a new file; 5 steps, 6 questions). Every quiz answer was checked with real Git in a scratch sandbox (`A  notes.txt`, ` M`, `MM`, `?? contact.html`, the editor opening without `-m`, `No commits yet`). Right answers are spread over the positions.
- **`write-content` skill**: pilot first (one lesson per kind, stop for approval), brief from the syllabus node, writing rules (on top of write-lesson's), the session format, quiz rules, verification (twice-run determinism, quiz sandbox, 1440px + a real 390px check through an iframe because headless Chrome on Windows has a minimum window width), batch phase with subagents, hand-off, and an "Exemplars" list.
- Checked: `pnpm lint`, `format:check`, `check` (0 errors, 0 warnings, 0 hints), `content:check` (50/50), `build` (126 pages); pages looked at in headless Chrome at 1440px and 390px.
- Awaiting the user's review of the two pilot lessons.

### 59. Technologies become active by themselves
The user asked that a technology be active on the site as soon as it has started or is finished; Git still showed "tezliklə".

Done (branch `feat/content-skills`):
- `apps/site/src/lib/technologies.ts`: the known technologies (Go, Git, Python, Rust, TypeScript, SQL) with a status computed from the content — `ready` (every lesson ready), `started` (at least one), `soon` (none). Active ones come first and link to `/<id>/`.
- The header switcher is built from that list (it was hand-written and did not list Git): "Go — başlanıb · 48/84", "Git — başlanıb · 2/39", the rest "tezliklə". The switcher shows the current technology on Go and Git pages; Git pages get a "Mövzular" nav link. Go used to say "84 nümunə ✓" although 36 lessons are still planned.
- Ctrl+K search also lists the topics of active technologies other than Go ("Git · Əsaslar").
- The design prototype (`design/v2/v2.js`) still has hand-written mock statuses (Git "soon"); it is a frozen reference and was not changed.
- Checked: `pnpm check` (0/0/0), lint, build (126 pages), the menu text on /, /go/, /git/ and a Git lesson.

### 60. The Git course on the v2 design
The user asked for all branches to be combined so the new design and the Git course show together, then for the header/home port to be committed.

Done (branch `feat/content-skills`):
- The port was uncommitted in the main checkout (51 files, its author session closed). Claude first combined a **copy** of it with the Go and Git branches in a local preview worktree (`chore/preview-combined`, never to be pushed) and resolved the 11 conflicts there: the port replaces the old theme (`base.css`, `platform.css` and the shell scripts are deleted), and rewrites the lesson page, `Vis`, `Quiz`, the sidebar and the lesson script that the Git work also touched. Then `go-by-example-az-c3` committed the port as `feat/site-home-header` (6 commits, local, from `origin/main`); its tree matched the snapshot except one file, so the verified resolutions were reused (`git rerere` plus the preview's versions) and `feat/site-home-header` was merged into this branch.
- `LessonView` now carries the port's lesson page for Go and Git (technology label and color, roadmap link only where a roadmap exists, session output with prompts); the sidebar is labelled by technology; `/git/` is built from the Go page's blocks; the areas visual and terminal styles live in the v2 lesson stylesheet (ligatures off in terminals, `--surface-2` replaced by `--glass`).
- Statuses: `platform.ts` gets `started`, `TechState`, `applyTechStates` and `techState`; `Layout` embeds the computed states; the header nav lists active technologies; the mega menu, the home stack map and Ctrl+K read them. Checked in the browser-built mega menu: "Go başlanıb", "Git başlanıb", the rest "tezliklə".
- Found on the way: a stale dev server kept port 4322 after its task was stopped, so some checks went to the old design (the new server had silently moved to 4323); the status JSON must be read before any script that imports `TECHS` runs, so it is applied when `platform.ts` loads.
- Checked after the merge: `pnpm check` (0/0/0), lint, `content:check` (66/66), build (128 pages).
- Not checked: Ctrl+K with Git topics, Git quiz code in the new design, the mobile layout. Open: `feat/content-files-system` (20 Go lessons) and this branch are still unpushed; the port's PR must merge first.

### 61. One technology page for every technology
The user asked why `/git/` had no background animation while `/go/` did, and whether each technology page should look different. Claude found that `/git/` had been copied from the Go page's blocks without the aurora and the progress card, and recommended one shared template where each technology differs only by its color; the user chose the shared component.

Done (branch `feat/tech-page`):
- `components/TechPage.astro`: hero (aurora in the technology's color, mark, badge, stats), progress card (ring, next lesson, per-section bars, total hours), "where it fits" (directions and the techs after it; hidden when no direction lists the tech), program (section cards / all topics), five-facets strip. Props: technology id (name and color come from `TECHS`), catalog, heading, description, badge, unit ("bölmə" / "modul"), optional lighter color, optional roadmap link.
- `styles/go.css` → `styles/tech.css` (`go-*` classes → `tech-*`, `--go-cyan` / `--go-ice` → `--tech-c` / `--tech-c-2`, set on `:root` by the page so the aurora can read them); `scripts/go-index.ts` → `scripts/tech-index.ts` (storage keys `w3:<tech>-open` / `w3:<tech>-view`, so Go keeps its keys).
- `/go/` and `/git/` are now a few lines each. Git gains the orange aurora, the progress card ("öyrənilib" marks work with the `git/<id>` slugs), the fit section, collapsible cards and the "all topics" view; a topic without a subtitle shows its duration.
- Checked: `pnpm check` (0/0/0), lint, format, build (128 pages); the built HTML of both pages (colors, aurora canvas, "Backend yolunda Git-dən sonra", 39 Git topics in both views). Not checked in a browser by Claude: the look of the orange aurora in light/dark themes and on mobile.

### 62. The technology page in a browser
The user asked Claude to check `/git/` in a browser (light and dark themes, mobile) after PR #19 was merged.

Done (branch `fix/tech-page-next`):
- Screenshots of `/git/` at 1440px and 390px in both themes and `/go/` at 1440px, taken through the Chrome DevTools Protocol (device metrics override, so 390px works in headless Chrome); no console errors, no horizontal scroll on phones, every section shows after scrolling (the reveal animations need a scroll, so an unscrolled full-page capture looks empty).
- Fixed: the "next lesson" in the progress card and the start button picked the first unlearned topic even if it had no lesson yet, so Git said "Başla: Version control nədir" (a planned topic) — `tech-index.ts` now skips planned topics. The build-time HTML was already right; only the browser script was wrong.
- Fixed: the space after "Hədəf:" on `/git/` was lost (a line break between `</b>` and an expression is dropped).
- Seen, not changed: in the light theme the orange aurora is very faint; the heading gradient uses the site's cyan → violet on every technology page, not the technology's color.
- Then changed (same branch): the second heading line on technology pages uses the technology's color (`--tech-c`) instead of the site-wide cyan → violet (Git is orange, Go cyan); the aurora is stronger in the light theme (opacity ~0.8 instead of ~0.39; dark theme unchanged at 0.7). This also affects the light-theme look of `/go/`.

### 63. Git syllabus v2: the full roadmap
The user asked why the Git syllabus did not follow the roadmap the way itbooster.ru does (roadmap 22, which mirrors roadmap.sh/git-github) and why it was shortened. Claude explained that v1 folded roadmap.sh's 155 topics into 39 nodes and left the GitHub part out. The user chose the full scope, a new `ui` lesson kind for GitHub interface topics, GitHub as a separate part, and left the outcomes to Claude.

Done (branch `feat/git-full-syllabus`):
- Topic names and order read from `https://roadmap.sh/git-github.json` (the graph behind the page; node positions give the order), so nothing was guessed.
- `content/git/syllabus.yaml` v2: one node per roadmap topic, 146 nodes, 821 min, 25 modules in two parts — "Hissə 1 · Git" (13 modules, 78 nodes) and "Hissə 2 · GitHub" (12 modules, 68 nodes). The 39 v1 ids kept, except two without lessons renamed (`status-and-diff` → `git-status`, `install-and-config` → `git-config`). Kinds: terminal 48, ui 33, state 21, code 15, compare 12, concept 10, diagram 7. A script maps every roadmap topic to a node: all covered except 6 section headers and roadmap.sh's typo "Scheduled Worfklows".
- Schema: `parts` (modules name their part, parts contiguous) and the `ui` kind (needs `visual`); `TechPage` shows a heading per part in both program views. Go pages unchanged.
- `plan-syllabus` skill: full roadmap and one node per topic by default, no silent scope cuts, roadmap.sh JSON as the source of order, `ui` in the kind table.

### 64. The last Go lesson and the Go check in CI
The user asked Claude to finish all remaining Go modules. All 9 sections were already written; only `execing-processes` was still `planned`, because its `output.txt` needs Linux (`syscall.Exec` always fails on Windows) and this machine has no WSL distro or Docker.

Done (branch `feat/go-ci`, in a separate worktree because a parallel session held the main checkout):
- `apps/site/scripts/run-go.ts` (`pnpm content:go [slug…] [--write]`): for every Go lesson `gofmt -l`, `go vet`, build, then run in an empty temporary directory with `GOTRACEBACK=none`, stdout and stderr in one file, and compare with `output.txt`. Expected non-zero exit codes are listed (`panic` 2, `exit` 1); Unix-only lessons are skipped on Windows.
- CI job `go-lessons` (Ubuntu, Go 1.26.x) runs it, so `execing-processes` is checked on Linux. Its `output.txt` holds the two lines the lesson promises (`launcher: handing over to sh`, `worker nightly-backup, same pid: yes`); the lesson is now `ready`, so all 84 Go lessons are.
- Checked locally: 83/83 lessons match their `output.txt` (Windows, Go 1.27.4); the Windows behaviour the quiz describes (`exec failed: not supported by windows`) seen by running the lesson; lint, format, `pnpm check`, `content:check` (86/86), build (128 pages).
- CI on Linux: 84/84, `execing-processes` included. Merged as PR #22 (after merging main, which had gained the Git syllabus v2).

### 65. Search, edit and run (Phase 2, module 3)
The user then asked Claude to go on with what is left for Go: Pagefind search, CodeMirror editing, `/api/run`, the glossary and step visuals. This entry covers module 3.

Done (branch `feat/search-run-edit`):
- `/api/run`: `apps/site/src/lib/go-run.ts` posts the code to `go.dev/_/compile` (`version=2`, `withVet=true`) and answers `{errors, vet, events}`; same-origin `Origin` only, 64 KB limit, 20 runs per client per minute (in memory). `functions/api/run.ts` serves it on Cloudflare Pages; a Vite middleware serves it in `astro dev` (Astro puts its trailing-slash middleware in front of the stack in a post hook, so ours is put in front after it).
- Lesson page (Go lessons only): "Redaktə" (`E`) loads CodeMirror 6 on demand (a 357 KB chunk, not preloaded) with the theme's `--tok-*` colors; "Sıfırla" restores the code; "İşə sal" (`Ctrl+Enter`, also inside the editor) shows the run in the terminal — stderr and compile errors in red, vet in yellow, and a note when the lesson's own code prints something other than `output.txt` (the Playground's frozen clock, no network). "Dərsin çıxışı" brings the recorded output back. Copy takes the edited code. The explanation → code link hides while the editor is open.
- Search: `pnpm build` runs `pagefind --site dist`; only ready lesson pages are indexed (86), with `tech`, `section` and `title` meta. The Ctrl+K palette keeps the instant title match and adds "Dərslərin mətnində" with up to 8 excerpts; Pagefind loads when the palette opens. Found on the way: the lesson group was called "Go dərsləri" and showed Git topics with the Go icon — now "Dərslər", icon by technology.
- Checked in headless Chrome (dev and preview builds): run of the lesson's code, of edited code, a compile error, the rate limit (429 after 20), a foreign origin (403), GET (405), too large (413), bad JSON (400); the editor in dark and light themes; 390 px width without horizontal scroll; search for "anbar", "mutex", "deadlock" (8 lessons), "commit" (Git topics), Enter on a result. Fixed during the check: the "Sıfırla" button showed while hidden (`.btn` display beat `[hidden]`), long compile errors scrolled sideways.
- Not checked: the Pages Function on Cloudflare itself (Pages is not connected yet, Phase 4).
- CI passed; merged as PR #24.

### 66. Step visuals and the glossary
The rest of the user's request: step visuals for map, channel and goroutine, and the terminology glossary.

Done (branch `feat/go-visuals`):
- Three new `vis` kinds (schema in `lib/lesson.ts`, markup in `Vis.astro`, styles in `lesson.css`): `map` (key → value rows in Go's print order; changed keys green, deleted ones struck through; a `m[key] → value, ok` read), `channel` (sender → buffer slots or one "əldən-ələ" slot when unbuffered → receiver; the values taken and who waited, in amber) and `timeline` (goroutines as bars on a ms axis: work, wait, cut when `main` returns; the legend lists only the states shown). Inconsistent data is rejected by `pnpm content:check` (a fresh key missing from the entries, a buffer over `cap`, a bar outside the axis…). The step script replays the bars' grow animation like the cells' pop; the global reduced-motion rule stops both.
- Data written for maps (5 steps), channels (3), channel-buffering (4) and goroutines (3), checked against the code and the lesson text (soba / piştaxta, kassir / barista).
- Fixed on the way: notes inside a visual (`.vis-note`, also the old slice note) were 15 px because `.lx-step p` beat them; now 12.5 px.
- `docs/GLOSSARY.md`: 88 terms in the nine sections — kept in English or translated (sabit, rekursiya, heş, dövr…), a short Azerbaijani explanation and the lesson that introduces it, checked against the lesson texts. The `write-lesson` skill points to it and lists the visual kinds.
- Checked in headless Chrome: every new visual in the dark theme, the timeline in the light theme, channel-buffering and goroutines at 390 px (no horizontal scroll); `content:check` with deliberately broken data (six cases rejected).
