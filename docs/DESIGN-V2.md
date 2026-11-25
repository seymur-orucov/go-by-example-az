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

## Design v3 — `design/v3/`

The user's request (2026-11-25): **a v3 on the basis of v2 and the same references.** On top of v2's notes, the goals: *modern but elegant, dynamic but light, a grand intro animation, headlines and copy as a real copywriter would write them.*

**First try — rejected (2026-11-25).** "Aurora editorial": v2's aurora and glass, a drawn learning-path intro ("Hello, World-dən ilk iş gününə qədər."), a scroll story, a FLIP chain, live facet cards. The user's verdict: *"Bəyənmədim. V2 daha yaxşıdır. V3-ü sil. Yenidən fərqli ideya ilə v3 üçün əsas səhifəni yarat. Animasiyalar … V2-dən fərqli amma daha yaxşı olmalıdır."* Lesson: a variant that reuses v2's look reads as a weaker v2 — a new variant needs its own idea and its own motion language. The files were deleted (they remain in git history: `ab7e013`).

**Second try — "Order from chaos" (2026-11-26), awaiting review.** Details in [HISTORY.md](HISTORY.md) entry 43 and [design/README.md](../design/README.md):
- Idea and headline: "Öyrənmək çətin deyil. Azmaq asandır." — chaos first, order after.
- Hero: a canvas particle field; dust snaps into a roadmap graph, then morphs through code, a 3D cube, a check and a speech bubble (the five sides of a topic).
- Sections: before/after slider ("Əvvəl: 47 açıq tab. Sonra: bir xəritə."), scroll-lit manifesto, pinned 3D exploded lesson ("Bir mövzu. Beş qat."), technology orbit ("Bütün stack sənin ətrafında fırlanır."), typographic section list, finale with the resume card.
- Loads v2's shell (`v2.css`, `v2.js`); the Go, roadmap and lesson pages are still v2's (`../v2/…`, via `window.W3_PAGES`).
- Compare: `node design/serve.mjs 4399` → http://localhost:4399/v2/ and http://localhost:4399/v3/ (the switch bottom-right on v3).

**Feedback on the second try (2026-11-26):** the user named two parts they did not like — the **"Bir mövzu. Beş qat."** section (the pinned 3D exploded view) and the **running "Seç · Öyrən · Yoxla · Təkrar" line** in the finale — and asked for a v4: *"V4 hazırla. Tam fərqli."* Nothing was said about the other v3 sections.

## Design v4 — `design/v4/` ("Metro", 2026-11-26) — not liked

**Verdict (2026-11-26):** *"Maraqlıdır amma bəyənmədim."* The user then asked for a mix of v2 and v3 (see v5 below). v4 stays in the repo for comparison.

Details in [HISTORY.md](HISTORY.md) entry 44 and [design/README.md](../design/README.md):
- Idea and headline: "Hər peşə bir xətdir. Hər texnologiya bir stansiya." — the platform as a transit map.
- Own look and shell (`v4.css`, no `v2.css`): flat wayfinding signage, thick lines, sign plates, paper tickets; the light theme is a warm printed map. `v2.js` is loaded only for data, theme/palette and search.
- Hero: an SVG transit map drawn from Git on load, one train per line, a line chooser, station signs; the headline shares the map canvas.
- Sections: Go strip map + timetable, a working `slices` lesson demo with a turnstile question, four tickets, a split-flap board of the platform sections, a boarding pass. The header rule is a page line with a train that follows the scroll.
- No pinned scroll scene, no marquee, no "one topic, five …" section (the v3 feedback).
- Compare: `node design/serve.mjs 4399` → `/v2/`, `/v3/`, `/v4/` (switch bottom-right on v3 and v4).

## Design v5 — `design/v5/` (v2 + v3 merged, 2026-11-26, awaiting review)

The user's request: *"v2 və v3 qarışığı ilə yeni bir versiya yarat. Hər ikisində daha yaxşı olan konseptləri istifadə et. v3-ün introsu çox maraqlı idi. Maraqlı başqa ideyalar da əlavə edə bilərsən."* Details in [HISTORY.md](HISTORY.md) entry 45 and [design/README.md](../design/README.md):
- From v3: the particle intro hero (with its headline), the before/after slider, the scroll-lit manifesto.
- From v2: the look, the ask box, the stack map, the five facets, the rail, the advantages + comparison, the resume card.
- New: the aurora and grid light up when the particles lock; typed text (or a hovered chip) is drawn by the particles; a click scatters the field; the hero tabs open the matching facet in the demo.
- What is liked so far, in the user's words: v2 as a whole ("çox yaxşı alınıb", "V2 daha yaxşıdır"), v3's intro ("çox maraqlı idi"). Disliked: v3's "Bir mövzu. Beş qat" and running line, v4 as a whole.

**Verdict on v5 (2026-11-26):** *"Biraz qarışıq olub."* — too mixed. Then v6 was requested.

## Design v6 — `design/v6/` ("Liquid glass", 2026-11-26, awaiting review)

The user's request: *"V6 yarat. Introda maraqlı interaktiv animasiya. Əsas səhifə həm çox informativ, həm maraqlı, həm də glass design üslubunda olmalıdır."* Details in [HISTORY.md](HISTORY.md) entry 47 and [design/README.md](../design/README.md):
- One idea ("Proqramlaşdırmanı bir yolda öyrən."), one look (v2's glass; only v2's shell is loaded).
- Hero: WebGL liquid glass refracting the aurora and grid; scattered source drops flow into one form; pointer drop, drag, splash.
- Sections built from real prototype data: roadmap explorer (Go sections → lessons; Backend order), lesson demo + quiz, directions + technologies, platform sections with rollout, comparison, FAQ, resume.
- Performance notes (Intel HD iGPU, Chrome/Windows): background shader compile, one backdrop sample per pixel, adaptive render scale, no live blur or repainting CSS animation over the canvas → ~60 fps.

## Where to continue

1. **Get the user's feedback on v6** (the liquid-glass hero and its interactions, the amount of information, the sections) and record it in [HISTORY.md](HISTORY.md). If v6 is the direction, it becomes the home reference; the Go, roadmap and lesson pages are already in the same (v2) glass language, and v6's roadmap explorer and lesson demo can feed `go.html` / `roadmap.html`.
2. If the user wants another variant instead, one earlier proposal still stands: **"Light editorial"** (light-first, large type, fewer effects). ("Roadmap-first" is what v4 became.)
3. Decide the platform name (`w3hub.dev` / `beststack.dev` / other) — check domain availability.
4. After a variant is approved: move it into `packages/theme` / `apps/site` (Phase 2 module 2: `/`, `/go/roadmap/`, `/roadmaps/backend/`).
5. Known gaps: `design/shared/data.js` says "Massivlər" in the Kolleksiyalar description (term rule); the roadmap opens on the next topic, which may have no sample facet content; check fonts, the aurora, the v3 intro, the v4 map and the v6 liquid glass (drag on touch, frame rate) on a real browser/phone. The Google Fonts stylesheet is render-blocking in every version; on a slow connection it delays the intro scripts.

## Tooling notes

- Server: `node design/serve.mjs 4399` (port 4321 may be taken by the Astro dev server).
- Visual checks were done in headless Chrome over CDP (waiting for reveal animations, scrolling, screenshots at 1440 dark/light and 390px); reveal animations need a real scroll or they stay hidden in screenshots.
- The `gh` CLI is not installed, so pull requests are opened from the compare link.
