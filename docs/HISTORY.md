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
