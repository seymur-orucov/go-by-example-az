// Technology page (TechPage.astro): layers the visitor's progress (localStorage) on the build-time
// page and wires the section cards and the view switch. The aurora is tinted toward the
// technology's color (--tech-c / --tech-c-2, set on :root by TechPage).
import { aurora, learnedSet, observe, store } from "@platform/theme/scripts/v2";

const $ = <T extends Element>(sel: string, root: ParentNode = document): T | null =>
  root.querySelector<T>(sel);
const $$ = <T extends Element>(sel: string, root: ParentNode = document): T[] => [
  ...root.querySelectorAll<T>(sel),
];
const tech = document.querySelector<HTMLElement>("[data-tech-index]")?.dataset.techIndex ?? "go";
const pct = (a: number, b: number): number => (b ? Math.round((a / b) * 100) : 0);

aurora($<HTMLCanvasElement>("#tech-aurora")!, {
  colors: () => ["--tech-c-2", "--tech-c", "--accent", "--accent-2"],
  start: 30,
});

// ---------- progress ----------
// Topics in course order (the sections view lists each topic once).
const order = $$<HTMLAnchorElement>("#prog-sections [data-slug]");
// The next topic is the first unlearned one that has a lesson; planned topics are skipped.
const unlearned = order.filter((a) => !learnedSet.has(a.dataset.slug ?? ""));
const next = unlearned.find((a) => a.dataset.state !== "planned");
const done = order.filter((a) => learnedSet.has(a.dataset.slug ?? "")).length;

$("#st-done")!.textContent = String(done);
$("#gr-pct")!.textContent = `${pct(done, order.length)}%`;
requestAnimationFrame(() => {
  $<SVGElement>("#gr-bar")!.style.strokeDashoffset = String(
    263.9 * (1 - done / (order.length || 1)),
  );
});

const cont = $<HTMLAnchorElement>("#tech-continue")!;
if (next) {
  const title = $("b", next)!.textContent ?? "";
  const sub = $("small", next)!.textContent ?? "";
  const section =
    next.closest<HTMLElement>("[data-sec-card]")?.querySelector("h3")?.textContent ?? "";
  $("#gr-title")!.textContent = title;
  $("#gr-sub")!.textContent = `${sub} · ${section}`;
  $<HTMLAnchorElement>("#gr-next")!.href = cont.href = next.href;
  $("[data-continue-label]", cont)!.textContent = `${done ? "Davam et" : "Başla"}: ${title}`;
}

function paintTopics(): void {
  $$<HTMLAnchorElement>(".topic[data-slug]").forEach((a) => {
    const slug = a.dataset.slug ?? "";
    const planned = a.dataset.state === "planned";
    const em = $("em", a)!;
    a.classList.remove("done", "next", "ready", "soon");
    if (learnedSet.has(slug)) {
      a.classList.add("done");
      em.textContent = "✓";
    } else if (next && next.dataset.slug === slug) {
      a.classList.add("next");
      em.textContent = "növbəti";
    } else if (planned) {
      a.classList.add("soon");
      em.textContent = "tezliklə";
    } else {
      a.classList.add("ready");
      em.textContent = "hazır";
    }
  });
}
paintTopics();

$$<HTMLElement>("[data-sec-card]").forEach((card) => {
  const slugs = $$<HTMLElement>("[data-slug]", card).map((a) => a.dataset.slug ?? "");
  const d = slugs.filter((s) => learnedSet.has(s)).length;
  $<HTMLElement>("[data-bar-done]", card)!.style.width = `${pct(d, slugs.length)}%`;
  $("[data-done-text]", card)!.textContent = `${d} / ${slugs.length} öyrənilib`;
  const row = $<HTMLElement>(`[data-sec-row="${card.dataset.secCard}"]`);
  if (row) {
    $<HTMLElement>(".b i", row)!.style.width = `${pct(d, slugs.length)}%`;
    $(".c", row)!.textContent = `${d}/${slugs.length}`;
  }
});

// ---------- section cards: expand / collapse (remembered) ----------
const openSet = new Set(
  store.get<string[]>(
    `w3:${tech}-open`,
    $$<HTMLElement>(".sec-card.open").map((c) => c.dataset.secCard ?? ""),
  ),
);
$$<HTMLElement>(".sec-card").forEach((card) => {
  const open = openSet.has(card.dataset.secCard ?? "");
  card.classList.toggle("open", open);
  $<HTMLElement>(".sc-topics", card)!.hidden = !open;
  $<HTMLElement>(".sc-toggle", card)!.setAttribute("aria-expanded", String(open));
});
$("#prog-sections")!.addEventListener("click", (e) => {
  const b = (e.target as Element).closest<HTMLElement>(".sc-toggle");
  if (!b) return;
  const card = b.closest<HTMLElement>(".sec-card")!;
  const list = $<HTMLElement>(".sc-topics", card)!;
  const open = Boolean(list.hidden);
  list.hidden = !open;
  card.classList.toggle("open", open);
  b.setAttribute("aria-expanded", String(open));
  if (open) openSet.add(b.dataset.sec ?? "");
  else openSet.delete(b.dataset.sec ?? "");
  store.set(`w3:${tech}-open`, [...openSet]);
});

// ---------- view: sections / all topics ----------
function setView(v: string): void {
  store.set(`w3:${tech}-view`, v);
  $$<HTMLElement>("[data-view]").forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.view === v)),
  );
  $<HTMLElement>("#prog-sections")!.hidden = v !== "sections";
  $<HTMLElement>("#prog-all")!.hidden = v !== "all";
  observe($("#proqram")!);
}
$$<HTMLElement>("[data-view]").forEach((b) =>
  b.addEventListener("click", () => setView(b.dataset.view ?? "sections")),
);
setView(store.get(`w3:${tech}-view`, "sections"));
