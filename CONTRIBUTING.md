# Contributing

Thank you for helping! This project follows widely used open source conventions. Please read this short guide before opening a pull request.

## Languages

| What | Language |
|---|---|
| Code, identifiers, code comments | English |
| Technical docs (`README.md`, `docs/`, this file) | English |
| Commit messages, branch names, PR and issue titles/descriptions | English |
| Site UI text and learning content | **Azerbaijani** |
| Programming terms inside Azerbaijani content | English (`slice`, `goroutine`), with a short explanation on first use |

Azerbaijani is the primary language of the site. Other languages are added only after a quality, reviewed translation of the existing content.

## Workflow (GitHub Flow)

1. `main` is always deployable. Never push to it directly.
2. Create a short-lived branch from `main`:

   | Prefix | For |
   |---|---|
   | `feat/` | new functionality (`feat/lesson-zen-mode`) |
   | `fix/` | bug fixes (`fix/sidebar-scroll`) |
   | `docs/` | documentation only |
   | `refactor/` | code changes that neither fix a bug nor add a feature |
   | `chore/` | tooling, config, dependencies |

   Use lowercase kebab-case after the prefix.
3. Commit using Conventional Commits (below).
4. Open a pull request, fill in the template, and wait for review.
5. PRs are merged with **squash merge**; the PR title becomes the commit message, so it must follow Conventional Commits too.

## Commit messages

We use [Conventional Commits 1.0](https://www.conventionalcommits.org/en/v1.0.0/):

```
<type>(<optional scope>): <subject>

<optional body: what and why, wrapped at 72 chars>

<optional footer: BREAKING CHANGE: …, Refs #123>
```

- **Subject:** imperative mood ("add", not "added"/"adds"), lowercase, no trailing period, ≤ 72 characters.
- **Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- **Scopes:** `design`, `site`, `theme`, `content`, `docs`, `ci`, `deps`.
- Breaking changes: `feat(site)!: …` and a `BREAKING CHANGE:` footer.

Examples:

```
feat(design): add animated gradient background to the home page
fix(design): keep sidebar state after reload
docs(roadmap): mark phase 1 palette task as done
chore: add editorconfig and gitattributes
```

From Phase 2 commit messages are checked automatically (commitlint).

## Versioning

[Semantic Versioning](https://semver.org/) with a `CHANGELOG.md` in the [Keep a Changelog](https://keepachangelog.com/) format, starting with the first release.

## Formatting

- The repository uses [EditorConfig](https://editorconfig.org/): UTF-8, LF line endings, 2-space indentation (tabs for Go). Install the EditorConfig plugin for your editor if it doesn't support it natively.
- Line endings are normalized to LF by `.gitattributes`. On Windows, `core.autocrlf=false` is recommended.
- From Phase 2: Prettier + ESLint, run before committing.

## Running the project

Current phase (design prototype) — Node.js 18+, no dependencies:

```sh
node design/serve.mjs   # http://localhost:4321/d/
```

From Phase 2 the project uses **pnpm** workspaces:

```sh
corepack enable
pnpm install
pnpm dev
```

## Design prototype rules

- The chosen variant is **D** (`design/d/`); A, B, C are kept for comparison only.
- D reuses shared files (`design/app.js`, `design/data.js`, `design/b/b.js`, `design/c/c.js`, `design/c/style.css`); changing them affects A–C.
- Every animation must be disabled under `prefers-reduced-motion`.
- Check both dark and light themes and narrow screens.

## Third-party content

Text from roadmap.sh, itbooster.ru, hellointerview.com, algomaster.io and greatfrontend.com is **not** openly licensed. Topics and ordering may be used as a reference, but their texts must not be committed or published without the author's written consent recorded in [docs/DECISIONS.md](docs/DECISIONS.md). Translations awaiting consent live in `content-private/`, which is ignored by git.

## License

By contributing, you agree that code is licensed under the [MIT License](LICENSE) and learning content under [CC BY 3.0](LICENSE-CONTENT).
