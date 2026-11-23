import { initMenus } from "./menus";
import { buildPalette, type SearchEntry } from "./search";
import { initSpy } from "./spy";
import { initTheme } from "./theme";

function readSearchIndex(): SearchEntry[] {
  const el = document.getElementById("search-index");
  try {
    return el?.textContent ? (JSON.parse(el.textContent) as SearchEntry[]) : [];
  } catch {
    return [];
  }
}

function init(): void {
  initTheme();
  initMenus();
  initSpy();
  const palette = buildPalette(readSearchIndex());
  document
    .querySelectorAll("[data-open-search]")
    .forEach((b) => b.addEventListener("click", () => palette.open()));

  // Mobile drawer
  document
    .querySelectorAll("[data-menu-toggle]")
    .forEach((b) =>
      b.addEventListener("click", () => document.body.classList.toggle("drawer-open")),
    );
  document
    .querySelector(".scrim")
    ?.addEventListener("click", () => document.body.classList.remove("drawer-open"));

  document.addEventListener("keydown", (ev) => {
    const a = document.activeElement as HTMLElement | null;
    const typing = !!a && (/INPUT|TEXTAREA/.test(a.tagName) || a.isContentEditable);
    if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === "k") {
      ev.preventDefault();
      if (palette.isOpen()) palette.close();
      else palette.open();
      return;
    }
    if (ev.key === "Escape") {
      if (palette.isOpen()) palette.close();
      document.body.classList.remove("drawer-open");
      return;
    }
    if (typing || palette.isOpen()) return;
    if (ev.key === "/") {
      ev.preventDefault();
      palette.open();
    }
    if (ev.key === "ArrowLeft" || ev.key === "ArrowRight") {
      const link = document.querySelector(ev.key === "ArrowLeft" ? "[data-prev]" : "[data-next]");
      const href = link?.getAttribute("href");
      if (href) location.href = href;
    }
  });
}

init();
