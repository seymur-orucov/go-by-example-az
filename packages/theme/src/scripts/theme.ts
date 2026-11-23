import { icons } from "./icons";
import { store } from "./storage";
import { toast } from "./toast";

const root = document.documentElement;

const PALETTES = [
  {
    id: "nebula",
    name: "Nebula",
    desc: "göy → bənövşəyi",
    sw: "linear-gradient(135deg,#3b6ef5,#8b5cf6)",
  },
  {
    id: "indigo",
    name: "İndiqo",
    desc: "indiqo → purple",
    sw: "linear-gradient(135deg,#5b5bf0,#a855f7)",
  },
  { id: "ocean", name: "Okean", desc: "mavi → göy", sw: "linear-gradient(135deg,#0284c7,#4f6ef7)" },
  {
    id: "graphite",
    name: "Qrafit",
    desc: "boz / monoxrom",
    sw: "linear-gradient(135deg,#334155,#94a3b8)",
  },
] as const;

function currentTheme(): "light" | "dark" {
  const t = root.getAttribute("data-theme");
  if (t === "light" || t === "dark") return t;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function paintThemeButtons(): void {
  const dark = currentTheme() === "dark";
  document.querySelectorAll<HTMLElement>("[data-theme-toggle]").forEach((b) => {
    b.innerHTML = dark ? icons.sun : icons.moon;
    b.setAttribute("aria-label", dark ? "Açıq temaya keç" : "Tünd temaya keç");
    b.title = dark ? "Açıq tema" : "Tünd tema";
  });
}

function currentPalette(): string {
  return root.getAttribute("data-palette") ?? "nebula";
}

function paintPaletteMenu(menu: HTMLElement): void {
  const cur = currentPalette();
  menu.innerHTML =
    '<div class="menu-title label">Rəng palitrası</div>' +
    PALETTES.map(
      (p) =>
        `<button class="menu-item" style="width:100%;border:0;background:none;font:inherit;cursor:pointer" role="menuitemradio" aria-checked="${p.id === cur}" data-pal="${p.id}">` +
        `<span class="swatch" style="background:${p.sw}"></span><span style="text-align:left"><b style="font-weight:600">${p.name}</b><br><small style="margin:0">${p.desc}</small></span></button>`,
    ).join("");
}

export function initTheme(): void {
  paintThemeButtons();
  document.querySelectorAll("[data-theme-toggle]").forEach((b) =>
    b.addEventListener("click", () => {
      const next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      store.set("goaz:theme", next);
      paintThemeButtons();
    }),
  );

  document.querySelectorAll<HTMLElement>("[data-palette-menu]").forEach((menu) => {
    paintPaletteMenu(menu);
    menu.addEventListener("click", (e) => {
      const b = (e.target as Element).closest<HTMLElement>("[data-pal]");
      if (!b) return;
      const id = b.dataset.pal!;
      if (id === "nebula") root.removeAttribute("data-palette");
      else root.setAttribute("data-palette", id);
      store.set("goaz:palette", id);
      paintPaletteMenu(menu);
      toast("Palitra: " + PALETTES.find((p) => p.id === id)?.name);
    });
  });
}
