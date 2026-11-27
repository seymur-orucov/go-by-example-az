// Layout of the commit-graph visual (Vis kind "graph"): one row per commit, newest first, each
// commit in a lane (a column of the rail on the left). Rows may have different heights (a row
// can show the commit's files), so every row gets its own slice of the rail: the edge pieces
// that cross it, in row-local coordinates (x in px, y from 0 at the top to 100 at the bottom),
// drawn into an SVG that stretches to the row's height.
import type { GraphFrame } from "./session.ts";

/** Width of one lane and the rail's left padding, px. */
export const LANE = 18;
const PAD = 10;
const laneX = (lane: number) => PAD + lane * LANE;

export interface GraphRef {
  name: string;
  kind: "branch" | "remote" | "tag" | "head";
  /** HEAD points at this branch (shown as "HEAD → main"). */
  current?: boolean;
  fresh?: boolean;
}

export interface GraphRow {
  commit: GraphFrame["commits"][number];
  lane: number;
  /** The dot's x, px. */
  x: number;
  refs: GraphRef[];
  /** New since the previous step. */
  fresh: boolean;
  /** Edge pieces inside this row: SVG path data and the lane that colours them. */
  paths: { d: string; lane: number }[];
  /** The same for the row's detail line (parent and files), when shown. */
  detailPaths: { d: string; lane: number }[];
}

export interface GraphLayout {
  lanes: number;
  /** The rail's width, px. */
  width: number;
  rows: GraphRow[];
}

type Piece =
  | { kind: "line"; x: number; y1: number; y2: number; lane: number }
  /** An S-curve one rail row tall, from `y` (a row centre, row + 0.5) down to `y + 1`. */
  | { kind: "curve"; x1: number; x2: number; y: number; lane: number };

/**
 * Chains: a branch tip and its first parents, until a commit that already belongs to a chain.
 * Chains get lanes greedily (main first), and a lane is reused once its chain is over.
 */
export function layoutGraph(
  frame: GraphFrame,
  prev: GraphFrame | null,
  opts: { detail?: boolean } = {},
): GraphLayout {
  const commits = frame.commits;
  const row = new Map(commits.map((c, i) => [c.hash, i]));
  const byHash = new Map(commits.map((c) => [c.hash, c]));

  const tips: string[] = [];
  const branchOrder = [...frame.branches].sort((a, b) =>
    a.name === "main" ? -1 : b.name === "main" ? 1 : a.name < b.name ? -1 : 1,
  );
  for (const b of branchOrder) tips.push(b.target);
  if (frame.head.target) tips.push(frame.head.target);
  for (const r of frame.remotes ?? []) tips.push(r.target);
  for (const t of frame.tags) tips.push(t.target);
  for (const c of commits) tips.push(c.hash);

  const chainOf = new Map<string, number>();
  const chains: string[][] = [];
  for (const tip of tips) {
    let h: string | undefined = tip;
    const members: string[] = [];
    while (h && byHash.has(h) && !chainOf.has(h)) {
      chainOf.set(h, chains.length);
      members.push(h);
      h = byHash.get(h)!.parents[0];
    }
    if (members.length) chains.push(members);
  }

  // Rows each chain's lane is busy: its commits, the edge down to the parent it forks from, and
  // merge edges that come into it from above.
  const span = chains.map((m) => {
    const rows = m.map((h) => row.get(h)!);
    const fork = byHash.get(m[m.length - 1]!)!.parents[0];
    if (fork && row.has(fork)) rows.push(row.get(fork)!);
    return { top: Math.min(...rows), bottom: Math.max(...rows) };
  });
  for (const c of commits) {
    for (const p of c.parents.slice(1)) {
      const s = chainOf.has(p) ? span[chainOf.get(p)!]! : null;
      if (s) s.top = Math.min(s.top, row.get(c.hash)!);
    }
  }
  const busy: { top: number; bottom: number }[][] = [];
  const laneOf = span.map((s) => {
    let lane = 0;
    while (busy[lane]?.some((b) => s.top <= b.bottom && b.top <= s.bottom)) lane++;
    (busy[lane] ??= []).push(s);
    return lane;
  });
  const lane = (h: string) => laneOf[chainOf.get(h)!]!;

  // Edges, in rail rows: a commit's centre is at y = rail row + 0.5. With `detail`, every commit
  // takes two rail rows (its line, then its parent and files) and the dot stays on the first.
  const stride = opts.detail ? 2 : 1;
  const pieces: Piece[] = [];
  for (const c of commits) {
    const rc = row.get(c.hash)! * stride;
    const lc = lane(c.hash);
    c.parents.forEach((p, i) => {
      if (!row.has(p)) return;
      const rp = row.get(p)! * stride;
      const lp = lane(p);
      if (lc === lp) {
        pieces.push({ kind: "line", x: laneX(lc), y1: rc + 0.5, y2: rp + 0.5, lane: lc });
      } else if (i === 0) {
        // The first commit of a branch: down its own lane, then into the commit it forked from.
        pieces.push({ kind: "line", x: laneX(lc), y1: rc + 0.5, y2: rp - 0.5, lane: lc });
        pieces.push({ kind: "curve", x1: laneX(lc), x2: laneX(lp), y: rp - 0.5, lane: lc });
      } else {
        // A merge: out into the merged branch's lane, then down it.
        pieces.push({ kind: "curve", x1: laneX(lc), x2: laneX(lp), y: rc + 0.5, lane: lp });
        pieces.push({ kind: "line", x: laneX(lp), y1: rc + 1.5, y2: rp + 0.5, lane: lp });
      }
    });
  }

  const Y = (y: number, r: number) => +((y - r) * 100).toFixed(2);
  const pathsIn = (r: number) => {
    const out: { d: string; lane: number }[] = [];
    for (const p of pieces) {
      if (p.kind === "line") {
        const a = Math.max(p.y1, r);
        const b = Math.min(p.y2, r + 1);
        if (b > a) out.push({ d: `M${p.x} ${Y(a, r)}V${Y(b, r)}`, lane: p.lane });
        continue;
      }
      // The cubic (x1,0) (x1,.5) (x2,.5) (x2,1), split in half at the row boundary.
      const m = (p.x1 + p.x2) / 2;
      const q1 = (3 * p.x1 + p.x2) / 4;
      const q3 = (p.x1 + 3 * p.x2) / 4;
      if (r === p.y - 0.5) {
        out.push({ d: `M${p.x1} 50C${p.x1} 75 ${q1} 87.5 ${m} 100`, lane: p.lane });
      } else if (r === p.y + 0.5) {
        out.push({ d: `M${m} 0C${q3} 12.5 ${p.x2} 25 ${p.x2} 50`, lane: p.lane });
      }
    }
    return out;
  };

  // Without a previous frame everything is new (as in the areas visual).
  const prevHashes = new Set(prev?.commits.map((c) => c.hash));
  const prevRef = (kind: string, name: string) =>
    kind === "branch"
      ? prev?.branches.find((b) => b.name === name)?.target
      : kind === "remote"
        ? prev?.remotes?.find((r) => r.name === name)?.target
        : prev?.tags.find((t) => t.name === name)?.target;
  const headMoved =
    prev?.head.target !== frame.head.target || prev?.head.branch !== frame.head.branch;

  const rows = commits.map((c, r): GraphRow => {
    const refs: GraphRef[] = [];
    const detachedHere = frame.head.branch === null && frame.head.target === c.hash;
    if (detachedHere) refs.push({ name: "HEAD", kind: "head", fresh: headMoved });
    for (const b of branchOrder.filter((b) => b.target === c.hash)) {
      const current = frame.head.branch === b.name;
      const moved = prevRef("branch", b.name) !== c.hash;
      refs.push({ name: b.name, kind: "branch", current, fresh: moved || (current && headMoved) });
    }
    for (const r of (frame.remotes ?? []).filter((r) => r.target === c.hash)) {
      refs.push({ name: r.name, kind: "remote", fresh: prevRef("remote", r.name) !== c.hash });
    }
    for (const t of frame.tags.filter((t) => t.target === c.hash)) {
      refs.push({ name: t.name, kind: "tag", fresh: prevRef("tag", t.name) !== c.hash });
    }
    return {
      commit: c,
      lane: lane(c.hash),
      x: laneX(lane(c.hash)),
      refs,
      fresh: !prevHashes.has(c.hash),
      paths: pathsIn(r * stride),
      detailPaths: opts.detail ? pathsIn(r * stride + 1) : [],
    };
  });

  const lanes = Math.max(1, ...laneOf.map((l) => l + 1));
  return { lanes, width: PAD * 2 + (lanes - 1) * LANE, rows };
}
