// Pilot "Merge": an animated commit graph (SVG) used twice — by the stage player (frames from
// data/lab-git-merge.ts) and by the "Özün sına" sandbox, where a tiny Git model reacts to typed
// commands. Positions are tweened in JS so lanes can bend and straighten (fast-forward).
import { COMMITS, FRAMES, CHAPTERS, type GitFrame, type Tone } from "../data/lab-git-merge";
import { createPlayer, reducedMotion } from "./lab-player";

/* ---------------- scene + renderer ---------------- */

interface SNode {
  id: string;
  x: number;
  y: number;
  a: number;
  letter: string;
  sub: string;
  tone?: Tone | "new";
  merge: boolean;
  up: boolean; // labels above (lane 0) or below
}
interface SLabel {
  key: string;
  text: string;
  x: number;
  y: number;
  a: number;
  head: boolean; // the HEAD tag itself
  current: boolean; // the branch HEAD points to
  w: number;
}
interface SEdge {
  from: string;
  to: string;
  tone?: Tone;
}
interface Scene {
  nodes: SNode[];
  edges: SEdge[];
  labels: SLabel[];
  w: number;
  h: number;
}

const R = 19;
const TONE_WORD: Record<Tone, string> = { base: "baza", ours: "ours", theirs: "theirs" };
const esc = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
const pillW = (t: string) => Math.round(t.length * 7.6 + 22);

/** Branch pills (and the HEAD tag) stacked above or below their commit. */
function placeLabels(nodes: SNode[], branches: [string, string][], head: string): SLabel[] {
  const out: SLabel[] = [];
  const byNode = new Map<string, string[]>();
  for (const [name, at] of branches) byNode.set(at, [...(byNode.get(at) ?? []), name]);
  for (const n of nodes) {
    const names = byNode.get(n.id) ?? [];
    names.forEach((name, k) => {
      const y = n.up ? n.y - 44 - k * 28 : n.y + 44 + k * 28;
      const w = pillW(name);
      out.push({
        key: "b:" + name,
        text: name,
        x: n.x,
        y,
        a: 1,
        head: false,
        current: name === head,
        w,
      });
      if (name === head) {
        out.push({
          key: "HEAD",
          text: "HEAD",
          x: n.x - w / 2 - 34,
          y,
          a: 1,
          head: true,
          current: false,
          w: 54,
        });
      }
    });
  }
  return out;
}

function edgePath(c: SNode, p: SNode): string {
  const sx = c.x - R;
  const ex = p.x + R + 5;
  if (Math.abs(c.y - p.y) < 0.5) return `M${sx} ${c.y}L${ex} ${p.y}`;
  const dx = (sx - ex) / 2;
  return `M${sx} ${c.y}C${sx - dx} ${c.y} ${ex + dx} ${p.y} ${ex} ${p.y}`;
}

class GraphView {
  private cur: Scene | null = null;
  private raf = 0;
  private readonly uid = Math.random().toString(36).slice(2, 7);

  constructor(private readonly svg: SVGSVGElement) {}

  draw(target: Scene, animate = true) {
    cancelAnimationFrame(this.raf);
    const from = this.cur;
    this.cur = target;
    if (!from || !animate || reducedMotion()) return this.paint(target);
    const dur = 620;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / dur);
      const e = t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
      this.paint(mix(from, target, e));
      if (t < 1) this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  private paint(s: Scene) {
    const u = this.uid;
    const pos = new Map(s.nodes.map((n) => [n.id, n]));
    const edges = s.edges
      .filter((e) => pos.has(e.from) && pos.has(e.to))
      .map((e) => {
        const c = pos.get(e.from)!;
        const p = pos.get(e.to)!;
        const a = Math.min(c.a, p.a);
        const tone = e.tone ?? "plain";
        return `<path class="g-edge t-${tone}" d="${edgePath(c, p)}" opacity="${a.toFixed(3)}" marker-end="url(#ga-${tone}-${u})"/>`;
      })
      .join("");
    const nodes = s.nodes
      .map((n) => {
        const sc = 0.5 + 0.5 * n.a;
        const subY = n.up ? 40 : -31;
        const pulse = n.tone === "base" ? `<circle class="g-pulse" r="${R}"/>` : "";
        return `<g class="g-node${n.tone ? " t-" + n.tone : ""}${n.merge ? " is-merge" : ""}" transform="translate(${n.x.toFixed(1)} ${n.y.toFixed(1)}) scale(${sc.toFixed(3)})" opacity="${n.a.toFixed(3)}">${pulse}${n.merge ? `<circle class="g-ring" r="${R + 5}"/>` : ""}<circle class="g-dot" r="${R}"/><text class="g-letter" dy="0.35em">${esc(n.letter)}</text><text class="g-sub" y="${subY}">${esc(n.sub)}</text><title>${esc(n.letter + " · " + n.sub)}</title></g>`;
      })
      .join("");
    const labels = s.labels
      .map(
        (l) =>
          `<g class="g-label${l.head ? " is-head" : ""}${l.current ? " is-current" : ""}" transform="translate(${l.x.toFixed(1)} ${l.y.toFixed(1)})" opacity="${l.a.toFixed(3)}"><rect x="${-l.w / 2}" y="-12" width="${l.w}" height="24" rx="12"/><text dy="0.35em">${esc(l.text)}${l.head ? " ›" : ""}</text></g>`,
      )
      .join("");
    const marker = (tone: string) =>
      `<marker id="ga-${tone}-${u}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="g-arr t-${tone}" d="M0 1L9 5L0 9z"/></marker>`;
    this.svg.setAttribute("viewBox", `0 0 ${s.w.toFixed(1)} ${s.h.toFixed(1)}`);
    this.svg.innerHTML = `<defs>${["plain", "base", "ours", "theirs"].map(marker).join("")}</defs><g>${edges}</g><g>${nodes}</g><g>${labels}</g>`;
  }
}

function mix(a: Scene, b: Scene, t: number): Scene {
  const L = (x: number, y: number) => x + (y - x) * t;
  const an = new Map(a.nodes.map((n) => [n.id, n]));
  const bn = new Map(b.nodes.map((n) => [n.id, n]));
  const nodes: SNode[] = [];
  for (const n of b.nodes) {
    const o = an.get(n.id);
    nodes.push(o ? { ...n, x: L(o.x, n.x), y: L(o.y, n.y), a: L(o.a, n.a) } : { ...n, a: t });
  }
  for (const o of a.nodes) if (!bn.has(o.id)) nodes.push({ ...o, a: 1 - t });
  const al = new Map(a.labels.map((l) => [l.key, l]));
  const bl = new Map(b.labels.map((l) => [l.key, l]));
  const labels: SLabel[] = [];
  for (const l of b.labels) {
    const o = al.get(l.key);
    labels.push(o ? { ...l, x: L(o.x, l.x), y: L(o.y, l.y), w: L(o.w, l.w) } : { ...l, a: t });
  }
  for (const o of a.labels) if (!bl.has(o.key)) labels.push({ ...o, a: 1 - t });
  const keys = new Set(b.edges.map((e) => e.from + ">" + e.to));
  const edges = [...b.edges, ...a.edges.filter((e) => !keys.has(e.from + ">" + e.to))];
  return { nodes, labels, edges, w: L(a.w, b.w), h: L(a.h, b.h) };
}

/* ---------------- stage player ---------------- */

const LANE_Y = [130, 240];

/** Column spacing shrinks on phones so the whole graph fits without scrolling. */
function frameScene(f: GitFrame, compact: boolean): Scene {
  const COL = compact ? 76 : 100;
  const PAD = compact ? 44 : 60;
  const nodes: SNode[] = Object.entries(f.nodes).map(([id, [col, lane]]) => {
    const tone = f.tones?.[id];
    return {
      id,
      x: PAD + col * COL,
      y: LANE_Y[lane] ?? 130,
      a: 1,
      letter: id,
      sub: tone ? TONE_WORD[tone] : COMMITS[id]!.hash,
      tone,
      merge: COMMITS[id]!.parents.length > 1,
      up: lane === 0,
    };
  });
  const edges: SEdge[] = [];
  for (const id of Object.keys(f.nodes))
    for (const p of COMMITS[id]!.parents)
      if (f.nodes[p]) edges.push({ from: id, to: p, tone: f.edgeTones?.[`${id}>${p}`] });
  return {
    nodes,
    edges,
    labels: placeLabels(nodes, Object.entries(f.branches), f.head),
    w: PAD * 2 + COL * 5,
    h: 330,
  };
}

const stage = document.querySelector<HTMLElement>("[data-stage='git']");
if (stage) {
  const svg = stage.querySelector("svg")!;
  const view = new GraphView(svg);
  const caption = stage.querySelector<HTMLElement>("[data-stage-caption]")!;
  const isCompact = () => svg.clientWidth < 520;
  let compact = isCompact();
  let current = FRAMES[0]!;
  createPlayer(stage, FRAMES, CHAPTERS, (f, _i, from) => {
    current = f;
    const fresh = from >= 0 && FRAMES[from]!.chapter !== f.chapter;
    view.draw(frameScene(f, compact), from >= 0);
    caption.textContent = fresh ? "Yeni ssenari" : "";
    caption.classList.toggle("is-on", fresh);
  });
  new ResizeObserver(() => {
    if (isCompact() === compact) return;
    compact = !compact;
    view.draw(frameScene(current, compact), false);
  }).observe(svg);
}

/* ---------------- sandbox ---------------- */

interface SCommit {
  id: string;
  hash: string;
  parents: string[];
  col: number;
  lane: number;
  branch: string;
  msg: string;
}

const MAX_COMMITS = 14;
const MAX_LANES = 3;

class MiniGit {
  commits: SCommit[] = [];
  branches = new Map<string, string>();
  lanes = new Map<string, number>();
  head = "main";
  private seed = 7;
  events = { newBranch: false, commitsOnBranch: 0, ff: false, merge: false };

  constructor() {
    this.lanes.set("main", 0);
    this.addCommit("main", []);
    this.addCommit("main", [this.commits[0]!.id]);
  }

  private hash() {
    this.seed = (this.seed * 48271) % 2147483647;
    return (this.seed % 0xfffffff).toString(16).padStart(7, "0");
  }
  private addCommit(on: string, parents: string[], msg = "") {
    const id = String.fromCharCode(65 + this.commits.length);
    const c: SCommit = {
      id,
      hash: this.hash(),
      parents,
      col: this.commits.length,
      lane: this.lanes.get(on) ?? 0,
      branch: on,
      msg: msg || "Commit " + id,
    };
    this.commits.push(c);
    this.branches.set(on, id);
    return c;
  }
  get(id: string) {
    return this.commits.find((c) => c.id === id)!;
  }
  tip(b = this.head) {
    return this.get(this.branches.get(b)!);
  }
  /** Smallest lane no current branch uses. */
  freeLane() {
    const used = new Set([...this.branches.keys()].map((b) => this.lanes.get(b)));
    let l = 0;
    while (used.has(l)) l++;
    return l;
  }
  isAncestor(anc: string, of: string): boolean {
    const seen = new Set<string>();
    const stack = [of];
    while (stack.length) {
      const id = stack.pop()!;
      if (id === anc) return true;
      if (seen.has(id)) continue;
      seen.add(id);
      stack.push(...this.get(id).parents);
    }
    return false;
  }

  run(line: string): { out: string; note?: string; err?: boolean } {
    const args = line.trim().replace(/\s+/g, " ").split(" ");
    if (args[0] !== "git") {
      if (args[0] === "clear") return { out: "" };
      return {
        out: "",
        note: "Burada yalnız git komandaları işləyir. «kömək» üçün: git help",
        err: true,
      };
    }
    const [, cmd, ...rest] = args;
    const name = (s?: string) => (s && /^[\w./-]{1,24}$/.test(s) ? s : null);
    switch (cmd) {
      case "commit": {
        if (this.commits.length >= MAX_COMMITS)
          return {
            out: "",
            note: `Sandbox ${MAX_COMMITS} commit-lə məhdudlaşır. «Sıfırla» düyməsini bas.`,
            err: true,
          };
        const m = line.match(/-m\s+["']?([^"']+)["']?/);
        const c = this.addCommit(this.head, [this.tip().id], m ? m[1]!.trim() : "");
        if (this.head !== "main") this.events.commitsOnBranch++;
        return { out: `[${this.head} ${c.hash}] ${c.msg}\n 1 file changed, 1 insertion(+)` };
      }
      case "switch":
      case "checkout": {
        const create = rest[0] === "-c" || rest[0] === "-b";
        const n = name(create ? rest[1] : rest[0]);
        const old =
          cmd === "checkout"
            ? "checkout köhnə sintaksisdir; müasir forması git switch-dir."
            : undefined;
        if (!n) return { out: "", note: "Branch adını yaz: git switch -c feature", err: true };
        if (create) {
          if (this.branches.has(n))
            return { out: `fatal: a branch named '${n}' already exists`, err: true };
          if (this.branches.size >= MAX_LANES)
            return { out: "", note: `Sandbox-da ən çox ${MAX_LANES} branch ola bilər.`, err: true };
          this.branches.set(n, this.tip().id);
          this.lanes.set(n, this.freeLane());
          this.head = n;
          this.events.newBranch = true;
          return { out: `Switched to a new branch '${n}'`, note: old };
        }
        if (!this.branches.has(n))
          return {
            out: `fatal: invalid reference: ${n}`,
            note: `Yeni branch üçün: git switch -c ${n}`,
            err: true,
          };
        if (n === this.head) return { out: `Already on '${n}'` };
        this.head = n;
        if (n !== "main") this.events.newBranch = true;
        return { out: `Switched to branch '${n}'`, note: old };
      }
      case "branch": {
        if (!rest.length)
          return {
            out: [...this.branches.keys()]
              .map((b) => (b === this.head ? "* " : "  ") + b)
              .join("\n"),
          };
        if (rest[0] === "-d" || rest[0] === "-D") {
          const n = name(rest[1]);
          if (!n || !this.branches.has(n))
            return { out: `error: branch '${rest[1] ?? ""}' not found`, err: true };
          if (n === this.head)
            return {
              out: `error: cannot delete branch '${n}' used by worktree`,
              note: "Əvvəlcə başqa branch-ə keç.",
              err: true,
            };
          if (rest[0] === "-d" && !this.isAncestor(this.branches.get(n)!, this.tip().id))
            return {
              out: `error: the branch '${n}' is not fully merged`,
              note: "Bu branch-in commit-ləri hələ birləşdirilməyib — silinsə, onlara yarlıq qalmaz.",
              err: true,
            };
          const at = this.get(this.branches.get(n)!).hash;
          this.branches.delete(n);
          return {
            out: `Deleted branch ${n} (was ${at}).`,
            note: "Yalnız yarlıq silindi, commit-lər yerindədir.",
          };
        }
        const n = name(rest[0]);
        if (!n)
          return { out: "", note: "Branch adı yalnız hərf, rəqəm, -, _, / ola bilər.", err: true };
        if (this.branches.has(n))
          return { out: `fatal: a branch named '${n}' already exists`, err: true };
        if (this.branches.size >= MAX_LANES)
          return { out: "", note: `Sandbox-da ən çox ${MAX_LANES} branch ola bilər.`, err: true };
        this.branches.set(n, this.tip().id);
        this.lanes.set(n, this.freeLane());
        return {
          out: "",
          note: `Branch yarandı, amma HEAD hələ ${this.head}-dədir. Keçmək üçün: git switch ${n}`,
        };
      }
      case "merge": {
        const n = name(rest[0]);
        if (!n || !this.branches.has(n))
          return { out: `merge: ${rest[0] ?? ""} - not something we can merge`, err: true };
        const ours = this.tip();
        const theirs = this.tip(n);
        if (this.isAncestor(theirs.id, ours.id)) return { out: "Already up to date." };
        if (this.isAncestor(ours.id, theirs.id)) {
          this.branches.set(this.head, theirs.id);
          this.events.ff = true;
          return {
            out: `Updating ${ours.hash}..${theirs.hash}\nFast-forward`,
            note: "Yeni commit yaranmadı — yarlıq irəli sürüşdü.",
          };
        }
        if (this.commits.length >= MAX_COMMITS)
          return { out: "", note: `Sandbox ${MAX_COMMITS} commit-lə məhdudlaşır.`, err: true };
        this.addCommit(this.head, [ours.id, theirs.id], `Merge branch '${n}'`);
        this.events.merge = true;
        return {
          out: "Merge made by the 'ort' strategy.",
          note: `İki valideynli merge commit yarandı: ${ours.id} və ${theirs.id}.`,
        };
      }
      case "log": {
        const seen = new Set<string>();
        const stack = [this.tip().id];
        while (stack.length) {
          const id = stack.pop()!;
          if (seen.has(id)) continue;
          seen.add(id);
          stack.push(...this.get(id).parents);
        }
        const tags = (id: string) => {
          const bs = [...this.branches].filter(([, at]) => at === id).map(([b]) => b);
          if (!bs.length) return "";
          return " (" + bs.map((b) => (b === this.head ? `HEAD -> ${b}` : b)).join(", ") + ")";
        };
        return {
          out: this.commits
            .filter((c) => seen.has(c.id))
            .reverse()
            .map((c) => `${c.hash}${tags(c.id)} ${c.msg}`)
            .join("\n"),
        };
      }
      case "status":
        return { out: `On branch ${this.head}\nnothing to commit, working tree clean` };
      case "help":
      case undefined:
        return {
          out: "",
          note: "Bunlar işləyir: git commit · git switch -c <ad> · git switch <ad> · git branch [<ad>] · git branch -d <ad> · git merge <ad> · git log · git status · clear",
        };
      default:
        return {
          out: `git: '${cmd}' is not a git command.`,
          note: "Bu sandbox-da yoxdur. Siyahı: git help",
          err: true,
        };
    }
  }

  scene(): Scene {
    const cols = Math.max(...this.commits.map((c) => c.col));
    const SX = 82;
    const nodes: SNode[] = this.commits.map((c) => ({
      id: c.id,
      x: 56 + c.col * SX,
      y: 104 + c.lane * 108,
      a: 1,
      letter: c.id,
      sub: c.hash,
      merge: c.parents.length > 1,
      up: c.lane === 0,
    }));
    const edges = this.commits.flatMap((c) => c.parents.map((p) => ({ from: c.id, to: p })));
    const lanes = Math.max(...this.lanes.values(), ...this.commits.map((c) => c.lane)) + 1;
    return {
      nodes,
      edges,
      labels: placeLabels(nodes, [...this.branches], this.head),
      w: Math.max(620, 112 + cols * SX),
      h: 104 + (lanes - 1) * 108 + 104,
    };
  }
}

const sb = document.querySelector<HTMLElement>("[data-sandbox='git']");
if (sb) {
  const svg = sb.querySelector("svg")!;
  const scroller = sb.querySelector<HTMLElement>(".sb-graph")!;
  const view = new GraphView(svg);
  const log = sb.querySelector<HTMLElement>("[data-sb-log]")!;
  const input = sb.querySelector<HTMLInputElement>("[data-sb-input]")!;
  const sugg = sb.querySelector<HTMLElement>("[data-sb-sugg]")!;
  const tasks = [...sb.querySelectorAll<HTMLElement>("[data-task]")];
  const done = sb.querySelector<HTMLElement>("[data-sb-done]")!;
  let git = new MiniGit();
  const history: string[] = [];
  let hi = 0;

  const line = (cls: string, text: string) => {
    const el = document.createElement("div");
    el.className = cls;
    el.textContent = text;
    log.append(el);
  };

  function render(animate: boolean) {
    const s = git.scene();
    // Fixed scale: a few commits stay small, a long history scrolls instead of shrinking.
    svg.style.width = `${Math.round(s.w * (scroller.clientWidth < 600 ? 0.78 : 1))}px`;
    view.draw(s, animate);
    requestAnimationFrame(() => (scroller.scrollLeft = scroller.scrollWidth));
    // Suggestions follow the state, so the next useful command is always one click away.
    const others = [...git.branches.keys()].filter((b) => b !== git.head);
    const list = [
      `git commit -m "${git.head === "main" ? "Fix" : "Work"} ${String.fromCharCode(65 + git.commits.length)}"`,
    ];
    if (!git.branches.has("feature")) list.push("git switch -c feature");
    for (const b of others) list.push(`git switch ${b}`, `git merge ${b}`);
    list.push("git log");
    sugg.innerHTML = "";
    for (const c of list.slice(0, 6)) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "sb-chip";
      b.textContent = c;
      b.addEventListener("click", () => exec(c));
      sugg.append(b);
    }
    const ev = git.events;
    const state = [ev.newBranch, ev.commitsOnBranch >= 2, ev.ff, ev.merge];
    tasks.forEach((t, k) => t.classList.toggle("is-done", state[k]));
    done.hidden = !state.every(Boolean);
  }

  function exec(cmd: string) {
    const c = cmd.trim();
    if (!c) return;
    history.push(c);
    hi = history.length;
    if (c === "clear") {
      log.innerHTML = "";
      return;
    }
    line("sb-cmd", c);
    const r = git.run(c);
    if (r.out) line(r.err ? "sb-out is-err" : "sb-out", r.out);
    if (r.note) line(r.err ? "sb-note is-err" : "sb-note", r.note);
    log.scrollTop = log.scrollHeight;
    render(true);
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      exec(input.value);
      input.value = "";
    } else if (e.key === "ArrowUp" && hi > 0) {
      input.value = history[--hi]!;
      e.preventDefault();
    } else if (e.key === "ArrowDown") {
      hi = Math.min(history.length, hi + 1);
      input.value = history[hi] ?? "";
      e.preventDefault();
    }
  });
  sb.querySelector("[data-sb-reset]")!.addEventListener("click", () => {
    git = new MiniGit();
    log.innerHTML = "";
    line(
      "sb-note",
      "Yeni repository: main üzərində iki commit. Komanda yaz və ya aşağıdakı düymələrə bas.",
    );
    render(false);
  });
  line(
    "sb-note",
    "Yeni repository: main üzərində iki commit. Komanda yaz və ya aşağıdakı düymələrə bas.",
  );
  render(false);
}
