# Design prototype — Nümunələrlə Go

A framework-free static HTML/CSS prototype. Goal: approve the visual style and UX. In Phase 2 these tokens and components will be moved to Astro.

## How to open
```
node design/serve.mjs
```
Then in a browser: http://localhost:4321/ (redirects to **Variant D — chosen**, http://localhost:4321/d/). The archived variants stay available for comparison: http://localhost:4321/archive/a/ (A), `/archive/b/` (B), `/archive/c/` (C).

There are four variants; A, B and C are **archived** under `archive/` (frozen, don't edit). The **Variant A | B | C | D** switch in the bottom-right corner of every page jumps to the other variant of the same page.

| | Variant A — “Clean” | Variant B — “Scope” | Variant C — “Roadmap” |
|---|---|---|---|
| URL | `/archive/a/` | `/archive/b/` | `/archive/c/` |
| Reference | Stripe/Linear style | frontscope.dev | roadmap.sh + itbooster.ru + frontscope visuals |
| Colors | Dark blue-black, Go blue | Black, lime `#E8FF5A` | Black/gray + blue→purple gradient; **4 palette options** |
| Heading font | Inter | Unbounded (Syne lacks `ə/Ə`) | Inter |
| Home page | Hero + code card, section cards | Large hero, floating tags, live demo | Compact hero + progress card, **Examples / Roadmap** tabs, bento, hub section, scroll-spy dots |
| Lesson page | Explanation + full code | Explanation + player (code, memory, output) | Same player + a **vertical path** (spine) and section switcher in the sidebar |

**Variant C UX decisions:**
- *From roadmap.sh:* a dense 3-column tile grid (each example: name + short description + status), a “Roadmap” view: central line, section nodes and examples branching to both sides. Statuses: learned (green), next (accent), upcoming (gray).
- *From itbooster.ru:* code-style section labels (`features.Why()`, `hub.Next()`), bento cards, section dots on the right edge (scroll-spy).
- *From frontscope:* visualization only — step player and memory visual.
- *Hub preparation:* a technology switcher in the header (`Go ▾` → Python, Rust… “coming soon”) and a “One platform, several languages” section on the home page.
- *Palette:* the palette button in the header — Nebula (blue→purple), İndiqo, Okean, Qrafit. The choice is remembered.

### Variant D — merged (`/d/`)
Based on feedback, the liked parts of A, B and C together:
- **From C:** colors, 4 palettes, header (technology switcher), hero structure, bento, hub, scroll-spy.
- **From A:** the Go version badge in the hero, “All topics” cards, a collapsible sidebar on the lesson page showing all sections, **full-height code** (not trimmed per step; output under the code).
- **From B:** the “Don't read — see.” live demo, the “Program — 9 sections. 84 examples.” section (track cards + numbered rows + filter).
- The “Program” section switches between 3 views: **All topics** (A) · **By section** (B) · **Roadmap** (C). The choice is remembered.
- In the lesson the memory visual is shown inside each step; step controls (‹ 01/05 › ▶) are in the code window header.
- **Home page animations:** the gradient behind the hero moves (large soft blobs in two palette colors drift slowly and blend), a flowing gradient in the heading, hero elements rise in sequence on load. On scroll: the code label (`demo.Play()`) types out, heading words rise from under a mask in sequence, the “9 sections. 84 examples.” numbers count up from 0, the subtitle sharpens from blur, cards arrive in sequence from below/from blur, roadmap branches come in from the sides, the hero fades as it scrolls up, and the demo player straightens from a 3D tilt (scroll-linked).
  - *View switches:* when switching between “All topics / By section / Roadmap”, cards arrive in sequence; on the map the central line draws, nodes grow, branches come in from the sides; when choosing a section or changing a filter, rows slide in from the left.
  - *“Why this site?” cards:* each card has its own mini-animation (`append` to a slice, a command typed in a terminal and its result appearing, explanation ↔ code glow, a quiz answer being picked, buttons being pressed, a bar filling, a shimmer on the license badge). Animations run only while the card is on screen. On hover the card lifts and a cursor-following glow appears. All are disabled when `prefers-reduced-motion` is on.
- **Lesson page view modes** (the “View” menu in the header):
  - *Topics panel* — hidden/shown with the button on the left of the header or <kbd>[</kbd> (opens a drawer on narrow screens).
  - *Content width* — **Centered** (1220px, default) or **Full width**; <kbd>F</kbd>.
  - *Zen mode* — header, sidebar, footer and the path line are hidden, content stays centered; reading progress at the top, output panel bottom-left. Opens with <kbd>Z</kbd>, closes with <kbd>Esc</kbd>; there is also a “Zen” button in the lesson header.
  - Panel and width choices are saved in `localStorage`, zen only for this tab (`sessionStorage`); they are applied in `<head>` to avoid flicker on load.

#### Platform home (`d/index.html`, 2026-11-23)
D's home page now presents the **platform**, not only Go. The former Go home page moved to `d/go.html` (the future `/go/` route).
- **Header:** working-name logo (“Nümunələrlə”, `data-brand`; the final name is an open question), a “Texnologiya ▾” menu listing technologies and directions, nav: Roadmaps · Sections · Go.
- **Hero:** platform pitch, “Choose your path” / “Start with Go” CTAs, facts row, and a “continue” card with Go progress.
- **Choose your path** (`path.Choose()`): a switch between **by technology** (Go active with progress; Python, TypeScript, SQL, Rust “coming soon”) and **by direction** (Backend “in preparation”, Frontend, DevOps; each card lists the technologies it combines). The choice is remembered.
- **Every step — theory and practice** (`node.Open()`): a Go roadmap fragment (6 nodes with learned / next / upcoming status) and a panel with 5 tabs per node — Theory · Practice (highlighted code) · Visual (animated steps) · Test (clickable quiz) · Interview (question + revealable answer). Tabs support arrow keys.
- **Platform sections** (`platform.Sections()`): a bento of the 6 sections in the agreed rollout order with status badges and mini-animations (roadmap nodes pulse, a quiz answer is picked, an interview answer appears, two pointers move, a live-coding timer ticks and tests pass).
- **Don't read — see.** demo kept as the showcase of the visual explanation section.
- The node content and the 5-tab panel are shared with the roadmap page through `d/nodes.js`.
#### Roadmap page (`d/roadmap.html`, 2026-11-23)
The roadmap is a first-class page, linked from the header nav (“Yol xəritəsi”) of every D page, the home page (“Tam xəritə”, the roadmaps card) and the Go page hero.
- **Two kinds** (switch at the top): **Go · technology** — all 9 sections / 84 topics as collapsible groups with a spine and learned / next / upcoming dots, plus an All / Not learned / Learned filter; **Backend · direction (preview)** — Git → HTTP → Go → SQL → Docker → Deploy; Go nodes are real and clickable, the rest are “coming soon”.
- **Sticky node panel** on the right (above the map on narrow screens) with the 5 facets: Theory · Practice · Visual · Test · Interview. Topics without sample content show a short “coming soon” text.
- **Deep links:** `roadmap.html#slices`, `roadmap.html#backend`, `roadmap.html#backend/goroutines`.
- Progress bar and counts follow the learned set in `localStorage`.

- The lesson page logo links to the platform home; its Go links and breadcrumbs point to `go.html`.

In all variants **explanation ↔ code highlight each other**: hovering the explanation highlights code lines, and hovering a code line highlights the matching explanation step (scrolling it into view if needed).

### Design v2 — "Aurora glass" (`/v2/`, 2026-11-25)
A new, self-contained version built on D (D itself is unchanged). Open http://localhost:4321/v2/. It loads only `shared/data.js`; its own files are listed below. Brand name preview: `w3hub.dev` (default) or `beststack.dev`, switched in the footer or with `?brand=beststack`.
- **Look:** D's blue → violet palette pair (4 palettes) plus a warm accent, dark first; WebGL aurora ribbons, hairline grid with crosshairs, glass cards with corner dots, rotating glowing borders, SVG node-graph wires.
- **Pages:** `index.html` (platform home), `go.html` (technology page), `roadmap.html` (Go graph + Backend preview, 5-facet node panel), `lesson.html?ex=slices` (lesson page).
- **Motion:** aurora, typing placeholder, wires, auto-cycling demos and reveals stop under `prefers-reduced-motion` (the aurora draws one still frame).

### Design v3 — "Order from chaos" (`/v3/`, 2026-11-26)
A home page with **its own idea and motion language** (the first v3 try, "Aurora editorial", was rejected and deleted — the user found v2 better). Open http://localhost:4321/v3/. It loads v2's shell (`../v2/v2.css`, `../v2/v2.js`: tokens, header, menus, search) and adds `index.html`, `v3.css`, `v3.js`; no aurora and no glass wires. The other pages (Go, roadmap, lesson) are still v2's and are linked with `../v2/…` (`window.W3_PAGES` tells `v2.js` where they live). A small **v2 | v3** switch sits bottom-right; on desktop the header is a floating capsule.
- **Idea and copy:** "Öyrənmək çətin deyil. Azmaq asandır." — the problem is not the lack of material but the lack of order. The whole page plays that out: chaos first, order after.
- **Hero (canvas 2D particle field):** ~3200 points drift as dust while the headline rises; then they snap into a **roadmap graph** with a light ring. The sculpture then morphs through the five sides of every topic — map, `{ }` code, a rotating 3D cube (visual), a check (test), a speech bubble (interview) — with tabs and a caption; points leave short light trails, flee the pointer, and dissolve back into dust as the hero scrolls away. The simulation is time-based (sub-steps), so it converges at the same speed at any frame rate.
- **01 Problem:** "Əvvəl: 47 açıq tab. Sonra: bir xəritə." — a **before/after slider** (drag, click or arrow keys): jittering tab chips on one side, the clean Go roadmap with the next lesson on the other; it sweeps once when it enters the view.
- **02 Manifesto:** one large paragraph whose words **light up with the scroll**.
- **03 One topic, five layers:** a **pinned 3D exploded view** — five plates (theory, code, visual, test, interview) separate as you scroll and each lights up in turn; the list on the left scrolls to a layer. No pin on narrow screens or with reduced motion (the stack is shown exploded, layers switch by tap).
- **04 Stack:** a **technology orbit** — three rings (languages / web and data / tools and infra) revolve around "sən"; choosing a direction numbers its technologies in learning order and dims the rest.
- **05 Platform:** the eight sections as a **large typographic list** with status, and a preview card that follows the cursor.
- **Finale:** a running line of outlined type and the resume card.
- Under `prefers-reduced-motion` the hero draws one still frame (tabs still switch shapes), the manifesto is fully lit, nothing revolves.

## Files
```
design/
  serve.mjs       dependency-free local server ("/" redirects to /d/)
  shared/         files used by D (and by the archived A–C)
  d/              Variant D — the chosen design
  archive/        Variants A, B, C — frozen, kept for comparison
  v2/             Design v2 — new version built on D
  v3/             Design v3 — home page built on v2 (reuses v2's shell)
```

| File | Purpose |
|---|---|
| `shared/app.js` | Theme, `Ctrl+K` search, Go syntax highlighting (prototype), progress (`localStorage`), variant switch |
| `shared/data.js` | List of 84 examples (9 sections) — on the real site it will be generated from `content/go/` |
| `shared/b.js` | Step player, memory visualizer, Slices lesson data (originally Variant B) |
| `shared/c.js` | Palette switcher, dropdown menus, section colors (originally Variant C) |
| `shared/base.css` | Neutral tokens, 4 palettes (`data-palette`) and base components (originally Variant C's `style.css`) |
| `d/style.css` | Variant D: imports `shared/base.css` and adds A and B components, the platform home, roadmap page and animations |
| `d/d.js` | Variant D: lesson page view modes (panel, width, zen) and home page scroll animation |
| `d/nodes.js` | Variant D: sample node content and the shared 5-tab node panel (home explorer + roadmap page) |
| `d/index.html` | Variant D: platform home (path choice, node explorer, platform sections) |
| `d/roadmap.html` | Variant D: roadmap page (technology + direction preview, node panel) |
| `d/go.html` | Variant D: Go technology page (former home page; future `/go/`) |
| `d/example.html` | Variant D: lesson page |
| `v2/v2.css`, `v2/v2.js` | Design v2 shell: tokens, glass components, header menus, search, reveal, aurora (WebGL), shared data (technologies, directions, sections) |
| `v2/index.html`, `home.css`, `home.js` | Design v2: platform home |
| `v2/go.html`, `go.css`, `go.js` | Design v2: Go technology page |
| `v2/roadmap.html`, `roadmap.css`, `roadmap.js`, `nodes.js` | Design v2: roadmap page and sample node facets |
| `v2/lesson.html`, `lesson.css`, `lesson.js` | Design v2: lesson page (the real `slices` lesson) |
| `v3/index.html`, `v3.css`, `v3.js` | Design v3: platform home (particle-field hero, before/after slider, scroll-lit manifesto, exploded five-layer lesson, technology orbit, section list); loads `v2/v2.css` + `v2/v2.js` |
| `archive/a/` | Variant A: `tokens.css`, `app.css`, `index.html`, `example.html` |
| `archive/b/` | Variant B: `style.css`, `index.html`, `example.html` |
| `archive/c/` | Variant C: `index.html`, `example.html` (styles are `shared/base.css`) |

The archived variants load `shared/` files, so changing those also affects A–C. Everything else in `archive/` must stay as it is.

## Design decisions
- **Dark theme first**, but it opens according to the system preference; the light theme is fully supported.
- **Color:** Go blue `#00ADD8` is the main accent; aqua for success, fuchsia for errors, yellow for warnings (Go brand palette).
- **Fonts:** Inter (text) and JetBrains Mono (code), both support `ə ı ş ç ğ ö ü`. Ligatures are disabled in code so beginners don't see `<=` as `≤`.
- **Example page = explanation + full program.** Instead of splitting the code into fragments as in the original, steps are on the left and a sticky **full program** is on the right. Whichever step is being read (scroll or hover), the matching code lines are highlighted and the rest dim. The full code can be run and copied directly.
- **On narrow screens** (< 1180px) each step shows its own code snippet below it, and the full program is given at the end. The sidebar becomes a drawer below 960px.
- **Learning loop:** explanation → run → “Remember” → “Check yourself” question → “Learned” → next topic.
- **Search** is insensitive to Azerbaijani letters: the query `dovr` finds “Dövr”.

## Simulated in the prototype
- “Run” shows a prepared result. On the real site the `/api/run` → `go.dev/_/compile` proxy will run.
- Editing is a plain `contenteditable`. On the real site CodeMirror will be lazy-loaded.
- Only the **Slices** page is filled in; other links open that page with a notice.
- On first visit progress is pre-filled for the demo (8 examples “learned”).
