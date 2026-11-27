// Shared runtime of the v2 design for every page (no dependencies): theme, palette,
// menus, Ctrl+K search, scroll reveal, count-up, pointer light, tilt, toast and the
// WebGL aurora. Page scripts import the helpers; the shell part runs once on import.
import { DIRECTIONS, PLATFORM, STATUS, TECHS } from "../data/platform";

const root = document.documentElement;
root.classList.add("js");
export const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- storage (never throws) ----------
export const store = {
  get<T>(key: string, fallback: T): T {
    try {
      const v = localStorage.getItem(key);
      return v == null ? fallback : (JSON.parse(v) as T);
    } catch {
      return fallback;
    }
  },
  set(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* private mode */
    }
  },
};

export const esc = (s: unknown): string =>
  String(s).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string,
  );

/** Azerbaijani-insensitive search: "dovr" finds "Dövr". */
export const fold = (s: string): string =>
  String(s)
    .toLowerCase()
    .replace(/[əä]/g, "e")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g");

// ---------- Go catalog and progress (the site embeds the index as JSON) ----------
export interface SearchEntry {
  slug: string;
  title: string;
  sub: string;
  section: string;
  n: number;
  href: string;
  ready: boolean;
}

function readIndex(): SearchEntry[] {
  const el = document.getElementById("search-index");
  try {
    return el?.textContent ? (JSON.parse(el.textContent) as SearchEntry[]) : [];
  } catch {
    return [];
  }
}
export const FLAT: SearchEntry[] = readIndex();
export const READY = new Set(FLAT.filter((e) => e.ready).map((e) => e.slug));

export const KEY_LEARNED = "goaz:learned";
export const learnedSet = new Set(store.get<string[]>(KEY_LEARNED, []));
export const saveLearned = (): void => {
  store.set(KEY_LEARNED, Array.from(learnedSet));
  dispatchEvent(new Event("goaz:learned"));
};
export const lessonHref = (slug: string): string => `/go/${encodeURIComponent(slug)}/`;

// ---------- icons ----------
const P = (d: string): string =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
export const I: Record<string, string> = {
  search: P('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
  arrow: P('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  chev: P('<path d="m6 9 6 6 6-6"/>'),
  sun: P(
    '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  ),
  moon: P('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>'),
  map: P('<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v14M15 6v14"/>'),
  book: P(
    '<path d="M4 19.5V5a2 2 0 0 1 2-2h14v15H6.5A2.5 2.5 0 0 0 4 20.5 2.5 2.5 0 0 0 6.5 23H20"/>',
  ),
  code: P('<path d="m8 7-5 5 5 5M16 7l5 5-5 5"/>'),
  eye: P(
    '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  ),
  check: P('<rect x="3" y="3" width="18" height="18" rx="5"/><path d="m8 12 3 3 5-6"/>'),
  chat: P('<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z"/>'),
  layers: P('<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>'),
  pointer: P(
    '<rect x="3" y="9" width="4" height="6" rx="1"/><rect x="10" y="9" width="4" height="6" rx="1"/><rect x="17" y="9" width="4" height="6" rx="1"/><path d="M5 5v2M19 5v2"/>',
  ),
  terminal: P('<rect x="3" y="4" width="18" height="16" rx="3"/><path d="m7 9 3 3-3 3M13 15h4"/>'),
  menu: P('<path d="M4 7h16M4 12h16M4 17h16"/>'),
  palette: P(
    '<circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/><path d="M12 2a10 10 0 0 0 0 20c1 0 1.7-.8 1.7-1.7 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.8-1.7 1.7-1.7H17a5 5 0 0 0 5-5c0-4.9-4.5-8.4-10-8.4Z"/>',
  ),
  dot: P('<circle cx="12" cy="12" r="3"/>'),
  globe: P(
    '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  ),
  spark: P(
    '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
  ),
  github:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 3 .8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2Z"/></svg>',
};

/** Replaces every `<i data-icon="name">` below `scope` with the inline SVG. */
export function paintIcons(scope?: ParentNode): void {
  (scope ?? document).querySelectorAll<HTMLElement>("[data-icon]").forEach((el) => {
    const svg = I[el.getAttribute("data-icon") ?? ""] ?? "";
    el.outerHTML = el.className ? svg.replace("<svg ", `<svg class="${el.className}" `) : svg;
  });
}

// ---------- theme + palette ----------
const PALETTES: [string, string, string, string][] = [
  ["nebula", "Nebula", "#5b7cff", "#a07bff"],
  ["indigo", "İndiqo", "#6c6cff", "#c084fc"],
  ["ocean", "Okean", "#0ea5e9", "#34e0c0"],
  ["graphite", "Qrafit", "#64748b", "#cbd5e1"],
];
export const isDark = (): boolean => {
  const t = root.getAttribute("data-theme");
  return t ? t === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
};
function paintLook(): void {
  const mode = store.get("w3:theme", "system");
  const pal = store.get("w3:palette", "nebula");
  document
    .querySelectorAll<HTMLElement>("[data-theme-set]")
    .forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.themeSet === mode)));
  document
    .querySelectorAll<HTMLElement>("[data-palette-set]")
    .forEach((b) => b.setAttribute("aria-checked", String(b.dataset.paletteSet === pal)));
  document.querySelectorAll("[data-look-icon]").forEach((el) => {
    el.innerHTML = isDark() ? I.moon : I.sun;
  });
}
function applyTheme(mode: string): void {
  if (mode === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", mode);
  store.set("w3:theme", mode);
  paintLook();
  window.dispatchEvent(new Event("w3:look"));
}
function applyPalette(p: string): void {
  if (p === "nebula") root.removeAttribute("data-palette");
  else root.setAttribute("data-palette", p);
  store.set("w3:palette", p);
  paintLook();
  window.dispatchEvent(new Event("w3:look"));
}

// ---------- toast ----------
let toastEl: HTMLElement | undefined;
let toastTimer: number | undefined;
export function toast(msg: string): void {
  if (!toastEl) {
    toastEl = document.createElement("div");
    toastEl.className = "toast";
    toastEl.setAttribute("role", "status");
    document.body.appendChild(toastEl);
  }
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toastEl?.classList.remove("show"), 2200);
}

// ---------- Ctrl+K search ----------
interface PaletteItem {
  g: string;
  t: string;
  s: string;
  href?: string;
  ic: string;
  c: string;
  /** Full-text match: Pagefind's excerpt (HTML). */
  ex?: string;
}
const statusText = (s: string): string =>
  s === "live"
    ? "hazırdır"
    : s === "started"
      ? "başlanıb"
      : s === "preview"
        ? "önizləmə"
        : "tezliklə";
const LESSONS_GROUP = "Dərslər";
const INDEX: PaletteItem[] = [
  ...TECHS.map((t) => ({
    g: "Texnologiyalar",
    t: t.name,
    s: statusText(t.status),
    href: t.href,
    ic: t.ic,
    c: t.c,
  })),
  ...DIRECTIONS.map((d) => ({
    g: "İstiqamətlər",
    t: d.name,
    s: statusText(d.status),
    href: d.href,
    ic: d.ic,
    c: d.c,
  })),
  ...PLATFORM.map((p) => ({
    g: "Bölmələr",
    t: p.name,
    s: STATUS[p.status][1],
    href: "/#bolmeler",
    ic: "·",
    c: "#8b9cff",
  })),
  // lessons of every technology share one group; the icon follows the lesson's technology
  ...FLAT.map((x) => {
    const tech = TECHS.find((t) => x.href.startsWith(`/${t.id}/`));
    return {
      g: LESSONS_GROUP,
      t: x.title,
      s: x.sub ? `${x.sub} · ${x.section}` : x.section,
      href: x.href,
      ic: tech?.ic ?? "Go",
      c: tech?.c ?? "#00add8",
    };
  }),
];
let pal: HTMLElement | undefined;
let palInput: HTMLInputElement;
let palList: HTMLElement;
let palSel = 0;
let palItems: PaletteItem[] = [];

function buildPalette(): void {
  pal = document.createElement("div");
  pal.className = "palette-backdrop";
  pal.hidden = true;
  pal.innerHTML =
    `<div class="palette glass glow-border" role="dialog" aria-modal="true" aria-label="Axtarış"><label class="palette-input">${I.search}` +
    '<input type="search" placeholder="Texnologiya, mövzu və ya dərsin mətnində axtar…" autocomplete="off" aria-label="Axtarış"><kbd>Esc</kbd></label><div class="palette-list" role="listbox"></div></div>';
  document.body.appendChild(pal);
  palInput = pal.querySelector("input") as HTMLInputElement;
  palList = pal.querySelector(".palette-list") as HTMLElement;
  palInput.addEventListener("input", renderPalette);
  pal.addEventListener("click", (e) => {
    if (e.target === pal) closePalette();
  });
  palInput.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      palSel =
        (palSel + (e.key === "ArrowDown" ? 1 : -1) + palItems.length) %
        Math.max(palItems.length, 1);
      paintSel();
    }
    if (e.key === "Enter" && palItems[palSel]) {
      const h = palItems[palSel].href;
      if (h) location.href = h;
      else toast("Bu bölmə tezliklə açılacaq");
    }
  });
}
// Full-text search over lesson pages (Pagefind, built by `pagefind --site dist` after the
// Astro build). Loaded on the first query; missing in `astro dev`, where only titles match.
interface PagefindData {
  url: string;
  excerpt: string;
  meta: Record<string, string | undefined>;
}
interface Pagefind {
  /** Loads the index metadata ahead of the first query. */
  init?(): Promise<void>;
  search(q: string): Promise<{ results: { data(): Promise<PagefindData> }[] } | null>;
}
let pagefind: Promise<Pagefind | null> | undefined;
const PAGEFIND_URL = "/pagefind/pagefind.js";
function loadPagefind(): Promise<Pagefind | null> {
  pagefind ??= (import(/* @vite-ignore */ PAGEFIND_URL) as Promise<Pagefind>)
    .then(async (pf) => {
      await pf.init?.();
      return pf;
    })
    .catch(() => null);
  return pagefind;
}
const FULLTEXT_GROUP = "Dərslərin mətnində";
let ftSeq = 0;
let ftTimer: number | undefined;

/** Appends Pagefind's matches for `raw` below the title matches, unless the query changed. */
function searchText(raw: string, local: PaletteItem[]): void {
  const seq = ++ftSeq;
  clearTimeout(ftTimer);
  if (raw.length < 3) return;
  ftTimer = window.setTimeout(async () => {
    const pf = await loadPagefind();
    const res = pf ? await pf.search(raw).catch(() => null) : null;
    if (!res || seq !== ftSeq) return;
    const data = await Promise.all(res.results.slice(0, 8).map((r) => r.data()));
    if (seq !== ftSeq) return;
    const seen = new Set(local.map((x) => x.href));
    const found = data
      .filter((d) => !seen.has(d.url))
      .map((d): PaletteItem => {
        const tech = TECHS.find((t) => t.id === d.meta.tech);
        return {
          g: FULLTEXT_GROUP,
          t: d.meta.title ?? d.url,
          s: d.meta.section ?? "",
          href: d.url,
          ic: tech?.ic ?? "·",
          c: tech?.c ?? "#8b9cff",
          ex: d.excerpt,
        };
      });
    if (found.length) paintPalette(local.concat(found), palSel);
  }, 160);
}

function renderPalette(): void {
  const raw = palInput.value.trim();
  const q = fold(raw);
  const local = (
    q
      ? INDEX.filter((x) => fold(`${x.t} ${x.s}`).includes(q))
      : INDEX.filter((x) => x.g !== LESSONS_GROUP).concat(
          INDEX.filter((x) => x.g === LESSONS_GROUP).slice(0, 6),
        )
  ).slice(0, 40);
  paintPalette(local, 0);
  searchText(raw, local);
}
function paintPalette(items: PaletteItem[], sel: number): void {
  palItems = items;
  palSel = Math.min(sel, Math.max(items.length - 1, 0));
  let g = "";
  let html = "";
  palItems.forEach((x, i) => {
    if (x.g !== g) {
      g = x.g;
      html += `<div class="palette-group">${esc(g)}</div>`;
    }
    // Pagefind's excerpt is escaped text with <mark> around the matches
    const ex = x.ex ? `<span class="palette-ex">${x.ex}</span>` : "";
    html += `<a class="palette-item${ex ? " has-ex" : ""}" role="option" data-i="${i}" href="${x.href || "#"}"><span class="mono-ic" style="--c:${x.c}">${esc(x.ic)}</span><span class="palette-t">${esc(x.t)}${ex}</span><small>${esc(x.s)}</small></a>`;
  });
  palList.innerHTML = html || '<div class="palette-empty">Heç nə tapılmadı</div>';
  palList.querySelectorAll<HTMLElement>(".palette-item").forEach((a) => {
    a.addEventListener("mousemove", () => {
      palSel = +(a.dataset.i ?? 0);
      paintSel();
    });
    a.addEventListener("click", (e) => {
      if (!palItems[+(a.dataset.i ?? 0)].href) {
        e.preventDefault();
        toast("Bu bölmə tezliklə açılacaq");
      }
    });
  });
  paintSel();
}
function paintSel(): void {
  palList.querySelectorAll<HTMLElement>(".palette-item").forEach((a) => {
    const on = +(a.dataset.i ?? 0) === palSel;
    a.setAttribute("aria-selected", String(on));
    if (on) a.scrollIntoView({ block: "nearest" });
  });
}
export function openPalette(q?: string): void {
  if (!pal) buildPalette();
  const p = pal as HTMLElement;
  p.hidden = false;
  void loadPagefind(); // warm up, so the first query does not wait for the index
  palInput.value = q || "";
  renderPalette();
  palInput.focus();
}
function closePalette(): void {
  if (pal) pal.hidden = true;
}

// ---------- scroll reveal + count-up ----------
function countUp(el: HTMLElement): void {
  const to = +(el.dataset.count ?? 0);
  const dur = 1300;
  const t0 = performance.now();
  if (reduced) {
    el.textContent = String(to);
    return;
  }
  const step = (t: number): void => {
    const k = Math.min(1, (t - t0) / dur);
    el.textContent = String(Math.round(to * (1 - Math.pow(1 - k, 3))));
    if (k < 1) requestAnimationFrame(step);
  };
  step(t0);
}
const io = new IntersectionObserver(
  (ents) =>
    ents.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target as HTMLElement;
      el.classList.add("in");
      if (el.dataset.count != null) countUp(el);
      el.querySelectorAll<HTMLElement>("[data-count]").forEach(countUp);
      io.unobserve(el);
    }),
  { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
);
/** Starts revealing `[data-reveal]` / `[data-count]` elements below `scope` when they scroll into view. */
export function observe(scope?: ParentNode): void {
  (scope ?? document)
    .querySelectorAll("[data-reveal], [data-count]")
    .forEach((el) => io.observe(el));
}

/** Slight 3D tilt following the pointer (off for reduced motion and touch). */
export function tilt(scope: HTMLElement, max: number): void {
  if (reduced || matchMedia("(pointer: coarse)").matches) return;
  scope.addEventListener("pointermove", (e) => {
    const r = scope.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    scope.style.setProperty("--rx", (-y * max).toFixed(2) + "deg");
    scope.style.setProperty("--ry", (x * max).toFixed(2) + "deg");
  });
  scope.addEventListener("pointerleave", () => {
    scope.style.setProperty("--rx", "0deg");
    scope.style.setProperty("--ry", "0deg");
  });
}

// ---------- code rendering for static samples (the lessons use Shiki at build time) ----------
const KW =
  /^(package|import|func|return|var|const|type|struct|interface|map|chan|go|defer|if|else|for|range|switch|case|default|break|continue|select|fallthrough)$/;
export function hlGo(line: string): string {
  const out: string[] = [];
  const re =
    /(\/\/.*$)|("(?:[^"\\]|\\.)*"|`[^`]*`|'(?:[^'\\]|\\.)*')|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_]\w*\b)|([^\w"'`/]+|\/)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    if (m[1]) out.push(`<span class="tok-com">${esc(m[1])}</span>`);
    else if (m[2]) out.push(`<span class="tok-str">${esc(m[2])}</span>`);
    else if (m[3]) out.push(`<span class="tok-num">${m[3]}</span>`);
    else if (m[4]) {
      const w = m[4];
      const next = line.slice(re.lastIndex);
      if (KW.test(w)) out.push(`<span class="tok-kw">${w}</span>`);
      else if (/^(int|string|bool|float64|byte|rune|error|any)$/.test(w))
        out.push(`<span class="tok-type">${w}</span>`);
      else if (/^(len|cap|append|make|new|copy|delete|panic|nil|true|false)$/.test(w))
        out.push(`<span class="tok-builtin">${w}</span>`);
      else if (/^\s*\(/.test(next)) out.push(`<span class="tok-fn">${w}</span>`);
      else out.push(esc(w));
    } else out.push(esc(m[5]));
  }
  return out.join("");
}
export function renderCode(pre: HTMLElement, src: string): void {
  pre.innerHTML = src
    .replace(/\n$/, "")
    .split("\n")
    .map((l, i) => `<span class="ln" data-n="${i + 1}">${hlGo(l) || " "}</span>`)
    .join("");
}

// ---------- Aurora: flowing light ribbons in WebGL ----------
const FRAG = [
  "precision mediump float;",
  "uniform vec2 uRes; uniform float uT; uniform vec3 uC1, uC2, uC3, uC4; uniform float uGain;",
  "float hash(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }",
  "vec3 ribbon(vec2 p, float t, float seed, vec3 ca, vec3 cb, float tilt, float yoff, float amp, float freq){",
  "  vec3 col = vec3(0.0);",
  "  for (int i = 0; i < 9; i++) {",
  "    float fi = float(i);",
  "    float y = yoff + tilt * p.x + sin(p.x * freq + t * 0.32 + seed + fi * 0.09) * amp",
  "            + sin(p.x * freq * 2.1 - t * 0.21 + seed * 1.7 + fi * 0.13) * amp * 0.35;",
  "    y += (fi - 4.0) * 0.011 * (1.0 + 0.9 * sin(p.x * 1.3 + t * 0.2 + seed));",
  "    float d = abs(p.y - y);",
  "    float w = 0.0022 + 0.0035 * (0.5 + 0.5 * sin(p.x * 2.3 + seed + t * 0.15));",
  "    float g = w / (d + w); g *= g;",
  "    float fade = smoothstep(-1.25, -0.2, p.x + 0.3 * sin(seed)) * smoothstep(1.35, 0.25, p.x - 0.2 * cos(seed));",
  "    vec3 c = mix(ca, cb, 0.5 + 0.5 * sin(p.x * 1.4 + fi * 0.35 + t * 0.25 + seed));",
  "    col += c * g * fade * (0.3 + 0.7 * smoothstep(0.0, 1.0, 0.5 + 0.5 * sin(p.x * 3.0 + fi * 0.7 + t * 0.4)));",
  "  }",
  "  float yc = yoff + tilt * p.x + sin(p.x * freq + t * 0.32 + seed) * amp;",
  "  float haze = exp(-pow((p.y - yc) * 4.0, 2.0)) * 0.28;",
  "  col += mix(ca, cb, 0.5 + 0.5 * sin(p.x * 1.1 + t * 0.2)) * haze * smoothstep(-1.3, 0.0, p.x) * smoothstep(1.4, 0.2, p.x);",
  "  return col;",
  "}",
  "void main(){",
  "  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;",
  "  float t = uT;",
  "  vec3 col = ribbon(p, t, 0.0, uC1, uC2, -0.32, 0.02, 0.15, 1.9);",
  "  col += ribbon(p, t * 0.8, 2.4, uC2, uC3, 0.22, -0.1, 0.12, 2.4) * 0.8;",
  "  col += ribbon(p, t * 1.1, 4.1, uC4, uC1, -0.08, 0.2, 0.09, 1.4) * 0.55;",
  "  col = (1.0 - exp(-col * 1.25)) * uGain;",
  "  col += (hash(gl_FragCoord.xy + t) - 0.5) / 128.0;",
  "  float a = clamp(max(col.r, max(col.g, col.b)), 0.0, 1.0);",
  "  gl_FragColor = vec4(col, a);",
  "}",
].join("\n");

/** Reads a CSS custom property as an [r, g, b] triple in 0..1. */
export function cssColor(name: string): [number, number, number] {
  const probe = document.createElement("i");
  probe.style.color = `var(${name})`;
  probe.style.display = "none";
  document.body.appendChild(probe);
  const m = getComputedStyle(probe).color.match(/[\d.]+/g) ?? ["128", "128", "255"];
  probe.remove();
  return [+m[0] / 255, +m[1] / 255, +m[2] / 255];
}

export interface AuroraOptions {
  colors?: () => string[];
  scale?: number;
  start?: number;
  speed?: number;
}
export function aurora(canvas: HTMLCanvasElement, opts: AuroraOptions = {}): void {
  const gl = canvas.getContext("webgl", {
    antialias: false,
    alpha: true,
    premultipliedAlpha: true,
  });
  if (!gl) {
    canvas.classList.add("no-gl");
    return;
  }
  const sh = (type: number, src: string): WebGLShader => {
    const s = gl.createShader(type) as WebGLShader;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const prog = gl.createProgram() as WebGLProgram;
  gl.attachShader(
    prog,
    sh(gl.VERTEX_SHADER, "attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }"),
  );
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    canvas.classList.add("no-gl");
    return;
  }
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U: Record<string, WebGLUniformLocation | null> = {};
  ["uRes", "uT", "uC1", "uC2", "uC3", "uC4", "uGain"].forEach(
    (n) => (U[n] = gl.getUniformLocation(prog, n)),
  );
  const scale = opts.scale || 0.6;
  function colors(): void {
    const list = opts.colors ? opts.colors() : ["--cyan", "--accent", "--accent-2", "--accent-3"];
    gl!.uniform3fv(U.uC1, cssColor(list[0]));
    gl!.uniform3fv(U.uC2, cssColor(list[1]));
    gl!.uniform3fv(U.uC3, cssColor(list[2]));
    gl!.uniform3fv(U.uC4, cssColor(list[3]));
    gl!.uniform1f(U.uGain, isDark() ? 1.0 : 0.75);
  }
  function size(): void {
    const dpr = Math.min(devicePixelRatio || 1, 1.5) * scale;
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl!.viewport(0, 0, w, h);
      gl!.uniform2f(U.uRes, w, h);
    }
  }
  let visible = true;
  let raf = 0;
  const t0 = performance.now() - (opts.start || 14) * 1000;
  function draw(now?: number): void {
    size();
    gl!.uniform1f(U.uT, (((now ?? performance.now()) - t0) / 1000) * (opts.speed || 1));
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);
  }
  function loop(now: number): void {
    draw(now);
    raf = visible && !document.hidden ? requestAnimationFrame(loop) : 0;
  }
  colors();
  if (reduced) {
    draw();
    addEventListener("resize", () => draw());
    window.addEventListener("w3:look", () => {
      colors();
      draw();
    });
    canvas.classList.add("on");
    return;
  }
  new IntersectionObserver((e) => {
    visible = e[0].isIntersecting;
    if (visible && !raf) raf = requestAnimationFrame(loop);
  }).observe(canvas);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && visible && !raf) raf = requestAnimationFrame(loop);
  });
  window.addEventListener("w3:look", colors);
  raf = requestAnimationFrame(loop);
  canvas.classList.add("on");
}

// ---------- shell wiring (runs once per page) ----------
function initShell(): void {
  paintIcons();

  document.querySelectorAll<HTMLElement>("[data-look-menu]").forEach((m) => {
    m.innerHTML =
      '<div class="menu-label">Tema</div><div class="seg">' +
      [
        ["dark", "Tünd"],
        ["light", "Açıq"],
        ["system", "Sistem"],
      ]
        .map(([k, t]) => `<button data-theme-set="${k}">${t}</button>`)
        .join("") +
      '</div><div class="menu-label">Palitra</div><div class="swatches" role="radiogroup">' +
      PALETTES.map(
        ([k, t, a, b]) =>
          `<button class="swatch" role="radio" data-palette-set="${k}" title="${t}" aria-label="${t}" style="background:linear-gradient(135deg,${a},${b})"></button>`,
      ).join("") +
      "</div>";
  });
  document.addEventListener("click", (e) => {
    const target = e.target as Element;
    const t = target.closest<HTMLElement>("[data-theme-set]");
    if (t) applyTheme(t.dataset.themeSet ?? "system");
    const p = target.closest<HTMLElement>("[data-palette-set]");
    if (p) applyPalette(p.dataset.paletteSet ?? "nebula");
  });
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    paintLook();
    window.dispatchEvent(new Event("w3:look"));
  });
  paintLook();

  // technology mega menu (filled from data)
  document.querySelectorAll<HTMLElement>("[data-tech-menu]").forEach((m) => {
    const row = (
      x: { c: string; ic: string; name: string; status: string },
      href?: string,
    ): string =>
      (href ? `<a class="menu-item" href="${href}">` : '<span class="menu-item soon">') +
      `<span class="mono-ic" style="--c:${x.c}">${esc(x.ic)}</span>${esc(x.name)}` +
      `<small>${statusText(x.status)}</small>` +
      (href ? "</a>" : "</span>");
    m.innerHTML =
      `<div><div class="menu-label">Texnologiyalar</div>${TECHS.slice(0, 7)
        .map((t) => row(t, t.href))
        .join("")}</div>` +
      `<div><div class="menu-label">İstiqamətlər</div>${DIRECTIONS.map((d) => row(d, d.href)).join("")}` +
      '<div class="menu-label" style="margin-top:6px">Bölmələr</div>' +
      '<a class="menu-item" href="/#bolmeler"><span class="mono-ic" style="--c:#a98bff">Q&amp;A</span>Müsahibə<small>plan</small></a>' +
      '<a class="menu-item" href="/#bolmeler"><span class="mono-ic" style="--c:#22c3a6">O(n)</span>Alqoritmlər<small>plan</small></a></div>' +
      `<div class="mega-foot"><span>${TECHS.length} texnologiya · ${DIRECTIONS.length} istiqamət</span><a href="/#stack">Hamısına bax →</a></div>`;
  });

  // dropdown menus
  const closeMenus = (except?: Element | null): void => {
    document.querySelectorAll<HTMLElement>("[data-menu-btn]").forEach((b) => {
      const m = b.nextElementSibling as HTMLElement | null;
      if (m && m !== except) {
        m.hidden = true;
        b.setAttribute("aria-expanded", "false");
      }
    });
  };
  document.addEventListener("click", (e) => {
    const target = e.target as Element;
    const btn = target.closest("[data-menu-btn]");
    if (btn) {
      const m = btn.nextElementSibling as HTMLElement;
      closeMenus(m);
      m.hidden = !m.hidden;
      btn.setAttribute("aria-expanded", String(!m.hidden));
      return;
    }
    if (!target.closest(".menu")) closeMenus();
    if (target.closest("[data-open-search]")) openPalette();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMenus();
      closePalette();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (pal && !pal.hidden) closePalette();
      else openPalette();
    }
  });

  // mobile nav
  const header = document.querySelector<HTMLElement>(".site-header");
  document.querySelectorAll("[data-nav-toggle]").forEach((b) =>
    b.addEventListener("click", () => {
      const open = header?.classList.toggle("nav-open");
      b.setAttribute("aria-expanded", String(!!open));
    }),
  );
  // the header turns to glass after scrolling
  if (header && !header.classList.contains("solid")) {
    const onScroll = (): void => header.classList.toggle("scrolled", scrollY > 8);
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // pointer light on `.spot` cards
  document.addEventListener(
    "pointermove",
    (e) => {
      const el = (e.target as Element).closest?.<HTMLElement>(".spot");
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", e.clientX - r.left + "px");
      el.style.setProperty("--my", e.clientY - r.top + "px");
    },
    { passive: true },
  );

  // pages add content first and call observe() again; observe the static markup now
  observe();
}

initShell();
