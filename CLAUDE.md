# Instructions for Claude Code

Project: **Nümunələrlə Go** — an Azerbaijani-language alternative to gobyexample.com. Overview: [README.md](README.md).

**Main goal:** the Go site is the first release. The end goal is a unified learning platform in the spirit of roadmap.sh / itbooster.ru: learning by roadmap, theory + practice at every step, all technologies on one site. Structural and technical decisions must fit that goal (e.g. routes `/<technology>/...`, content in `content/<technology>/`). Details: [docs/ROADMAP.md](docs/ROADMAP.md#vision-learning-platform).

## Read before starting
1. [docs/ROADMAP.md](docs/ROADMAP.md) — which phase we're in, what's left, "Where to start next session".
2. [docs/DECISIONS.md](docs/DECISIONS.md) — agreed decisions; don't reopen them for discussion.
3. [docs/HISTORY.md](docs/HISTORY.md) — the user's earlier feedback (what they liked, what they rejected).

## Rules
- Talk to the user in **Azerbaijani**. All site UI text is in Azerbaijani; Go terms stay in English.
- Phase 2 is the **project skeleton**: the real site lives in `apps/` and `packages/` (pnpm workspace, Astro, TypeScript). `design/` is the **frozen, framework-free prototype** and the visual reference — don't add dependencies to it and don't change it, except to fix the reference itself.
- The chosen variant is **D** (`design/d/`). A, B, C are archived in `design/archive/` — don't touch them.
- D uses shared files in `design/shared/`: `app.js`, `data.js`, `b.js`, `c.js`, `base.css` (D's `style.css` imports `base.css`). The archived variants load them too, so changing them also affects A–C.
- Animations must be disabled under `prefers-reduced-motion`.
- Code, comments, docs, commit messages, branch names and PR descriptions are in **English**. Site UI text and learning content stay in Azerbaijani.
- Git: never commit to `main` directly — create a branch (`feat/…`, `fix/…`, `docs/…`, `chore/…`). Commit messages follow **Conventional Commits** (`docs(roadmap): …`, `feat(design): …`). Push and open PRs only after the user confirms. **Group work into module PRs** (one PR per theme, several commits) instead of one PR per small change. Details: [CONTRIBUTING.md](CONTRIBUTING.md).
- Package manager is **pnpm** (not npm/yarn). Never edit `pnpm-lock.yaml` by hand. Git hooks (lefthook) run Prettier + ESLint on staged files and commitlint on the message — fix the cause, don't bypass them.
- Take text from roadmap.sh / itbooster.ru / hellointerview.com / algomaster.io / greatfrontend.com only when the user marks it, then translate it; write the result to `content-private/` (not tracked by git). Unless the author's consent is recorded in [DECISIONS.md](docs/DECISIONS.md), don't commit these texts to the public repo or put them on the site.
- After each iteration add a short entry to `docs/HISTORY.md` and update the checkboxes in `docs/ROADMAP.md`.

## Layout
```
apps/site/        Astro site (static)
packages/theme/   shared tokens, CSS, components (module 2)
content/          learning content: content/<technology>/, content/roadmaps/ (module 2)
design/           frozen design prototype (d/ = chosen variant, archive/ = A–C)
```

## Running the project
```
pnpm install                 # first run also downloads Node 24 (see Environment)
pnpm dev                     # Astro dev server
pnpm lint && pnpm format:check && pnpm check && pnpm build   # what CI runs
node design/serve.mjs        # design prototype: http://localhost:4321/d/
```
Preview configuration: `.claude/launch.json` (name: `design`). The server sends a `no-store` header, but if the browser shows a stale file, do a hard reload.

## Environment
Windows. System Node is 22.13, but Astro 7 needs Node >= 22.23.4, so `package.json` pins Node 24 through `devEngines.runtime` — pnpm downloads it automatically and uses it for every `pnpm` script (plain `node` in a terminal is still the system one). Go 1.26 is installed locally (used to verify the examples). TypeScript is held at 6.0.x because `typescript-eslint` does not support 7 yet.
