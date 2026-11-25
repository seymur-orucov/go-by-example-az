# References

## Source content

| Link | Note |
|---|---|
| https://gobyexample.com | Primary source. Authors: Mark McGranaghan, Eli Bendersky |
| https://github.com/mmcgrana/gobyexample | Original repo (example code and explanations) |
| https://creativecommons.org/licenses/by/3.0/ | Content license (CC BY 3.0) |
| https://go.dev/doc/ | Official Go documentation — for terminology and verification |
| https://go.dev/play/ | Go Playground — fallback for running code |

## Roadmap sources

The platform's concrete roadmaps (Go, Backend, etc.) will be refined based on a **merge** of these two resources. Topics, ordering and dependencies are taken from them. Texts are taken from these resources and translated when the user marks them, but publishing requires the author's consent ([DECISIONS.md](DECISIONS.md#vision-2026-11-23)).

| Resource | Used for | License |
|---|---|---|
| https://roadmap.sh | Technology and direction roadmaps (e.g. Go, Backend): topic list, ordering, recommended / alternative paths | Custom license ([`license` in the repo](https://github.com/kamranahmedse/developer-roadmap/blob/master/license)): personal use only; prior consent required for publishing |
| https://itbooster.ru/ | Course and topic structure, combining theory with practice | No open license stated — all rights reserved by default |

## Interview and algorithms sources

Sources for the interview preparation, system design and algorithms sections of the platform. The same rule as for the roadmap sources applies: topics, coverage and ordering are used as a reference; texts are translated only when the user marks them, kept in `content-private/`, and published only after the author's written consent ([DECISIONS.md](DECISIONS.md#vision-2026-11-23)).

| Resource | Used for | License |
|---|---|---|
| https://www.hellointerview.com/ | Interview preparation: system design, DSA, behavioral, low-level design; interview question formats; mock interview flow | All rights reserved ([terms](https://www.hellointerview.com/terms), checked 2026-11-23): copying, publishing and derivative works are prohibited without permission |
| https://www.greatfrontend.com/ | Front-end interview preparation and practice: JavaScript/TypeScript and UI coding questions, system design for front-end, quizzes; study plans and progress. Added 2026-11-23 for both **content** (topics, question formats) and **design** (see below) | **Not verified yet** — the terms page could not be fetched on 2026-11-23 (HTTP 429). Until checked, treat as all rights reserved: use topics and structure as a reference only; no text is copied |
| https://yeahub.ru/ | Interview preparation by specialization (Frontend, Python/Java/Node.js/Golang Backend, QA…): a question base filterable by skill, difficulty and popularity; flashcard-style quiz trainer (new / review modes) with a progress tracker; interview tasks in an in-browser editor; real-interview write-ups per company. Added 2026-11-24 for both **content** (topic and question structure) and **design/UX** (what to take is decided by Claude per platform section, see [DECISIONS.md](DECISIONS.md#vision-2026-11-23)) | **No reuse license found** (checked 2026-11-24: homepage and docs page; `/terms` is 404). The homepage calls the project "open" — source on [GitHub](https://github.com/YeaHubTeam/yeahub-platform) and design in Figma are open for viewing, which is **not** a content license. The public offer (Google Docs, linked from `/ru/docs`) is not read yet. Treat as all rights reserved: structure and ideas only; no text is copied |
| https://algomaster.io/ | Algorithms and data structures: DSA patterns and their ordering; system design, LLD, concurrency; animated explanations | All rights reserved ([terms](https://algomaster.io/policies/terms-of-service), checked 2026-11-23): content is the exclusive property of AlgoMasterIO LLC, no reuse rights granted |

## Design references

Sites sent by the user. The design must **not copy them**; the liked part of each is taken.

| Site | What was liked / taken | What was not liked |
|---|---|---|
| https://frontscope.dev/ | Visualizations: step player, memory visual; scroll animations; the "Don't read — see." style | Fonts (Syne), yellow/lime color; variant B ended up too similar to it |
| https://roadmap.sh/ | Simple and compact; dense tile grid; roadmap view (central line + branches); statuses (learned / next / upcoming) | — |
| https://itbooster.ru/ | Interesting structure; code-style section labels (`features.Why()`); bento cards; scroll-spy dots | — |
| https://www.greatfrontend.com/ | Added 2026-11-23 as a **design and UX reference** for the practice side: coding questions with an in-browser editor and live preview, study plans, progress tracking. What exactly to take is still to be agreed with the user; to be verified on the live site | — |
| https://yeahub.ru/ | Added 2026-11-24 as a **design and UX reference** for interview preparation: per-specialization hubs, question lists with filters, flashcard trainer with progress, real-interview collections. Claude decides which part to take for which section | — |
| Stripe / Linear (general style) | Variant A's clean, editorial look | — |
| The "FOCUS" image sent by the user | For the animated background: dark blue → purple soft gradient, slow movement | — |

## Technologies (Phase 2+)

| Tool | Link | Purpose |
|---|---|---|
| Astro | https://astro.build | Static site framework, Content Collections |
| Shiki | https://shiki.style | Build-time syntax highlighting |
| Pagefind | https://pagefind.app | Static search index |
| CodeMirror 6 | https://codemirror.net | In-browser code editor (lazy-loaded) |
| Cloudflare Pages | https://pages.cloudflare.com | Hosting, PR previews, Pages Functions (`/api/run`) |
| GitHub Actions + setup-go | https://github.com/actions/setup-go | CI: verifying examples |
| Go compile API | `https://go.dev/_/compile` | Running code (no CORS → proxy needed) |

## Engineering conventions

| Standard | Link |
|---|---|
| Conventional Commits 1.0 | https://www.conventionalcommits.org/en/v1.0.0/ |
| GitHub Flow | https://docs.github.com/en/get-started/using-github/github-flow |
| Semantic Versioning | https://semver.org/ |
| Keep a Changelog | https://keepachangelog.com/ |
| EditorConfig | https://editorconfig.org/ |
| pnpm workspaces | https://pnpm.io/workspaces |

## Fonts

| Font | Link | Note |
|---|---|---|
| Inter | https://fonts.google.com/specimen/Inter | Text; has Azerbaijani letters |
| JetBrains Mono | https://fonts.google.com/specimen/JetBrains+Mono | Code; ligatures disabled |

## Design v2 references (2026-11-25)

Visual and UX references supplied by the user for design v2 (no text or assets copied). Full brief and the mapping of each reference image: [DESIGN-V2.md](DESIGN-V2.md).

| Reference | Used for |
|---|---|
| https://itbooster.ru/ and https://roadmap.sh | Home page structure and UX (path choice, roadmap graph, sections) — structure only |
| Five user-supplied images (glass login cards with icon row, light-ribbon brand backdrop, 3D glass feature cards, glowing prompt box, workflow node graph) | Visual language "Aurora glass" |
