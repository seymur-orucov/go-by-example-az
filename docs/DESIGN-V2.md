# Design v2 — brief, sources and where to continue

Single place for the design v2 work (`design/v2/`): what the user asked for, which references and sources were given, what is done, and what comes next. When the user says **"design-a qaldığımız yerdən davam edək"**, start here.

## User's request (2026-11-25)

- Redesign the home page and the other pages **on top of Variant D, as a new version** (D stays frozen), taking into account the design gaps listed in [ROADMAP.md](ROADMAP.md) (Phase 6, "Design gaps for the platform").
- Platform name candidates (user's proposals): **`w3hub.dev`**, **`beststack.dev`**. Undecided; both are switchable in the v2 footer (`?brand=`).
- Home page wishes:
  - an intro (hero) that is interesting — an animation or a video-like effect;
  - the available technologies and directions shown **compactly but visually**;
  - the platform's **advantages over the alternatives**; and similar sections.
- Sources named for structure/UX: **itbooster.ru** and **roadmap.sh** (structure and UX references only; no text copied — see [DECISIONS.md](DECISIONS.md#vision-2026-11-23) for the consent rule).
- Result: the user liked the first version ("bu dizayn çox yaxşı alınıb").
- **Next request: prepare 1–2 more design variants** (see "Where to continue").

## Reference images (five, supplied by the user)

| # | Reference | What was taken |
|---|---|---|
| 1 | "AuthKit" launch graphic: three overlapping glass login cards, hairline grid with crosshairs and corner dots, a row of icon tiles joined by a dotted line | glass cards with corner dots, grid + crosshairs, the platform-sections icon rail, the tilted three-card hero showcase |
| 2 | "Nebula" brand backdrop: light ribbons flowing over black, logo centered | the WebGL aurora ribbons behind the hero |
| 3 | Four glass feature cards with 3D glass art (rings, pyramid, cube) | the four "Niyə məhz burada?" cards with 3D glass SVG illustrations |
| 4 | Prompt box with a rotating glowing gradient border, "Prompts / Mic" row | the glowing "Nə öyrənmək istəyirsən?" ask box (opens Ctrl+K search) |
| 5 | "Automate your workflow": glass nodes joined by glowing lines, feature list on the left | node-graph wires: stack map (directions ↔ technologies), one-node-five-facets graph, the roadmap graph |

## Done (branch `feat/design-v2`, `design/v2/`)

Home (`index.html`), Go page (`go.html`), roadmap (`roadmap.html`), lesson (`lesson.html?ex=slices`). Details: [HISTORY.md](HISTORY.md) entry 41, [design/README.md](../design/README.md), [DECISIONS.md](DECISIONS.md#design).

## Design v3 (2026-11-25) — `design/v3/`

The user's request: **a v3 on the basis of v2 and the same references.** On top of v2's notes, the goals: *modern but elegant, dynamic but light, a grand intro animation, headlines and copy as a real copywriter would write them.*

What was built (home page only; details in [HISTORY.md](HISTORY.md) entry 42 and [design/README.md](../design/README.md)):
- Reuses v2's shell (`v2.css`, `v2.js`) — new files are `index.html`, `v3.css`, `v3.js`. The Go, roadmap and lesson pages are still v2's (`../v2/…`); `window.W3_PAGES` in `v2.js` makes that possible.
- Intro: the headline "Hello, World-dən ilk iş gününə qədər." drawn as a learning path (burst → path draws → words rise → aurora → traveller).
- Sections: technology band, scroll story (map → lesson → quiz), direction chain (FLIP), five live facet cards, editorial claims + comparison, platform timeline, resume CTA.
- Compare: `node design/serve.mjs 4399` → http://localhost:4399/v2/ and http://localhost:4399/v3/ (the switch bottom-right on v3).

## Where to continue

1. **Get the user's feedback on v3** (hero/intro, copy, sections) and record it in [HISTORY.md](HISTORY.md). If v3 is the direction, do the **other pages in the v3 style** (`go.html`, `roadmap.html`, `lesson.html`) inside `design/v3/` — v3 can keep loading v2's shell, or absorb it once v2 is retired.
2. If the user wants another variant instead, the earlier proposals still stand: **"Light editorial"** (light-first, large type, fewer effects) or **"Roadmap-first"** (the hero is the interactive roadmap). Build them as `design/v3b/` etc., sharing `v2/v2.js` data.
3. Decide the platform name (`w3hub.dev` / `beststack.dev` / other) — check domain availability.
4. After a variant is approved: move it into `packages/theme` / `apps/site` (Phase 2 module 2: `/`, `/go/roadmap/`, `/roadmaps/backend/`).
5. Known gaps: `design/shared/data.js` says "Massivlər" in the Kolleksiyalar description (term rule); the roadmap opens on the next topic, which may have no sample facet content; check fonts, the aurora and the v3 intro on a real browser/phone (headless runs had no web fonts).

## Tooling notes

- Server: `node design/serve.mjs 4399` (port 4321 may be taken by the Astro dev server).
- Visual checks were done in headless Chrome over CDP (waiting for reveal animations, scrolling, screenshots at 1440 dark/light and 390px); reveal animations need a real scroll or they stay hidden in screenshots.
- The `gh` CLI is not installed, so pull requests are opened from the compare link.
