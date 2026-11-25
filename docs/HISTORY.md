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

### 42. "Funksiyalar" section: `functions`, `multiple-return-values`, `variadic-functions`, `closures`, `recursion`
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

### 43. "Tiplər və strukturlar" section: `pointers`, `structs`, `methods`, `interfaces`, `enums`, `struct-embedding`, `generics`, `range-over-iterators`
The user asked to prepare the next content; the next section in course order was "Tiplər və strukturlar", all eight lessons `planned`.

Done (branch `feat/content-types`, started from `feat/content-functions`, which is not merged yet), with the `write-lesson` skill:
- `pointers` (a car park: `&`/`*`, a copy parameter vs a `*int` parameter, `nil` pointer, `new`; 4 steps, 8 questions), `structs` (parcel delivery: type and keyed literal, zero value and partial literal, copy on assignment and `==`, struct pointer with auto-dereference, slice of structs and the `range` copy pitfall; 5 steps, 8 questions), `methods` (a music playlist: value receiver, pointer receiver, a method on `type Minutes int`; 3 steps, 6 questions), `interfaces` (online-shop shipping: implicit implementation, interface as parameter and in a slice, type switch with comma-ok assertion and `any`; 3 steps, 7 questions), `enums` (washing machine stages: `iota`, `String()` as `fmt.Stringer`, `Next()`; 3 steps, 6 questions), `struct-embedding` (delivery labels: promoted fields and methods, shadowing a method, embedding satisfying an interface; 3 steps, 6 questions), `generics` (smart-home sensors: a `maxFloat` that cannot take `[]int` humidity shows the problem, then `Max[T cmp.Ordered]`, `Count[T comparable]` used with `bool` motion data, generic `Log[T any]` with `var zero T`; 4 steps, 8 questions. Rewritten after the user agreed that the first "hotel survey" version only renamed variables, see entry 45), `range-over-iterators` (a bus timetable: `iter.Seq`, `iter.Seq2`, early `break` and `yield` returning false, `slices.Collect` and `slices.Sorted(maps.Keys(m))`; 4 steps, 7 questions). All `source: original`, `status: ready`, with `takeaways.az.yaml`.
- Code layout: where the lesson is about declarations (methods, interfaces, enums, embedding, generics, iterators) the steps mark the top-level declarations and `main` calls them in step order; `pointers` and `structs` keep the steps in `main`. The weak spot from entry 42 (calls in `main` not highlighted) stays for those lessons.
- Only `fmt.Println`/`fmt.Print` are used in lesson code, since `Printf` comes later in "Mətn və verilənlər". Maps are printed whole (fmt sorts keys) or through sorted keys, so outputs stay deterministic.
- Originality: avoided the well-known shapes (`zeroval`/`zeroptr`, `person`/"Bob", `rect`/`circle` with `area`/`perim`, `geometry`/`measure`, `ServerState`, `base`/`container`, `SlicesIndex`/`List[T]`, `SumIntsOrFloats`, `genFib`, Tour `Vertex`).
- Verified with Go 1.27.4: `gofmt`, `go vet`, `go run` (`output.txt`) for all eight; all 55 quiz answers checked by running snippets or reading the compiler/runtime message (`cannot use price (variable of type int) as *int`, `unknown field Zone`, `too few values in struct literal`, `cannot call pointer method Toggle on Lamp`, `cannot define new methods on non-local type int`, `missing method Name`, `method Tick has pointer receiver`, interface conversion panic, `constant 1 of int type Stage`, `type parameter T cannot use operator >`, `type float64 of y does not match inferred type int`, `possibly missing ~`, `cannot use generic type Shortlist[T any] without instantiation`, `range function continued iteration after function for loop body returned false`); `pnpm content:check` (25/25), format, lint, check (0 errors), build (86 pages); `/go/generics/` and `/go/pointers/` checked in headless Chrome at 1440px.
- Found while checking: Go 1.27.4 accepts a promoted field in a struct literal (`Phone{Level: 50}` with an embedded `Battery`), which Go 1.26 rejects. Since the project targets 1.26 and the behaviour differs between versions, that quiz question and the matching "Yadda saxla" rule were replaced (now: an outer field shadowing an embedded one).
- Awaiting the user's review of tone and clarity.

### 44. "Xətalar" section: `errors`, `custom-errors`, `panic`, `defer`, `recover`
The user asked for the next content again; the next section was "Xətalar", all five lessons `planned`.

Done (branch `feat/content-errors`, started from `feat/content-types`, neither merged yet), with the `write-lesson` skill:
- `errors` (a library: `(int, error)` with `errors.New` and `if err != nil`, sentinel `ErrNotFound`/`ErrOnLoan` compared with `==`, wrapping with `fmt.Errorf` `%w` and `errors.Is`; 3 steps, 8 questions), `custom-errors` (meeting-room booking: `*BookingError` with `Error()`, `Unwrap()` so `errors.Is` finds `ErrBusy`, `errors.As`, the typed-nil-in-interface pitfall as a note and a question; 3 steps, 7 questions), `panic` (theatre seat prices: `panic` for an impossible row, runtime panics and an index check, the crash ending the program; 3 steps, 6 questions), `defer` (a bakery day: basic defer, LIFO order in a loop, arguments evaluated at the `defer` line vs a deferred closure, early return; 4 steps, 7 questions), `recover` (a photo kiosk: defers run while a panic unwinds, `recover` in a deferred literal, converting a runtime panic into an `error` with a named result; 3 steps, 6 questions). All `source: original`, `status: ready`, with `takeaways.az.yaml`.
- Course order puts `panic` before `defer`, so the `panic` lesson does not use `defer`; `recover` builds on both.
- The `panic` lesson ends in a real panic (the point of its last step). Its `output.txt` was generated from a built binary with `GOTRACEBACK=none ... > output.txt 2>&1`: stdout plus the bare `panic: unknown row Z` line, no stack trace with paths and addresses. Exit code is 2. The rule was added to the `write-lesson` skill; the future CI (Phase 4) must expect exit code 2 for this lesson (and for `exit` later).
- Printf verbs are not taught yet, so only `%s`, `%w` and `%v` appear, each explained where it is first used; `fmt.Sprint` is explained in one clause in `custom-errors`.
- Verified with Go 1.27.4: `gofmt`, `go vet`, `go run` (`output.txt`) for all five; all 34 quiz answers checked by running snippets or reading the compiler/runtime message (`assignment mismatch`, `declared and not used: err`, `method Error has pointer receiver`, typed nil interface `!= nil`, `index out of range [3] with length 3`, `index 3 out of bounds [0:3]` for the array, `assignment to entry in nil map`, `expression in defer must be function call`, `recover` outside a deferred call and inside a helper called by a deferred literal both not catching, integer division by zero recovered); `pnpm content:check` (30/30), format, lint, check (0 errors), build (86 pages); `/go/panic/` checked in headless Chrome at 1440px.
- Awaiting the user's review of tone and clarity.

### 45. Real-life contexts: keep them, but they must show why
The user asked whether explaining lessons through real-life examples is a good approach. Claude's view: yes, when the context shows why the concept is needed (`custom-errors`: the caller needs the room and hour; `recover`: the kiosk must keep running), but not when it only renames variables (the first `generics` version spread a "hotel survey" over unrelated helpers) or when it distracts from an abstract mechanism. Quizzes switching to other small contexts is fine on purpose. The user agreed and asked to record this in the skill and rewrite `generics`.

Done:
- `write-lesson` skill, section 2: a "Context check" (the context must show why the concept is needed; for abstract mechanics the first step shows the problem the feature solves and the context stays light) and a note that quizzes may use other contexts on purpose.
- `generics` rewritten on `feat/content-types` (smart-home sensors, 4 steps, 8 questions): `maxFloat` cannot take `[]int` humidity, `Max[T cmp.Ordered]` replaces it, `Count[T comparable]` works for `bool` motion data while `Max` does not, `Log[T any]` with `Latest` returning `var zero T`. Step ids changed (`problem`, `generic`, `comparable`, `type`); the lesson was never published, so the stable-id rule is not broken. Verified with Go 1.27.4 (`gofmt`, `go vet`, `go run`, all 8 quiz answers and the two "does not compile" claims in the text), `content:check`, format, lint, check, build. `feat/content-errors` rebased onto it.
- Awaiting the user's review.
