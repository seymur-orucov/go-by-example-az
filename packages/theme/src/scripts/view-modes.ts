// Lesson page view modes, ported from design/d/d.js: hide sidebar, content width
// (centered / full), Zen. State lives on <html>: data-sidebar="off", data-width="full", data-zen.
// Sidebar and width persist in localStorage, Zen only for this tab (sessionStorage).
// Keys: [ sidebar, F width, Z zen, Esc leaves zen. Layout.astro applies the state before first paint.
import { toast } from "./toast";

const root = document.documentElement;
const narrow = () => matchMedia("(max-width: 980px)").matches;
const typing = () => {
  const a = document.activeElement as HTMLElement | null;
  return !!a && (/INPUT|TEXTAREA|SELECT/.test(a.tagName) || a.isContentEditable);
};
const save = (store: Storage, key: string, value: string | null) => {
  try {
    if (value === null) store.removeItem(key);
    else store.setItem(key, value);
  } catch {
    /* storage unavailable */
  }
};

export function initViewModes(): void {
  if (!document.querySelector(".layout")) return;

  const isOff = () => root.getAttribute("data-sidebar") === "off";
  const isFull = () => root.getAttribute("data-width") === "full";
  const isZen = () => root.hasAttribute("data-zen");
  const all = (sel: string, fn: (el: HTMLElement) => void) =>
    document.querySelectorAll<HTMLElement>(sel).forEach(fn);

  // The layout changed: the sticky code pane recomputes its offset (also after the transition).
  const notify = () => {
    dispatchEvent(new Event("goaz:layout"));
    setTimeout(() => dispatchEvent(new Event("goaz:layout")), 320);
  };

  function paint() {
    all("[data-sb-toggle]", (b) => b.setAttribute("aria-pressed", String(!isOff())));
    all('[data-act="sidebar"]', (b) => b.setAttribute("aria-checked", String(!isOff())));
    all("[data-width-opt]", (b) =>
      b.setAttribute("aria-checked", String((b.dataset.widthOpt === "full") === isFull())),
    );
    all("[data-zen-toggle]", (b) => b.setAttribute("aria-pressed", String(isZen())));
    all("[data-zen-label]", (l) => (l.textContent = isZen() ? "Çıx" : "Zen"));
  }

  // Keep the text being read in place when the header and crumbs disappear.
  function keepAnchor(fn: () => void) {
    const hit = document.elementFromPoint(innerWidth * 0.3, innerHeight * 0.4);
    const el = hit?.closest(".step, .lead, .lesson-head, .chips, .after > *, .pager");
    const before = el?.getBoundingClientRect().top ?? 0;
    fn();
    if (el)
      scrollTo({ top: scrollY + el.getBoundingClientRect().top - before, behavior: "instant" });
  }

  function setSidebar(on: boolean) {
    if (on) root.removeAttribute("data-sidebar");
    else root.setAttribute("data-sidebar", "off");
    save(localStorage, "goaz:sidebar", on ? "on" : "off");
    paint();
    notify();
  }
  function toggleSidebar() {
    if (narrow()) {
      document.body.classList.toggle("drawer-open");
      return;
    }
    if (isZen()) {
      setZen(false);
      setSidebar(true);
      return;
    }
    setSidebar(isOff());
  }

  function setWidth(full: boolean) {
    if (full === isFull()) return;
    if (full) root.setAttribute("data-width", "full");
    else root.removeAttribute("data-width");
    save(localStorage, "goaz:width", full ? "full" : "center");
    paint();
    notify();
  }

  const bar = document.querySelector<HTMLElement>(".zen-bar");
  let peekTimer: number | undefined;
  function peek() {
    if (!bar) return;
    bar.classList.add("show");
    clearTimeout(peekTimer);
    peekTimer = window.setTimeout(() => bar.classList.remove("show"), 2400);
  }

  function setZen(on: boolean) {
    if (on === isZen()) return;
    keepAnchor(() => {
      if (on) root.setAttribute("data-zen", "");
      else root.removeAttribute("data-zen");
    });
    save(sessionStorage, "goaz:zen", on ? "1" : null);
    document.body.classList.remove("drawer-open");
    all(".menu", (m) => (m.hidden = true));
    const art = document.querySelector<HTMLElement>(".article");
    if (art) {
      art.classList.remove("mode-in");
      void art.offsetWidth;
      art.classList.add("mode-in");
    }
    paint();
    notify();
    progress();
    if (on) {
      peek();
      toast("Zen rejimi — çıxmaq üçün Esc");
    }
  }

  // Zen: thin reading progress bar at the top.
  const pr = document.querySelector<HTMLElement>(".read-progress span");
  let raf = 0;
  function progress() {
    if (!pr || !isZen() || raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const max = root.scrollHeight - innerHeight;
      pr.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
    });
  }
  addEventListener("scroll", progress, { passive: true });
  addEventListener(
    "mousemove",
    (e) => {
      if (isZen() && e.clientY > innerHeight - 90 && e.clientX < 420) peek();
    },
    { passive: true },
  );

  document.addEventListener("click", (e) => {
    const t = e.target as Element;
    if (t.closest("[data-sb-toggle], [data-act='sidebar']")) toggleSidebar();
    const w = t.closest<HTMLElement>("[data-width-opt]");
    if (w) setWidth(w.dataset.widthOpt === "full");
    if (t.closest("[data-zen-toggle]")) setZen(!isZen());
  });

  // Capture phase: when the search palette is open, Esc belongs to it.
  addEventListener(
    "keydown",
    (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || typing()) return;
      if (document.querySelector(".palette-backdrop.open")) return;
      if (e.key === "Escape" && isZen()) {
        setZen(false);
        return;
      }
      // e.code does not depend on the keyboard layout (on the AZ layout [ is "ö").
      if (e.code === "BracketLeft" || (!e.code && e.key === "[")) {
        e.preventDefault();
        toggleSidebar();
      } else if (e.code === "KeyF" && !isZen()) {
        // Zen is always centered.
        e.preventDefault();
        setWidth(!isFull());
        toast(isFull() ? "Kontent: tam en" : "Kontent: mərkəzdə");
      } else if (e.code === "KeyZ") {
        e.preventDefault();
        setZen(!isZen());
      }
    },
    true,
  );

  paint();
  if (isZen()) {
    progress();
    peek();
  }
}
