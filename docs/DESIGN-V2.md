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

## Where to continue

1. **Prepare 1–2 more variants** of the home page (and, once one is chosen, the other pages) next to the current one, e.g. `design/v2/` stays "A: Aurora glass"; add `design/v2b/` (and optionally `v2c/`). The user did not specify the directions yet; proposals to offer:
   - **B — "Light editorial":** light-first, large typography, soft pastel gradients, fewer effects; closest to itbooster.ru's calm layout.
   - **C — "Roadmap-first":** the hero **is** an interactive roadmap graph (roadmap.sh style), with the pitch beside it; the least decorative, most product-like.
   Ask the user which to build if they have a preference; otherwise build B and C for the home page only, sharing `v2/v2.js` data (technologies, directions, platform sections).
2. Compare the variants side by side (`node design/serve.mjs 4399`; `/v2/`, `/v2b/`, `/v2c/`), record feedback in [HISTORY.md](HISTORY.md), then choose.
3. Decide the platform name (`w3hub.dev` / `beststack.dev` / other) — check domain availability.
4. After a variant is approved: move it into `packages/theme` / `apps/site` (Phase 2 module 2: `/`, `/go/roadmap/`, `/roadmaps/backend/`).
5. Known gaps: `design/shared/data.js` says "Massivlər" in the Kolleksiyalar description (term rule); the roadmap opens on the next topic, which may have no sample facet content; check fonts and aurora performance on a real browser/phone.

## Tooling notes

- Server: `node design/serve.mjs 4399` (port 4321 may be taken by the Astro dev server).
- Visual checks were done in headless Chrome over CDP (waiting for reveal animations, scrolling, screenshots at 1440 dark/light and 390px); reveal animations need a real scroll or they stay hidden in screenshots.
- The `gh` CLI is not installed, so pull requests are opened from the compare link.
