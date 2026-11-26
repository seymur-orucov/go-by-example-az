// Roadmap page: Go technology roadmap and Backend direction preview, spine graph with drawn
// connectors and a sticky five-facet node panel. The kind (tech | dir) comes from the route.
import { TECHS } from "@platform/theme/data/platform";
import {
  FLAT,
  I,
  READY,
  esc,
  learnedSet as ls,
  lessonHref,
  observe,
  paintIcons,
  reduced,
  renderCode,
  saveLearned,
  store,
  toast,
} from "@platform/theme/scripts/v2";
import { NODES } from "../data/roadmap-nodes";

interface Item {
  slug: string;
  title: string;
  sub: string;
  ready: boolean;
}
interface Section {
  id: string;
  title: string;
  level: string;
  items: Item[];
}
interface PageData {
  kind: "tech" | "dir";
  sections: Section[];
}
interface MapSection {
  c: string;
  ic: string;
  kicker: string;
  title: string;
  level?: string;
  done?: number;
  total?: number;
  note?: string;
  nodes: ((side: string) => string)[];
}

const $ = <T extends HTMLElement = HTMLElement>(s: string, r: ParentNode = document): T =>
  r.querySelector(s) as T;
const $$ = <T extends HTMLElement = HTMLElement>(s: string, r: ParentNode = document): T[] =>
  Array.from(r.querySelectorAll<T>(s));

const data = JSON.parse($("#roadmap-data").textContent ?? "{}") as PageData;
const kind = data.kind;
const motion = !reduced;
const META = (slug: string): (typeof FLAT)[number] | undefined => FLAT.find((e) => e.slug === slug);
const TECH = (id: string) => TECHS.find((t) => t.id === id);

// Direction roadmap preview. On the platform: content/roadmaps/backend.yaml; Go nodes reference technology content.
const BACKEND: { tech: string; items?: string[]; slugs?: string[] }[] = [
  { tech: "git", items: ["Git əsasları", "Branch və merge", "Pull request axını"] },
  { tech: "linux", items: ["Terminal və fayl sistemi", "Proseslər və icazələr"] },
  { tech: "http", items: ["HTTP sorğu və cavab", "REST API dizaynı", "DNS və TLS"] },
  {
    tech: "go",
    slugs: [
      "variables",
      "functions",
      "structs",
      "interfaces",
      "errors",
      "goroutines",
      "channels",
      "context",
      "http-server",
      "testing-and-benchmarking",
    ],
  },
  { tech: "sql", items: ["SELECT və JOIN", "Index-lər", "Tranzaksiyalar", "Miqrasiyalar"] },
  { tech: "docker", items: ["Image və container", "Dockerfile", "Docker Compose"] },
  { tech: "k8s", items: ["Pod və Deployment", "Service və Ingress"] },
];
const BE_GO = (BACKEND.find((g) => g.slugs)?.slugs ?? []).filter((s) => META(s));

let filter = store.get("w3:rm-filter", "all");
let cur: string | null = null;
let tab = "theory";
const mapEl = $("#rm-map");
const panel = $("#rm-panel");
const scrim = $("#rm-scrim");

const scope = (): string[] => (kind === "tech" ? FLAT.map((e) => e.slug) : BE_GO);
const nextOf = (list: string[]): string | undefined => list.find((s) => !ls.has(s));
type State = "done" | "next" | "ready" | "planned";
function stateOf(slug: string): State {
  if (ls.has(slug)) return "done";
  if (slug === nextOf(scope())) return "next";
  return READY.has(slug) ? "ready" : "planned";
}
const passes = (slug: string): boolean => filter === "all" || (filter === "done") === ls.has(slug);

function pill(slug: string, side: string): string {
  const m = META(slug);
  if (!m) return "";
  const st = stateOf(slug);
  const tag =
    st === "done"
      ? '<em class="ok">✓</em>'
      : st === "next"
        ? '<em class="nx">növbəti</em>'
        : st === "planned"
          ? '<em class="sn">tezliklə</em>'
          : "";
  return `<button class="pill glass ${st}" data-slug="${slug}" data-side="${side}" aria-pressed="${slug === cur}"><i class="pd"></i><span><b>${esc(m.title)}</b><small>${esc(m.sub)}</small></span>${tag}</button>`;
}
const soonPill = (t: string, side: string): string =>
  `<span class="pill glass soon" data-side="${side}" title="Tezliklə"><i class="pd"></i><span><b>${esc(t)}</b><small>tezliklə</small></span></span>`;

/** A section: the hub in the middle, topics alternate left / right. */
function section(o: MapSection): string {
  const L: MapSection["nodes"] = [];
  const R: MapSection["nodes"] = [];
  o.nodes.forEach((n, i) => (i % 2 ? R : L).push(n));
  const hub =
    o.total && o.done !== undefined
      ? `<div class="hub-bar"><i style="width:${Math.round((o.done / o.total) * 100)}%"></i></div><small class="hub-n">${o.done} / ${o.total}${o.level ? " · " + o.level : ""}</small>`
      : `<small class="hub-n">${esc(o.note ?? "")}</small>`;
  return (
    `<section class="rm-sec" style="--c:${o.c}" data-reveal>` +
    '<svg class="rm-wires" aria-hidden="true"></svg>' +
    `<div class="rm-side left">${L.map((n) => n("left")).join("")}</div>` +
    `<div class="rm-hub glass dots"><span class="mono-ic" style="--c:${o.c}">${esc(o.ic)}</span><div class="hub-t"><small>${esc(o.kicker)}</small><b>${esc(o.title)}</b></div>${hub}</div>` +
    `<div class="rm-side right">${R.map((n) => n("right")).join("")}</div></section>`
  );
}

function renderMap(): void {
  let html: string;
  if (kind === "tech") {
    html = data.sections
      .map((s, si) => {
        const items = s.items.filter((it) => passes(it.slug));
        if (!items.length) return "";
        return section({
          c: "#00add8",
          ic: String(si + 1).padStart(2, "0"),
          kicker: "Bölmə " + (si + 1),
          title: s.title,
          level: s.level,
          done: s.items.filter((it) => ls.has(it.slug)).length,
          total: s.items.length,
          nodes: items.map((it) => (side) => pill(it.slug, side)),
        });
      })
      .join("");
  } else {
    html = BACKEND.map((g, gi) => {
      const t = TECH(g.tech);
      if (!t) return "";
      if (g.slugs) {
        const items = BE_GO.filter(passes);
        return section({
          c: t.c,
          ic: t.ic,
          kicker: "Addım " + (gi + 1) + " · aktiv",
          title: t.name,
          done: BE_GO.filter((s) => ls.has(s)).length,
          total: BE_GO.length,
          nodes: items.map((slug) => (side) => pill(slug, side)),
        });
      }
      if (filter === "done") return "";
      const items = g.items ?? [];
      return section({
        c: t.c,
        ic: t.ic,
        kicker: "Addım " + (gi + 1),
        title: t.name,
        note: "tezliklə · " + items.length + " mövzu",
        nodes: items.map((it) => (side) => soonPill(it, side)),
      });
    }).join("");
  }
  const end =
    '<div class="rm-end glass"><span class="badge ' +
    (kind === "tech" ? "live" : "next") +
    '">' +
    (kind === "tech" ? "son" : "önizləmə") +
    "</span>" +
    (kind === "tech"
      ? "Go yolu burada bitir — növbəti addım istiqamətdir."
      : "Backend xəritəsi Go-dan sonra digər texnologiyalarla dolacaq.") +
    "</div>";
  mapEl.innerHTML = html
    ? '<div class="rm-spine" aria-hidden="true"></div>' + html + end
    : '<p class="rm-empty glass">Bu filtrdə mövzu yoxdur.</p>';
  observe(mapEl);
  drawWires();
  paintHead();
}

// ---------- connectors: hub edge → each pill edge ----------
function rel(el: HTMLElement, anc: HTMLElement): { x: number; y: number; w: number; h: number } {
  let x = 0;
  let y = 0;
  let n: HTMLElement | null = el;
  while (n && n !== anc) {
    x += n.offsetLeft;
    y += n.offsetTop;
    n = n.offsetParent as HTMLElement | null;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}
function drawWires(): void {
  $$(".rm-sec", mapEl).forEach((sec) => {
    const svg = $(".rm-wires", sec);
    if (getComputedStyle(svg).display === "none") {
      svg.innerHTML = "";
      return;
    }
    const hub = rel($(".rm-hub", sec), sec);
    let out = "";
    $$(".pill", sec).forEach((p) => {
      const r = rel(p, sec);
      const left = p.dataset.side === "left";
      const x1 = left ? hub.x : hub.x + hub.w;
      const y1 = hub.y + hub.h / 2;
      const x2 = left ? r.x + r.w : r.x;
      const y2 = r.y + r.h / 2;
      const dx = (x2 - x1) * 0.5;
      const cls = p.classList.contains("done")
        ? "done"
        : p.dataset.slug && p.dataset.slug === cur
          ? "on"
          : p.classList.contains("next")
            ? "next"
            : p.classList.contains("soon")
              ? "soon"
              : "";
      out += `<path class="${cls}" d="M${x1} ${y1} C${x1 + dx} ${y1} ${x2 - dx} ${y2} ${x2} ${y2}"/>`;
    });
    svg.innerHTML = out;
  });
}

// ---------- head: titles, progress ring, next ----------
function paintHead(): void {
  const list = scope();
  const done = list.filter((s) => ls.has(s)).length;
  const pct = list.length ? Math.round((done / list.length) * 100) : 0;
  $("#rm-sub").textContent =
    kind === "tech"
      ? `${data.sections.length} bölmə, ${FLAT.length} mövzu — sadədən mürəkkəbə. Mövzuya bas: izah, kod, vizual, test və müsahibə sualı bir paneldədir.`
      : "Git → Linux → HTTP → Go → SQL → Docker → Kubernetes. İstiqamət texnologiyaların node-larına istinad edir — məzmun təkrarlanmır. Hazırda Go hissəsi aktivdir.";
  $("#rm-done").textContent = `${done} / ${list.length}`;
  $("#rm-done-label").textContent =
    kind === "tech" ? "mövzu öyrənilib" : "Go mövzusu öyrənilib (istiqamətdə)";
  $("#rm-pct").textContent = pct + "%";
  $("#rm-ring").style.strokeDashoffset = String(
    263.9 * (1 - (list.length ? done / list.length : 0)),
  );
  const nx = nextOf(list);
  const a = $<HTMLAnchorElement>("#rm-next");
  const nm = nx ? META(nx) : undefined;
  if (nx && nm) {
    a.hidden = false;
    a.href = "#" + nx;
    $("#rm-next-t").textContent = nm.title + " →";
  } else a.hidden = true;
  $$("[data-filter]").forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.filter === filter)),
  );
}

// ---------- node panel ----------
const TABS: [string, string, string][] = [
  ["theory", "Nəzəriyyə", "book"],
  ["practice", "Praktika", "code"],
  ["visual", "Vizual", "eye"],
  ["test", "Test", "check"],
  ["interview", "Müsahibə", "chat"],
];
$("#rp-tabs").innerHTML = TABS.map(
  ([id, t, ic]) =>
    `<button role="tab" data-tab="${id}" aria-selected="false">${I[ic]}<span>${t}</span></button>`,
).join("");

function facet(slug: string): string {
  const n = NODES[slug];
  const m = META(slug);
  const ready = READY.has(slug);
  const soon = (t: string): string => `<p class="rp-soon">${t}</p>`;
  if (!m) return "";
  if (tab === "theory")
    return n
      ? `<p class="rp-text">${n.theory}</p>`
      : soon(
          (ready ? "Dərs hazırdır: " : "Bu mövzunun izahı hazırlanır: ") +
            `<b>${esc(m.sub)}</b>. ` +
            (ready ? "Tam izah dərs səhifəsindədir." : "Tezliklə əlavə olunacaq."),
        );
  if (tab === "practice")
    return n
      ? `<div class="rp-code"><div class="win-head"><span class="win-dots"><i></i><i></i><i></i></span>main.go</div><pre class="code" data-code></pre></div><div class="rp-out">${esc(n.out).replace(/\n/g, "<br>")}</div>`
      : soon(
          ready
            ? "İşlək nümunə dərs səhifəsindədir."
            : "İşlək nümunə və tapşırıq tezliklə əlavə olunacaq.",
        );
  if (tab === "visual")
    return n
      ? `<ol class="rp-steps">${n.steps.map((s, i) => `<li style="--i:${i}"><span>${String(i + 1).padStart(2, "0")}</span><code>${esc(s)}</code></li>`).join("")}</ol>`
      : soon("Bu mövzu üçün addım-addım vizual izah hazırlanır.");
  if (tab === "test")
    return n
      ? `<p class="rp-q">${n.quiz.q}</p>` +
          (n.quiz.code ? '<div class="rp-code"><pre class="code" data-qcode></pre></div>' : "") +
          `<div class="rp-opts">${n.quiz.opts.map((o, i) => `<button data-opt="${i}"><code>${esc(o)}</code></button>`).join("")}</div><p class="rp-why" id="rp-why"></p>`
      : soon(
          ready
            ? "Bu mövzunun testi dərs səhifəsinin sonundadır."
            : "Bu mövzunun testi tezliklə əlavə olunacaq.",
        );
  return n
    ? `<p class="rp-q"><span class="badge next">${n.interview.lvl}</span> ${n.interview.q}</p><div class="rp-ans blur" id="rp-ans">${n.interview.a}</div><button class="btn btn-sm" id="rp-reveal">Cavabı göstər</button><p class="rp-note">Önizləmə · Müsahibə bölməsi planlaşdırılır</p>`
    : soon("Bu mövzu üzrə müsahibə sualları tezliklə əlavə olunacaq.");
}
function renderBody(): void {
  if (!cur) return;
  const body = $("#rp-body");
  const n = NODES[cur];
  body.innerHTML = facet(cur);
  const pre = body.querySelector<HTMLElement>("[data-code]");
  if (pre && n) renderCode(pre, n.code);
  const qpre = body.querySelector<HTMLElement>("[data-qcode]");
  if (qpre && n?.quiz.code) renderCode(qpre, n.quiz.code);
  body.querySelectorAll<HTMLElement>("[data-opt]").forEach((b) =>
    b.addEventListener("click", () => {
      if (!n) return;
      const ok = +(b.dataset.opt ?? -1) === n.quiz.ok;
      b.classList.add(ok ? "ok" : "bad");
      $("#rp-why").innerHTML = ok ? "Düzdür. " + (n.quiz.why ?? "") : "Yenidən cəhd et.";
    }),
  );
  const rv = body.querySelector<HTMLElement>("#rp-reveal");
  if (rv)
    rv.addEventListener("click", () => {
      $("#rp-ans").classList.remove("blur");
      rv.remove();
    });
  $$("#rp-tabs [data-tab]").forEach((b) =>
    b.setAttribute("aria-selected", String(b.dataset.tab === tab)),
  );
  body.classList.remove("in");
  void body.offsetWidth;
  body.classList.add("in");
}
function paintPanel(): void {
  if (!cur) return;
  const m = META(cur);
  if (!m) return;
  const st = stateOf(cur);
  $("#rp-crumb").textContent = (kind === "dir" ? "Backend · " : "") + "Go · " + m.section;
  $("#rp-title").textContent = m.title;
  $("#rp-status").innerHTML =
    st === "done"
      ? '<span class="badge live">öyrənilib</span>'
      : st === "next"
        ? '<span class="badge next">növbəti</span>'
        : st === "ready"
          ? '<span class="badge plan">hazırdır</span>'
          : '<span class="badge later">tezliklə</span>';
  const go = $<HTMLAnchorElement>("#rp-go");
  go.href = lessonHref(cur);
  (go.firstChild as Text).textContent = READY.has(cur) ? "Dərsə keç " : "Mövzuya bax ";
  const learned = ls.has(cur);
  const lb = $("#rp-learn");
  lb.setAttribute("aria-pressed", String(learned));
  lb.textContent = learned ? "✓ Öyrənilib" : "Öyrəndim";
  lb.classList.toggle("is-on", learned);
  renderBody();
}
function select(slug: string, opts: { open?: boolean; scroll?: boolean } = {}): void {
  cur = slug;
  $$(".pill[data-slug]", mapEl).forEach((p) =>
    p.setAttribute("aria-pressed", String(p.dataset.slug === slug)),
  );
  drawWires();
  paintPanel();
  try {
    history.replaceState(null, "", "#" + slug);
  } catch {
    /* ignore */
  }
  if (opts.open) openSheet();
  if (opts.scroll) {
    const p = mapEl.querySelector(`.pill[data-slug="${slug}"]`);
    if (p) p.scrollIntoView({ block: "center", behavior: motion ? "smooth" : "auto" });
  }
}

// bottom sheet on narrow screens
const narrow = (): boolean => matchMedia("(max-width: 1100px)").matches;
function openSheet(): void {
  if (!narrow()) return;
  panel.classList.add("open");
  scrim.hidden = false;
}
function closeSheet(): void {
  panel.classList.remove("open");
  scrim.hidden = true;
}
$("#rm-close").addEventListener("click", closeSheet);
scrim.addEventListener("click", closeSheet);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeSheet();
});

// ---------- events ----------
mapEl.addEventListener("click", (e) => {
  const t = e.target as Element;
  const p = t.closest<HTMLElement>(".pill[data-slug]");
  if (p?.dataset.slug) {
    select(p.dataset.slug, { open: true });
    return;
  }
  if (t.closest(".pill.soon")) toast("Bu mövzu tezliklə əlavə olunacaq");
});
$("#rp-tabs").addEventListener("click", (e) => {
  const b = (e.target as Element).closest<HTMLElement>("[data-tab]");
  if (b?.dataset.tab) {
    tab = b.dataset.tab;
    renderBody();
  }
});
$("#rp-tabs").addEventListener("keydown", (e) => {
  if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
  const i = TABS.findIndex((t) => t[0] === tab);
  const n = (i + (e.key === "ArrowRight" ? 1 : -1) + TABS.length) % TABS.length;
  tab = TABS[n]?.[0] ?? tab;
  renderBody();
  ($("#rp-tabs").children[n] as HTMLElement).focus();
});
$("#rp-learn").addEventListener("click", () => {
  if (!cur) return;
  const m = META(cur);
  if (ls.has(cur)) ls.delete(cur);
  else ls.add(cur);
  saveLearned();
  toast(ls.has(cur) ? `${m?.title} — öyrənildi ✓` : `${m?.title} — qeyd silindi`);
  renderMap();
  select(cur);
});
$$("[data-filter]").forEach((b) =>
  b.addEventListener("click", () => {
    filter = b.dataset.filter ?? "all";
    store.set("w3:rm-filter", filter);
    renderMap();
    if (cur) select(cur);
  }),
);
$("#rm-next").addEventListener("click", (e) => {
  e.preventDefault();
  const nx = nextOf(scope());
  if (nx) select(nx, { open: true, scroll: true });
});

// ---------- start: deep link #slug (legacy #backend/slug accepted) ----------
function fromHash(): void {
  const h = decodeURIComponent(location.hash.slice(1)).replace(/^backend\/?/, "");
  const start = h && scope().includes(h) ? h : null;
  renderMap();
  const first = start ?? nextOf(scope()) ?? scope()[0];
  if (first) select(first, { scroll: !!start, open: !!start });
}
addEventListener("hashchange", fromHash);
addEventListener("resize", drawWires);
fromHash();
paintIcons();
observe();
if (document.fonts) void document.fonts.ready.then(drawWires);
