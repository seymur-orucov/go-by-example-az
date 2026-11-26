// Builds and runs every Go lesson and compares what it prints with its `output.txt`.
// Usage from the repo root: `pnpm content:go` (all lessons), `pnpm content:go slices maps`
// (some), `pnpm content:go --write <slug>` (regenerate the `output.txt` of those lessons).
//
// Each lesson must pass `gofmt -l` and `go vet`. The program runs in an empty temporary
// directory with GOTRACEBACK=none; stdout and stderr go to one file, in the order they were
// written, as `output.txt` shows them. Lessons that need Unix are skipped on Windows, so CI
// (Linux) is where they are checked.
import { spawnSync } from "node:child_process";
import {
  closeSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  openSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { CONTENT_ROOT } from "../src/lib/lesson.ts";

const EXAMPLES = join(CONTENT_ROOT, "go", "examples");
const TIMEOUT_MS = 60_000;

/** Lessons that end with a non-zero exit code on purpose. */
const EXIT_CODES: Record<string, number> = {
  panic: 2, // an unrecovered panic
  exit: 1, // os.Exit with the failed backup's code
};

/** `syscall.Exec` always fails on Windows. */
const UNIX_ONLY = new Set(["execing-processes"]);

const normalize = (s: string) => s.replace(/\r\n/g, "\n");

function go(args: string[], cwd: string): { ok: boolean; out: string } {
  const r = spawnSync("go", args, { cwd, encoding: "utf8" });
  if (r.error) throw r.error;
  return { ok: r.status === 0, out: normalize(`${r.stdout}${r.stderr}`).trim() };
}

/** The first differing line, for a short report. */
function firstDiff(want: string, got: string): string {
  const w = want.split("\n");
  const g = got.split("\n");
  for (let i = 0; i < Math.max(w.length, g.length); i++) {
    if (w[i] !== g[i]) {
      return `line ${i + 1}\n  want: ${JSON.stringify(w[i] ?? "<end>")}\n  got:  ${JSON.stringify(g[i] ?? "<end>")}`;
    }
  }
  return "";
}

/** Returns the lesson's problems; an empty list when it is fine. */
function checkLesson(slug: string, write: boolean): string[] {
  const dir = join(EXAMPLES, slug);
  const problems: string[] = [];

  const unformatted = spawnSync("gofmt", ["-l", "."], { cwd: dir, encoding: "utf8" });
  if (unformatted.error) throw unformatted.error;
  if (unformatted.stdout.trim()) problems.push(`gofmt: ${unformatted.stdout.trim()}`);

  const vet = go(["vet", "main.go"], dir);
  if (!vet.ok) problems.push(`go vet:\n${vet.out}`);

  const tmp = mkdtempSync(join(tmpdir(), `go-${slug}-`));
  try {
    const exe = join(tmp, process.platform === "win32" ? "lesson.exe" : "lesson");
    const build = go(["build", "-o", exe, "main.go"], dir);
    if (!build.ok) return [...problems, `go build:\n${build.out}`];

    const work = join(tmp, "work");
    const outFile = join(tmp, "out.txt");
    mkdirSync(work);
    const fd = openSync(outFile, "w");
    const run = spawnSync(exe, [], {
      cwd: work,
      stdio: ["ignore", fd, fd],
      timeout: TIMEOUT_MS,
      env: { ...process.env, GOTRACEBACK: "none" },
    });
    closeSync(fd);
    if (run.error) return [...problems, `run: ${run.error.message}`];

    const wantCode = EXIT_CODES[slug] ?? 0;
    if (run.status !== wantCode) problems.push(`exit code ${run.status}, want ${wantCode}`);

    const got = normalize(readFileSync(outFile, "utf8"));
    const wantPath = join(dir, "output.txt");
    if (write) {
      writeFileSync(wantPath, got);
    } else if (!existsSync(wantPath)) {
      problems.push("output.txt is missing (run with --write to create it)");
    } else {
      const want = normalize(readFileSync(wantPath, "utf8"));
      if (want !== got) problems.push(`output differs from output.txt at ${firstDiff(want, got)}`);
    }
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
  return problems;
}

const args = process.argv.slice(2);
const write = args.includes("--write");
const wanted = args.filter((a) => !a.startsWith("--"));
const all = readdirSync(EXAMPLES).filter((d) => existsSync(join(EXAMPLES, d, "main.go")));
for (const w of wanted) if (!all.includes(w)) throw new Error(`No Go lesson "${w}"`);
const slugs = wanted.length ? wanted : all;

let failed = 0;
let skipped = 0;
for (const slug of slugs) {
  if (process.platform === "win32" && UNIX_ONLY.has(slug)) {
    skipped++;
    console.log(`- ${slug}: skipped (needs Unix, checked in CI)`);
    continue;
  }
  const problems = checkLesson(slug, write);
  if (problems.length) {
    failed++;
    console.log(`✗ ${slug}`);
    for (const p of problems) console.log(`  ${p.replace(/\n/g, "\n  ")}`);
  } else if (write) {
    console.log(`✓ ${slug}: output.txt written`);
  }
}
const ran = slugs.length - skipped;
console.log(`${ran - failed}/${ran} Go lessons OK${skipped ? `, ${skipped} skipped` : ""}`);
if (failed) process.exit(1);
