// Paints learned marks, per-section counts and the progress bar in the lesson sidebar.
// Repaints on the "goaz:learned" event (sent by the "Öyrəndim" button).
import { store } from "@platform/theme/scripts/storage";

export const KEY_LEARNED = "goaz:learned";

export function readLearned(): Set<string> {
  const v = store.get<unknown>(KEY_LEARNED, []);
  return new Set(Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);
}

function paint(): void {
  const sb = document.querySelector<HTMLElement>("[data-lesson-sidebar]");
  if (!sb) return;
  const learned = readLearned();
  const links = sb.querySelectorAll<HTMLAnchorElement>(".sb-list a[data-slug]");
  let done = 0;
  links.forEach((a) => {
    const on = learned.has(a.dataset.slug!);
    if (on) done++;
    a.querySelector<HTMLElement>(".ok")!.hidden = !on;
  });
  sb.querySelectorAll<HTMLElement>("[data-sb-count]").forEach((c) => {
    const slugs = c.dataset.sbCount!.split(" ");
    c.textContent = `${slugs.filter((s) => learned.has(s)).length}/${slugs.length}`;
  });
  sb.querySelector("[data-sb-done]")!.textContent = String(done);
  const bar = sb.querySelector<HTMLElement>("[data-sb-bar]")!;
  bar.style.width = `${links.length ? Math.round((done / links.length) * 100) : 0}%`;
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
