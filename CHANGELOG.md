# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- pnpm workspace with Astro site skeleton, TypeScript, ESLint, Prettier, commitlint and lefthook git hooks.
- GitHub Actions workflow: lint, format check, type check, build, and a pull request title check.
- Go technology page `/go/` and lesson pages `/go/<slug>/` (Shiki highlighting, two-way explanation ↔ code highlighting, memory visual, quiz, view modes).
- Lesson content format with `pnpm content:check`.
- All 84 Go lessons, original and in Azerbaijani, in 9 sections.
- `pnpm content:go` and the CI job `go-lessons`: every Go lesson passes `gofmt` and `go vet`, and its output matches `output.txt` (on Linux, so Unix-only lessons are covered).
- Full-text search over lesson pages (Pagefind) in the `Ctrl+K` palette, with excerpts below the title matches.
- "Redaktə" (CodeMirror 6, loaded on demand), "Sıfırla" and "İşə sal" on Go lessons; `/api/run` proxies the Go Playground (Cloudflare Pages Function, also served by `astro dev`).
- Static design prototype (`design/`): platform home, Go page, roadmap page and lesson page (Variant D); variants A–C archived.

[Unreleased]: https://github.com/seymur-orucov/go-by-example-az/commits/main
