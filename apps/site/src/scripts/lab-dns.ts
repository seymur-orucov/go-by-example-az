// Pilot "DNS": a journey map. Actors are boxes on an SVG map; each frame sends packets along the
// wires one after another, a stopwatch adds up the (illustrative) latency, and the cache panel
// shows what every party remembers and for how long (TTL bars).
import {
  ACTORS,
  CHAPTERS,
  FRAMES,
  type Actor,
  type CacheRecord,
  type DnsFrame,
  type Hop,
} from "../data/lab-dns";
import { createPlayer, reducedMotion } from "./lab-player";

interface Layout {
  w: number;
  h: number;
  box: [number, number];
  at: Record<Actor, [number, number]>;
  wires: Record<"res" | "root" | "tld" | "auth", string>;
}

const WIDE: Layout = {
  w: 700,
  h: 430,
  box: [140, 88],
  at: { pc: [80, 215], res: [320, 215], root: [600, 75], tld: [600, 215], auth: [600, 355] },
  wires: {
    res: "M150 215L250 215",
    root: "M390 215C462 215 458 75 530 75",
    tld: "M390 215L530 215",
    auth: "M390 215C462 215 458 355 530 355",
  },
};
const TALL: Layout = {
  w: 400,
  h: 590,
  box: [120, 84],
  at: { pc: [200, 92], res: [200, 282], root: [68, 530], tld: [200, 530], auth: [332, 530] },
  wires: {
    res: "M200 134L200 240",
    root: "M200 324C200 420 68 398 68 488",
    tld: "M200 324L200 488",
    auth: "M200 324C200 420 332 398 332 488",
  },
};

/** The wire between two actors and whether the packet travels it backwards. */
function wireOf(h: Hop): { key: keyof Layout["wires"]; reverse: boolean } {
  if (h.from === "pc" || h.to === "pc") return { key: "res", reverse: h.from === "res" };
  const far = (h.from === "res" ? h.to : h.from) as "root" | "tld" | "auth";
  return { key: far, reverse: h.to === "res" };
}

const ICONS: Record<Actor, string> = {
  pc: '<rect x="-13" y="-11" width="26" height="17" rx="2.5"/><path d="M-6 11h12M0 6v5"/>',
  res: '<circle cx="-2" cy="-2" r="8"/><path d="m4 4 7 7"/>',
  root: '<rect x="-11" y="-12" width="22" height="9" rx="2"/><rect x="-11" y="1" width="22" height="9" rx="2"/><path d="M-6-7.5h.1M-6 5.5h.1"/>',
  tld: '<rect x="-11" y="-12" width="22" height="9" rx="2"/><rect x="-11" y="1" width="22" height="9" rx="2"/><path d="M-6-7.5h.1M-6 5.5h.1"/>',
  auth: '<rect x="-11" y="-12" width="22" height="9" rx="2"/><rect x="-11" y="1" width="22" height="9" rx="2"/><path d="M-6-7.5h.1M-6 5.5h.1"/>',
};
const KIND_WORD = { q: "sual", ref: "yönləndirmə", ans: "cavab" } as const;

const esc = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

function fmtTtl(r: CacheRecord): string {
  if (r.ttl <= 0) return "vaxtı bitib";
  if (r.ttl < 120) return `${r.ttl} s`;
  if (r.ttl < 3600) return `${Math.round(r.ttl / 60)} dəq`;
  if (r.ttl < 86400) return `${Math.round(r.ttl / 3600)} saat`;
  return `${(r.ttl / 86400).toFixed(1).replace(/\.0$/, "")} gün`;
}

const stage = document.querySelector<HTMLElement>("[data-stage='dns']");
if (stage) {
  const svg = stage.querySelector<SVGSVGElement>("svg")!;
  const watch = stage.querySelector<HTMLElement>("[data-watch]")!;
  const clock = stage.querySelector<HTMLElement>("[data-clock]")!;
  const insp = stage.querySelector<HTMLElement>("[data-insp]")!;
  const cachePc = document.querySelector<HTMLElement>("[data-cache='pc']")!;
  const cacheRes = document.querySelector<HTMLElement>("[data-cache='res']")!;
  const cachePcTitle = document.querySelector<HTMLElement>("[data-cache-title='pc']")!;

  let L = WIDE;
  let current: DnsFrame = FRAMES[0]!;
  let currentIndex = 0;
  let run = 0; // animation token: a newer frame cancels the older one

  const lookupKey = (f: DnsFrame) => `${f.chapter}|${f.t}|${f.device ?? ""}`;
  const msBefore = (i: number) =>
    FRAMES.slice(0, i)
      .filter((f) => lookupKey(f) === lookupKey(FRAMES[i]!))
      .reduce((s, f) => s + f.hops.reduce((a, h) => a + h.ms, 0), 0);

  function drawMap() {
    const [bw, bh] = L.box;
    const wires = Object.entries(L.wires)
      .map(([k, d]) => `<path class="d-wire" data-wire="${k}" d="${d}"/>`)
      .join("");
    const actors = (Object.keys(ACTORS) as Actor[])
      .map((a) => {
        const [x, y] = L.at[a];
        return `<g class="d-actor" data-actor="${a}" transform="translate(${x} ${y})">
          <rect class="d-box" x="${-bw / 2}" y="${-bh / 2}" width="${bw}" height="${bh}" rx="16"/>
          <g class="d-ic" transform="translate(0 ${-bh / 2 + 24})">${ICONS[a]}</g>
          <text class="d-title" y="${bh / 2 - 30}" data-actor-title="${a}">${ACTORS[a].title}</text>
          <text class="d-sub" y="${bh / 2 - 13}">${ACTORS[a].sub}</text>
          <g class="d-hit" transform="translate(0 ${-bh / 2 - 2})"><rect x="-40" y="-11" width="80" height="22" rx="11"/><text dy="0.35em">keşdə var ✓</text></g>
        </g>`;
      })
      .join("");
    svg.setAttribute("viewBox", `0 0 ${L.w} ${L.h}`);
    svg.innerHTML = `<g>${wires}</g><g>${actors}</g><g data-packets></g>`;
  }

  function packetMarkup(h: Hop, x: number, y: number) {
    const tw = Math.round(h.label.length * 6.5 + 18);
    const clamp = (v: number) => Math.max(tw / 2 + 4, Math.min(L.w - tw / 2 - 4, v));
    // Wide map: label above the envelope. Tall map (vertical wires): beside it, so it never
    // covers the box the packet is entering.
    let lx = clamp(x);
    let ly = y - 24;
    if (L === TALL) {
      ly = y;
      lx = clamp(x + 22 + tw / 2);
      if (lx - tw / 2 < x + 16) lx = clamp(x - 22 - tw / 2);
    }
    return `<g class="d-pkt k-${h.kind}">
      <g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><rect x="-13" y="-9" width="26" height="18" rx="3"/><path d="M-13-8 0 2 13-8"/></g>
      <g class="d-pkt-label" transform="translate(${lx.toFixed(1)} ${ly.toFixed(1)})"><rect x="${-tw / 2}" y="-11" width="${tw}" height="22" rx="11"/><text dy="0.35em">${esc(h.label)}</text></g>
    </g>`;
  }

  function setStatic(f: DnsFrame) {
    const involved = new Set<Actor>(f.hops.flatMap((h) => [h.from, h.to]));
    if (f.hit) involved.add(f.hit);
    if (!f.hops.length && !f.hit && f.chapter === 0) involved.add("pc");
    svg.querySelectorAll<SVGGElement>("[data-actor]").forEach((g) => {
      const a = g.dataset.actor as Actor;
      g.classList.toggle("is-on", involved.has(a));
      g.classList.toggle("is-hit", f.hit === a);
    });
    svg.querySelector("[data-actor-title='pc']")!.textContent = f.device ?? ACTORS.pc.title;
    svg
      .querySelectorAll<SVGPathElement>("[data-wire]")
      .forEach((p) => p.removeAttribute("data-kind"));
    clock.textContent = `t = ${f.t}`;
  }

  function setInspector(h: Hop | null, f: DnsFrame) {
    if (!h) {
      insp.innerHTML = f.hit
        ? `<div class="insp-row"><span>Paket</span><b>yoxdur — cavab ${f.hit === "pc" ? "kompüterin" : "resolver-in"} keşindən gəldi</b></div>`
        : `<div class="insp-row"><span>Paket</span><b>bu addımda şəbəkədə paket yoxdur</b></div>`;
      return;
    }
    const name = (a: Actor) => (a === "pc" ? (f.device ?? ACTORS.pc.title) : ACTORS[a].title);
    insp.innerHTML = `
      <div class="insp-row"><span>Yol</span><b>${esc(name(h.from))} → ${esc(name(h.to))}</b><i class="insp-kind k-${h.kind}">${KIND_WORD[h.kind]}</i></div>
      ${h.ask ? `<div class="insp-row"><span>Sual</span><b>${h.ask}</b></div>` : ""}
      <div class="insp-row"><span>Cavab</span><b>${h.reply ?? "—"}</b></div>`;
  }

  function setCache(f: DnsFrame) {
    cachePcTitle.textContent = f.device ? `${f.device} keşi` : "Kompüterin keşi";
    const rows = (list: CacheRecord[]) =>
      list.length
        ? list
            .map(
              (r) => `<li class="${r.ttl <= 0 ? "is-expired" : ""}">
                <span class="c-name">${esc(r.name)}</span><span class="c-type">${r.type}</span>
                <span class="c-val">${esc(r.value)}</span>
                <span class="c-ttl"><i style="--p:${Math.max(0, r.ttl / r.max).toFixed(3)}"></i><small>${fmtTtl(r)}</small></span>
              </li>`,
            )
            .join("")
        : `<li class="c-empty">boşdur</li>`;
    cachePc.innerHTML = rows(f.pcCache);
    cacheRes.innerHTML = rows(f.resCache);
  }

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  async function play(f: DnsFrame, i: number, animate: boolean) {
    const token = ++run;
    const layer = svg.querySelector<SVGGElement>("[data-packets]")!;
    layer.innerHTML = "";
    setStatic(f);
    let ms = msBefore(i);
    watch.textContent = `${ms} ms`;
    if (!animate || !f.hops.length) {
      ms += f.hops.reduce((a, h) => a + h.ms, 0);
      watch.textContent = `${ms} ms`;
      const last = f.hops.at(-1);
      if (last) {
        for (const h of f.hops) {
          const { key } = wireOf(h);
          svg.querySelector(`[data-wire='${key}']`)!.setAttribute("data-kind", h.kind);
        }
        const p = svg.querySelector<SVGPathElement>(`[data-wire='${wireOf(last).key}']`)!;
        const len = p.getTotalLength();
        const pt = p.getPointAtLength(wireOf(last).reverse ? 10 : len - 10);
        layer.innerHTML = packetMarkup(last, pt.x, pt.y);
      }
      setInspector(last ?? null, f);
      setCache(f);
      return;
    }
    setInspector(null, f);
    for (const h of f.hops) {
      const { key, reverse } = wireOf(h);
      const p = svg.querySelector<SVGPathElement>(`[data-wire='${key}']`)!;
      p.setAttribute("data-kind", h.kind);
      setInspector(h, f);
      const len = p.getTotalLength();
      const dur = 700 + h.ms * 22;
      const t0 = performance.now();
      const start = ms;
      await new Promise<void>((done) => {
        const tick = (now: number) => {
          if (token !== run) return done();
          const t = Math.min(1, (now - t0) / dur);
          const e = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
          const d = 10 + (len - 20) * (reverse ? 1 - e : e);
          const pt = p.getPointAtLength(d);
          layer.innerHTML = packetMarkup(h, pt.x, pt.y);
          watch.textContent = `${Math.round(start + h.ms * t)} ms`;
          if (t < 1) requestAnimationFrame(tick);
          else done();
        };
        requestAnimationFrame(tick);
      });
      if (token !== run) return;
      ms += h.ms;
      await sleep(260);
      if (token !== run) return;
    }
    setCache(f);
  }

  function pickLayout() {
    const next = stage!.querySelector<HTMLElement>(".d-map")!.clientWidth < 560 ? TALL : WIDE;
    if (next === L && svg.childElementCount) return;
    L = next;
    drawMap();
    void play(current, currentIndex, false);
  }

  drawMap();
  createPlayer(stage, FRAMES, CHAPTERS, (f, i, from) => {
    current = f;
    currentIndex = i;
    void play(f, i, from === i - 1 && !reducedMotion());
  });
  new ResizeObserver(pickLayout).observe(stage.querySelector(".d-map")!);
}

/* ---------------- record cards ---------------- */
document.querySelectorAll<HTMLButtonElement>("[data-flip]").forEach((card) =>
  card.addEventListener("click", () => {
    const on = card.getAttribute("aria-pressed") !== "true";
    card.setAttribute("aria-pressed", String(on));
  }),
);
