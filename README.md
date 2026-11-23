# Nümunələrlə Go

_"Go by Example" in Azerbaijani._ An Azerbaijani-language alternative to [Go by Example](https://gobyexample.com) with a modern design and simpler examples.

Each topic consists of a short explanation, working code and a step-by-step visual. Explanation and code highlight each other: hovering an explanation step highlights the matching code lines, and hovering code lines highlights the matching explanation step.

## Main goal

"Nümunələrlə Go" is **the first prototype**. The end goal is a **unified learning platform** in the spirit of [roadmap.sh](https://roadmap.sh) and [itbooster.ru](https://itbooster.ru):

- Developers follow **the right roadmap**: they see what to learn and in which order.
- Every roadmap step offers both **theory** (short, clear explanations) and **practice** (working examples, exercises, "Check yourself" questions) from the same resource.
- **All technologies live on one site** (Go, Python, Rust, TypeScript, SQL…); no separate sites are created.
- Learners choose by **technology** (Go, Python…) or by **direction** (Backend, Frontend…).
- Beyond lessons, the platform will offer **tests/quizzes**, **interview preparation** (including system design), **algorithms and data structures**, **live coding** and **visual code explanations**.
- The primary language is **Azerbaijani**. Other languages are added only after a quality translation of the existing content.

The Go prototype exists to validate the platform's design, lesson format and content model. Details: [docs/ROADMAP.md](docs/ROADMAP.md#vision-learning-platform).

## Current status

**Phase 1 — Design.** A framework-free static HTML/CSS prototype is ready. There are four variants; the user chose **Variant D** and iteration on it is ongoing. Details: [docs/ROADMAP.md](docs/ROADMAP.md).

## Running the prototype

Requires Node.js 18+, no other dependencies:

```powershell
git clone https://github.com/seymur-orucov/go-by-example-az.git
cd go-by-example-az
node design/serve.mjs
```

Then open in a browser:

| URL | What's there |
|---|---|
| http://localhost:4321/d/ | **Variant D** — the chosen design (platform home page) |
| http://localhost:4321/d/go.html | Variant D — Go technology page |
| http://localhost:4321/d/example.html | Variant D — lesson page (pilot: Slices) |
| http://localhost:4321/, `/b/`, `/c/` | Variants A, B, C — kept for comparison |

The **Variant A | B | C | D** switch in the bottom-right corner moves between variants of the same page.

## Documentation

| File | Contents |
|---|---|
| [docs/ROADMAP.md](docs/ROADMAP.md) | Phases: what's done, current work, next steps |
| [docs/HISTORY.md](docs/HISTORY.md) | Work log: what was requested and done in each iteration |
| [docs/DECISIONS.md](docs/DECISIONS.md) | Agreed decisions (technical, design, content) and their rationale |
| [docs/REFERENCES.md](docs/REFERENCES.md) | Reference sites, what was taken from each, technologies |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Branches, commit messages (Conventional Commits), pull requests, language rules |
| [design/README.md](design/README.md) | Prototype files and a detailed description of the design variants |
| [CLAUDE.md](CLAUDE.md) | Short instructions for continuing with Claude Code |

## Directory layout

```
design/          Phase 1: static design prototype (variants A, B, C, D)
docs/            Plan, history, decisions, references
.github/         Pull request and issue templates
.claude/         Preview server configuration for Claude Code
```

From Phase 2 an Astro monorepo will be added (`apps/site`, `packages/theme`, `content/<technology>/`, `content/roadmaps/`). Plan: [docs/ROADMAP.md](docs/ROADMAP.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). In short: work on a branch, use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/), open a pull request.

## License and attribution

- **Code** is licensed under the [MIT License](LICENSE).
- **Learning content** is licensed under [CC BY 3.0](LICENSE-CONTENT). It is based on the [Go by Example](https://gobyexample.com) project by Mark McGranaghan and Eli Bendersky, adapted to Azerbaijani and simplified; the original content is shared under the same license.

The Go name belongs to Google LLC.
