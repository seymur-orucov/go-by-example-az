// Paints learned marks, per-section counts and the progress bar in the lesson sidebar.
// Repaints on the "goaz:learned" event (sent by saveLearned, e.g. the "Öyrəndim" button).
import { KEY_LEARNED, learnedSet, store } from "@platform/theme/scripts/v2";

function paint(): void {
  const sb = document.querySelector<HTMLElement>("[data-lesson-sidebar]");
  if (!sb) return;
  // another tab or the lesson button may have changed the stored list
  const stored = store.get<unknown>(KEY_LEARNED, []);
  learnedSet.clear();
  if (Array.isArray(stored)) stored.forEach((x) => typeof x === "string" && learnedSet.add(x));

  const links = sb.querySelectorAll<HTMLAnchorElement>(".sb-list a[data-slug]");
  let done = 0;
  links.forEach((a) => {
    const on = learnedSet.has(a.dataset.slug ?? "");
    if (on) done++;
    a.classList.toggle("done", on);
    a.classList.toggle("ready", !on && a.dataset.state === "ready");
    a.classList.toggle("plan", !on && a.dataset.state !== "ready");
    a.querySelector<HTMLElement>(".sb-ok")!.hidden = !on;
    const soon = a.querySelector<HTMLElement>(".sb-soon");
    if (soon) soon.hidden = on;
  });
  sb.querySelectorAll<HTMLElement>("[data-sb-count]").forEach((c) => {
    const slugs = (c.dataset.sbCount ?? "").split(" ");
    c.textContent = `${slugs.filter((s) => learnedSet.has(s)).length}/${slugs.length}`;
  });
  const pct = links.length ? Math.round((done / links.length) * 100) : 0;
  sb.querySelector("[data-sb-done]")!.textContent = String(done);
  sb.querySelector("[data-sb-pct]")!.textContent = String(pct);
  sb.querySelector<HTMLElement>("[data-sb-bar]")!.style.width = `${pct}%`;
}

paint();
addEventListener("goaz:learned", paint);

// Keep the current topic visible in a long sidebar (scroll only the sidebar, not the page).
const sidebar = document.querySelector<HTMLElement>("[data-lesson-sidebar]");
const current = sidebar?.querySelector<HTMLElement>("[aria-current='page']");
if (sidebar && current) {
  const top = current.getBoundingClientRect().top - sidebar.getBoundingClientRect().top;
  sidebar.scrollTop += top - sidebar.clientHeight / 2;
}
