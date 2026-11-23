# Instructions for Claude Code

Project: **Nümunələrlə Go** — an Azerbaijani-language alternative to gobyexample.com. Overview: [README.md](README.md).

**Main goal:** this is the first prototype. The end goal is a unified learning platform in the spirit of roadmap.sh / itbooster.ru: learning by roadmap, theory + practice at every step, all technologies on one site. Structural and technical decisions must fit that goal (e.g. routes `/<technology>/...`, content in `content/<technology>/`). Details: [docs/ROADMAP.md](docs/ROADMAP.md#vision-learning-platform).

## Read before starting
1. [docs/ROADMAP.md](docs/ROADMAP.md) — which phase we're in, what's left, "Where to start next session".
2. [docs/DECISIONS.md](docs/DECISIONS.md) — agreed decisions; don't reopen them for discussion.
3. [docs/HISTORY.md](docs/HISTORY.md) — the user's earlier feedback (what they liked, what they rejected).

## Rules
- Talk to the user in **Azerbaijani**. All site UI text is in Azerbaijani; Go terms stay in English.
- The current phase is a **design prototype**: `design/` is framework-free static HTML/CSS/JS — don't add dependencies.
- The chosen variant is **D** (`design/d/`). A, B, C exist only for comparison — don't touch them.
- D reuses shared files: `design/app.js`, `design/data.js`, `design/b/b.js`, `design/c/c.js`, `design/c/style.css` (D's `style.css` imports it). Changing them also affects A–C.
- Animations must be disabled under `prefers-reduced-motion`.
- Take text from roadmap.sh / itbooster.ru only when the user marks it, then translate it; write the result to `content-private/` (not tracked by git). Unless the author's consent is recorded in [DECISIONS.md](docs/DECISIONS.md), don't commit these texts to the public repo or put them on the site.
- After each iteration add a short entry to `docs/HISTORY.md` and update the checkboxes in `docs/ROADMAP.md`.

## Running the prototype
```
node design/serve.mjs        # http://localhost:4321/d/
```
Preview configuration: `.claude/launch.json` (name: `design`). The server sends a `no-store` header, but if the browser shows a stale file, do a hard reload.

## Environment
Windows, Node 22. Go is not installed locally.
