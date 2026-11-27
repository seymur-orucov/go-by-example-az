// Runs terminal-session lessons and records what happened: `session.json` (every command's
// output, the repository state after each step) and `output.txt` (the visible transcript).
// Usage from the repo root: `pnpm content:run` (all) or `pnpm content:run git/three-areas`.
//
// The sandbox: a fresh temporary HOME (shown as /home/sam), no system or user Git config, a fixed
// author and a clock that ticks one minute per command — so commit hashes are the same on every
// machine with the same Git version. Inherited GIT_* variables are dropped (hooks set them).
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { CONTENT_ROOT } from "../src/lib/lesson.ts";
import {
  parseSession,
  transcript,
  type AreasFrame,
  type GraphFrame,
  type SessionFile,
} from "../src/lib/session.ts";

const SHOWN_HOME = "/home/sam";
const START = Date.UTC(2026, 0, 15, 9, 0, 0) / 1000;
const GITCONFIG = `[user]
	name = Sam Lee
	email = sam@example.com
[init]
	defaultBranch = main
[core]
	autocrlf = false
	pager = cat
	editor = false
[color]
	ui = never
`;

/** Git for Windows ships its own bash; plain `bash` on PATH may be WSL's. */
function findBash(): string {
  if (process.platform !== "win32") return "bash";
  const exec = spawnSync("git", ["--exec-path"], { encoding: "utf8" }).stdout.trim();
  // <git>/mingw64/libexec/git-core -> <git>/bin/bash.exe
  const bash = resolve(exec, "..", "..", "..", "bin", "bash.exe");
  if (!existsSync(bash)) throw new Error(`Git Bash not found at ${bash}`);
  return bash;
}

/** Every spelling of `dir` a tool may print: native, forward slashes, MSYS (/c/...). */
function spellings(dir: string): string[] {
  const fwd = dir.replace(/\\/g, "/");
  const msys = fwd.replace(/^([A-Za-z]):/, (_, d: string) => `/${d.toLowerCase()}`);
  return [...new Set([dir, fwd, msys])].sort((a, b) => b.length - a.length);
}

function runLesson(dir: string, bash: string): void {
  const name = dir.slice(CONTENT_ROOT.length + 1).replace(/\\/g, "/");
  const { commands, steps } = parseSession(readFileSync(join(dir, "session.sh"), "utf8"));
  const root = realpathSync(mkdtempSync(join(tmpdir(), "lesson-")));
  const home = join(root, "sam");
  mkdirSync(home);
  writeFileSync(join(home, ".gitconfig"), GITCONFIG);

  const baseEnv: NodeJS.ProcessEnv = {};
  for (const [k, v] of Object.entries(process.env)) if (!/^GIT_/i.test(k)) baseEnv[k] = v;
  Object.assign(baseEnv, {
    HOME: home,
    USERPROFILE: home,
    GIT_CONFIG_NOSYSTEM: "1",
    GIT_TERMINAL_PROMPT: "0",
    LC_ALL: "C",
    LANG: "C",
    TZ: "UTC",
  });

  const paths = spellings(home);
  const clean = (s: string) => {
    let out = s.replace(/\r\n/g, "\n");
    // Progress messages ("Rebasing (1/2)\rRebasing (2/2)\r…") overwrite each other in a
    // terminal: keep what the reader would see, the text after the last carriage return.
    out = out
      .split("\n")
      .map((l) => l.slice(l.lastIndexOf("\r") + 1))
      .join("\n");
    for (const p of paths) out = out.split(p).join(SHOWN_HOME);
    return out;
  };
  const git = (cwd: string, args: string[]) =>
    spawnSync("git", args, { cwd, env: baseEnv, encoding: "utf8" });

  let cwd = home;
  const recorded: SessionFile["commands"] = [];
  const frames: SessionFile["frames"] = {};
  try {
    commands.forEach((c, i) => {
      const cd = /^cd\s+(\S+)$/.exec(c.cmd);
      if (cd) {
        const target = cd[1]!.replace(/^~(?=\/|$)/, home);
        cwd = resolve(cwd, target);
        if (!existsSync(cwd)) throw new Error(`${name}: cd ${cd[1]}: no such directory`);
        recorded.push({ ...c, out: "", exit: 0 });
      } else {
        const date = `${START + i * 60} +0000`;
        const env = { ...baseEnv, GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date };
        const r = spawnSync(bash, ["-c", `{ ${c.cmd}\n} 2>&1`], { cwd, env, encoding: "utf8" });
        const exit = r.status ?? 1;
        if (exit !== 0 && !c.fail) {
          throw new Error(
            `${name}: "${c.cmd}" exited with ${exit} (mark it #@fail if that is the point)\n${r.stdout}`,
          );
        }
        if (exit === 0 && c.fail)
          throw new Error(`${name}: "${c.cmd}" is marked #@fail but succeeded`);
        recorded.push({ ...c, out: clean(r.stdout), exit });
      }
      // Record the repository after the last command of each step.
      const next = commands[i + 1];
      if (c.step && next?.step !== c.step) {
        frames[c.step] = { areas: snapshot(cwd), graph: graphSnapshot(cwd) };
      }
    });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }

  for (const s of steps) frames[s.id] ??= { areas: null, graph: null };
  const file: SessionFile = {
    generatedBy: "pnpm content:run",
    git: git(process.cwd(), ["--version"])
      .stdout.trim()
      .replace(/^git version /, ""),
    commands: recorded,
    frames,
  };
  writeFileSync(join(dir, "session.json"), JSON.stringify(file, null, 2) + "\n");
  writeFileSync(join(dir, "output.txt"), transcript(recorded) + "\n");
  console.log(`ok   ${name} (${recorded.length} commands, git ${file.git})`);

  function snapshot(at: string): AreasFrame | null {
    if (git(at, ["rev-parse", "--is-inside-work-tree"]).stdout.trim() !== "true") return null;
    const lines = (args: string[]) =>
      git(at, args)
        .stdout.split("\0")
        .filter((l) => l !== "");

    // XY codes: X = index vs HEAD, Y = working directory vs index.
    const status = new Map<string, string>();
    for (const l of lines(["status", "--porcelain=v1", "-z", "-uall", "--ignored"])) {
      status.set(l.slice(3), l.slice(0, 2));
    }
    const tracked = lines(["ls-files", "-z"]);
    const head = git(at, ["rev-parse", "--verify", "-q", "HEAD"]).status === 0;

    const work: AreasFrame["work"] = [];
    const names = new Set([...tracked, ...status.keys()]);
    // A merge conflict leaves one of these codes until the file is resolved and added.
    const UNMERGED = new Set(["DD", "AU", "UD", "UA", "DU", "AA", "UU"]);
    for (const n of [...names].sort()) {
      const xy = status.get(n) ?? "  ";
      const y = xy[1];
      const state = UNMERGED.has(xy)
        ? "unmerged"
        : xy === "??"
          ? "untracked"
          : xy === "!!"
            ? "ignored"
            : y === "M"
              ? "modified"
              : y === "D"
                ? "deleted"
                : xy[0] === "D"
                  ? null // removed from the index and the working directory
                  : "clean";
      if (state) work.push({ name: n, state });
    }

    const index: AreasFrame["index"] = [];
    for (const n of [...names].sort()) {
      const xy = status.get(n) ?? "  ";
      if (xy === "??" || xy === "!!") continue;
      const x = xy[0];
      const state = UNMERGED.has(xy)
        ? "unmerged"
        : x === "A"
          ? "added"
          : x === "M"
            ? "modified"
            : x === "D"
              ? "deleted"
              : "clean";
      index.push({ name: n, state });
    }

    let repo: AreasFrame["repo"] = { commit: null, count: 0, files: [] };
    if (head) {
      const [hash, message] = git(at, ["log", "-1", "--format=%h%x00%s"]).stdout.trim().split("\0");
      repo = {
        commit: { hash: hash!, message: message ?? "" },
        count: Number(git(at, ["rev-list", "--count", "HEAD"]).stdout.trim()),
        files: lines(["ls-tree", "-r", "-z", "--name-only", "HEAD"]).sort(),
      };
    }
    return { work, index, repo };
  }

  /**
   * The commit graph: commits reachable from branches, tags, remote-tracking branches and HEAD,
   * with Git's short hashes. `remotes` is left out when there are none, so lessons without a
   * remote record the same frame as before.
   */
  function graphSnapshot(at: string): GraphFrame | null {
    if (git(at, ["rev-parse", "--is-inside-work-tree"]).stdout.trim() !== "true") return null;
    const out = (args: string[]) => git(at, args).stdout;
    const headTarget = git(at, ["rev-parse", "--verify", "-q", "HEAD"]).stdout.trim() || null;
    const headBranch = git(at, ["symbolic-ref", "-q", "--short", "HEAD"]).stdout.trim() || null;

    // An annotated tag points to a tag object; %(*objectname) is the commit behind it.
    const refs = out([
      "for-each-ref",
      "--format=%(refname)%00%(objectname)%00%(*objectname)",
      "refs/heads",
      "refs/tags",
      "refs/remotes",
    ])
      .split("\n")
      .filter((l) => l !== "")
      .map((l) => {
        const [name, obj, peeled] = l.split("\0");
        return { name: name!, target: peeled || obj! };
      })
      // `origin/HEAD` only names the server's default branch, which has its own ref.
      .filter((r) => !(r.name.startsWith("refs/remotes/") && r.name.endsWith("/HEAD")));
    const tips = [...new Set([...refs.map((r) => r.target), ...(headTarget ? [headTarget] : [])])];
    if (!tips.length) {
      return { commits: [], branches: [], tags: [], head: { branch: headBranch, target: null } };
    }

    // Full hashes inside, Git's own short spelling in the frame.
    const log = out(["log", "--topo-order", "--format=%H%x00%h%x00%P%x00%s", ...tips, "--"])
      .split("\n")
      .filter((l) => l !== "")
      .map((l) => {
        const [full, short, parents, message] = l.split("\0");
        return {
          full: full!,
          short: short!,
          parents: parents ? parents.split(" ") : [],
          message: message ?? "",
        };
      });
    const short = new Map(log.map((c) => [c.full, c.short]));
    const abbrev = (h: string) => short.get(h) ?? h.slice(0, 7);

    type FileState = GraphFrame["commits"][number]["files"][number]["state"];
    const STATE: Record<string, FileState> = { A: "added", M: "modified", D: "deleted" };
    const commits: GraphFrame["commits"] = log.map((c) => {
      // What changed against the first parent (everything is new in a root commit).
      const changed = new Map<string, string>();
      const diff = c.parents.length
        ? ["diff-tree", "-r", "-z", "--name-status", c.parents[0]!, c.full]
        : ["diff-tree", "-r", "-z", "--name-status", "--root", c.full];
      const parts = out(diff)
        .split("\0")
        .filter((p) => p !== "");
      // With --root the commit's own hash comes first; then status and path pairs.
      if (parts[0] === c.full) parts.shift();
      for (let i = 0; i + 1 < parts.length; i += 2) changed.set(parts[i + 1]!, parts[i]!);

      const files: { name: string; state: FileState }[] = out([
        "ls-tree",
        "-r",
        "-z",
        "--name-only",
        c.full,
      ])
        .split("\0")
        .filter((n) => n !== "")
        .map((name) => ({ name, state: STATE[changed.get(name) ?? ""] ?? "same" }));
      for (const [name, st] of changed) if (st === "D") files.push({ name, state: "deleted" });
      files.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
      return { hash: c.short, message: c.message, parents: c.parents.map(abbrev), files };
    });

    const pick = (prefix: string) =>
      refs
        .filter((r) => r.name.startsWith(prefix))
        .map((r) => ({ name: r.name.slice(prefix.length), target: abbrev(r.target) }));
    const remotes = pick("refs/remotes/");
    return {
      commits,
      branches: pick("refs/heads/"),
      tags: pick("refs/tags/"),
      ...(remotes.length ? { remotes } : {}),
      head: { branch: headBranch, target: headTarget ? abbrev(headTarget) : null },
    };
  }
}

// Lessons with a session.sh: content/<technology>/lessons/<slug>/.
function allLessons(): string[] {
  const dirs: string[] = [];
  for (const tech of readdirSync(CONTENT_ROOT)) {
    const lessons = join(CONTENT_ROOT, tech, "lessons");
    if (!existsSync(lessons)) continue;
    for (const slug of readdirSync(lessons)) {
      if (existsSync(join(lessons, slug, "session.sh"))) dirs.push(join(lessons, slug));
    }
  }
  return dirs.sort();
}

const args = process.argv.slice(2);
const targets = args.length
  ? args.map((a) => {
      const [tech, slug] = a.split("/");
      const dir = join(CONTENT_ROOT, tech ?? "", "lessons", slug ?? "");
      if (!slug || !existsSync(join(dir, "session.sh"))) {
        throw new Error(`no session.sh for "${a}" (expected <technology>/<slug>)`);
      }
      return dir;
    })
  : allLessons();

const bash = findBash();
let failed = 0;
for (const dir of targets) {
  try {
    runLesson(dir, bash);
  } catch (e) {
    failed++;
    console.error(`FAIL ${e instanceof Error ? e.message : String(e)}`);
  }
}
if (!targets.length) console.log("no session lessons found");
process.exitCode = failed ? 1 : 0;
