// Progress painting and view switching for /go/. The page is fully rendered at build time;
// this script only layers the visitor's progress (localStorage) and interactions on top.
const KEY_LEARNED = "goaz:learned";
const KEY_VIEW = "goaz:view";

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

const $ = <T extends Element>(sel: string, root: ParentNode = document) =>
  root.querySelector<T>(sel);
const $$ = <T extends Element>(sel: string, root: ParentNode = document) => [
  ...root.querySelectorAll<T>(sel),
];

const learned = new Set(
  readJson<unknown[]>(KEY_LEARNED, []).filter((x): x is string => typeof x === "string"),
);
const iconTemplate = (id: string): string => $<HTMLTemplateElement>(`#icon-${id}`)?.innerHTML ?? "";
const CHECK = iconTemplate("check");

// Cards view keeps the course order; use it to find the next unlearned example.
const order = $$<HTMLElement>("#view-cards [data-slug]").map((el) => el.dataset.slug!);
const nextSlug = order.find((s) => !learned.has(s));

function paintProgress(): void {
  // Per-example state
  $$<HTMLElement>("[data-slug]").forEach((el) => {
    const slug = el.dataset.slug!;
    const done = learned.has(slug);
    const next = slug === nextSlug;
    if (el.matches(".leaf")) {
      el.classList.toggle("done", done);
      el.classList.toggle("next", next && !done);
      return;
    }
    $("a", el)?.classList.toggle("next", next && el.closest("#view-cards") !== null);
    const check = $<HTMLElement>("[data-check]", el);
    if (check) {
      check.classList.toggle("empty", !done);
      check.innerHTML = done ? CHECK : iconTemplate("circle");
    }
    const sub = $<HTMLElement>("[data-sub]", el);
    if (sub) sub.textContent = next && !done ? "növbəti" : (el.dataset.subtitle ?? "");
    const doneMark = $<HTMLElement>("[data-done-mark]", el);
    const todoMark = $<HTMLElement>("[data-todo-mark]", el);
    if (doneMark && todoMark) {
      doneMark.hidden = !done;
      todoMark.hidden = done;
    }
  });

  // Per-group counters and bars
  $$<HTMLElement>("[data-group]").forEach((g) => {
    const slugs = $$<HTMLElement>("[data-slug]", g);
    const done = slugs.filter((el) => learned.has(el.dataset.slug!)).length;
    const counter = $("[data-done]", g);
    if (counter) counter.textContent = String(done);
    const bar = $<HTMLElement>("[data-bar]", g);
    if (bar) bar.style.width = `${slugs.length ? Math.round((done / slugs.length) * 100) : 0}%`;
  });

  // Hero progress card
  const total = order.length;
  const done = order.filter((s) => learned.has(s)).length;
  const ring = $<SVGElement>("#ring-bar");
  if (ring) ring.style.strokeDashoffset = String(144.5 * (1 - (total ? done / total : 0)));
  const pct = $("#ring-pct");
  if (pct) pct.textContent = `${total ? Math.round((done / total) * 100) : 0}%`;
  const title = $("#r-title");
  if (title) title.textContent = `${done} / ${total} nümunə öyrənilib`;
  const nextEl = nextSlug ? $<HTMLElement>(`#view-cards [data-slug="${nextSlug}"]`) : null;
  const nextLink = $<HTMLAnchorElement>("#r-next");
  if (nextEl && nextLink) {
    nextLink.href = $<HTMLAnchorElement>("a", nextEl)!.href;
    const section = nextEl.closest(".section-card")?.querySelector("h3")?.textContent ?? "";
    $("#r-next-title")!.textContent = nextEl.dataset.title ?? "";
    $("#r-next-sub")!.textContent = [nextEl.dataset.subtitle, section].filter(Boolean).join(" · ");
  }
}

// "+ daha N nümunə"
$("#view-cards")?.addEventListener("click", (e) => {
  const btn = (e.target as Element).closest<HTMLElement>("[data-more]");
  if (!btn) return;
  $$<HTMLElement>("li[hidden]", btn.parentElement!).forEach((li) => (li.hidden = false));
  btn.remove();
});

// View switch
const views: Record<string, string> = {
  cards: "view-cards",
  tracks: "view-tracks",
  map: "view-map",
};
function setView(v: string): void {
  Object.entries(views).forEach(([k, id]) => {
    document.getElementById(id)!.hidden = k !== v;
  });
  $$<HTMLElement>("[data-view]").forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.view === v)),
  );
  writeJson(KEY_VIEW, v);
}
$$<HTMLElement>("[data-view]").forEach((b) =>
  b.addEventListener("click", () => setView(b.dataset.view!)),
);

// Tracks view: pick a section, filter by state
let currentTrack = nextSlug
  ? ($<HTMLElement>(`[data-panel] [data-slug="${nextSlug}"]`)?.closest<HTMLElement>("[data-panel]")
      ?.dataset.panel ?? "")
  : "";
if (!currentTrack) currentTrack = $<HTMLElement>("[data-panel]")?.dataset.panel ?? "";
let filter = "all";

function paintTrack(): void {
  $$<HTMLElement>("[data-track]").forEach((t) =>
    t.setAttribute("aria-pressed", String(t.dataset.track === currentTrack)),
  );
  $$<HTMLElement>("[data-panel]").forEach((p) => {
    p.hidden = p.dataset.panel !== currentTrack;
    if (p.hidden) return;
    let visible = 0;
    $$<HTMLElement>(".row", p).forEach((row) => {
      const done = learned.has(row.dataset.slug!);
      const show = filter === "all" || (filter === "done") === done;
      row.hidden = !show;
      if (show) visible++;
    });
    const empty = $<HTMLElement>(".rows-empty", p);
    if (empty) empty.hidden = visible > 0;
  });
}
$$<HTMLElement>("[data-track]").forEach((t) =>
  t.addEventListener("click", () => {
    currentTrack = t.dataset.track!;
    paintTrack();
    document.getElementById("track-view")?.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  }),
);
$("#filter")?.addEventListener("click", (e) => {
  const b = (e.target as Element).closest<HTMLElement>("[data-f]");
  if (!b) return;
  filter = b.dataset.f!;
  $$<HTMLElement>("#filter [data-f]").forEach((x) =>
    x.setAttribute("aria-pressed", String(x === b)),
  );
  paintTrack();
});

paintProgress();
paintTrack();
const savedView = readJson<string>(KEY_VIEW, "cards");
if (savedView in views) setView(savedView);
