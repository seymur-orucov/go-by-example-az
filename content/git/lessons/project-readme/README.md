<!-- @step title -->
# tidy-photos

[![Tests](https://github.com/sam-lee/tidy-photos/actions/workflows/test.yml/badge.svg)](https://github.com/sam-lee/tidy-photos/actions/workflows/test.yml)
![License: MIT](https://img.shields.io/badge/license-MIT-blue)

Sort photos into folders by the date they were taken.

<!-- @step about -->
## Why

Phones and cameras name photos like `IMG_4031.jpg`.
After a few trips one folder holds thousands of them.
`tidy-photos` reads the date stored inside each photo
and moves it into a folder like `2024-06-15`.

- works offline
- never deletes a file
- `--dry-run` shows the plan without moving anything

<!-- @step install -->
## Installation

You need Go 1.22 or newer.

```bash
go install github.com/sam-lee/tidy-photos@latest
```

Check that it works:

```bash
tidy-photos --version
```

<!-- @step usage -->
## Usage

```bash
tidy-photos ~/Pictures/phone --into ~/Pictures/sorted
```

Example output:

```text
Found 214 photos
Moved 209 photos into 37 folders
Skipped 5 files without a date
```

<!-- @step contributing -->
## Contributing

Found a bug? Open an [issue](https://github.com/sam-lee/tidy-photos/issues).
Read [CONTRIBUTING.md](CONTRIBUTING.md) before you send a pull request.

## License

MIT, see [LICENSE](LICENSE).
