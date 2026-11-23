# Design prototype — Nümunələrlə Go

A framework-free static HTML/CSS prototype. Goal: approve the visual style and UX. In Phase 2 these tokens and components will be moved to Astro.

## How to open
```
node design/serve.mjs
```
Then in a browser: http://localhost:4321/d/ (**Variant D — chosen**), http://localhost:4321 (Variant A), http://localhost:4321/b/ (Variant B), http://localhost:4321/c/ (Variant C).

There are four variants. The **Variant A | B | C | D** switch in the bottom-right corner of every page jumps to the other variant of the same page.

| | Variant A — “Clean” | Variant B — “Scope” | Variant C — “Roadmap” |
|---|---|---|---|
| URL | `/` | `/b/` | `/c/` |
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
- The lesson page logo links to the platform home; its Go links and breadcrumbs point to `go.html`.

In all variants **explanation ↔ code highlight each other**: hovering the explanation highlights code lines, and hovering a code line highlights the matching explanation step (scrolling it into view if needed).

## Files
| File | Purpose |
|---|---|
| `tokens.css` | Colors, fonts, sizes — light and dark theme. A new technology site changes only the `--accent*` variables. |
| `app.css` | Components: header, sidebar, search palette, code window, terminal, quiz, pager |
| `app.js` | Theme, `Ctrl+K` search, Go syntax highlighting (prototype), progress (`localStorage`) |
| `data.js` | List of 84 examples (9 sections) — on the real site it will be generated from `content/go/` |
| `index.html` | Home page |
| `example.html` | Example page (pilot: Slices) |
| `b/style.css` | All of Variant B's styles and tokens |
| `b/b.js` | Variant B: step player, memory visualizer, Slices lesson data |
| `b/index.html`, `b/example.html` | Variant B pages |
| `c/style.css` | Variant C styles, neutral tokens and 4 palettes (`data-palette`) |
| `c/c.js` | Variant C: palette switcher, dropdown menus, section colors |
| `c/index.html`, `c/example.html` | Variant C pages (reuse `b/b.js` for the player) |
| `d/style.css` | Variant D: A and B components on top of `c/style.css` |
| `d/d.js` | Variant D: lesson page view modes (panel, width, zen) and home page scroll animation |
| `d/index.html` | Variant D: platform home (path choice, node explorer, platform sections) |
| `d/go.html` | Variant D: Go technology page (former home page; future `/go/`) |
| `d/example.html` | Variant D: lesson page (reuses `b/b.js`, `c/c.js`) |
| `serve.mjs` | Dependency-free local server |

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
