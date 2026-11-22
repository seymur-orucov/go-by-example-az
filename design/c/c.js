/* Variant C — palitra seçicisi, menyular, bölmə rəngləri. Asılılıq: ../app.js */
(function () {
  "use strict";

  const PALETTES = [
    { id: "nebula", name: "Nebula", desc: "göy → bənövşəyi", sw: "linear-gradient(135deg,#3b6ef5,#8b5cf6)" },
    { id: "indigo", name: "İndiqo", desc: "indiqo → purple", sw: "linear-gradient(135deg,#5b5bf0,#a855f7)" },
    { id: "ocean", name: "Okean", desc: "mavi → göy", sw: "linear-gradient(135deg,#0284c7,#4f6ef7)" },
    { id: "graphite", name: "Qrafit", desc: "boz / monoxrom", sw: "linear-gradient(135deg,#334155,#94a3b8)" },
  ];

  // Bölmə rəngləri: soyuq tonlar (göy, indiqo, bənövşəyi) + bir neçə neytral aksent
  const SECTION_COLORS = {
    basics: "#60a5fa", collections: "#818cf8", functions: "#a78bfa", types: "#c084fc",
    errors: "#f472b6", concurrency: "#22d3ee", text: "#2dd4bf", files: "#94a3b8", system: "#7dd3fc",
  };
  const LEVEL = { basics: "başlanğıc", collections: "başlanğıc", functions: "başlanğıc", types: "orta", errors: "orta", text: "orta", files: "orta", concurrency: "irəli", system: "irəli" };

  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k)); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }

  function currentPalette() { return document.documentElement.getAttribute("data-palette") || "nebula"; }
  function setPalette(id) {
    if (id === "nebula") document.documentElement.removeAttribute("data-palette");
    else document.documentElement.setAttribute("data-palette", id);
    store("goaz:palette", id);
  }

  // Açılan menyular: [data-menu-btn] düyməsi + onun içindəki .menu
  function initMenus() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-menu-btn]");
      const inMenu = e.target.closest(".menu");
      document.querySelectorAll(".menu").forEach((m) => {
        const owner = m.closest("[data-menu-btn]") || m.parentElement;
        if (btn && owner.contains(btn) && !inMenu) m.hidden = !m.hidden;
        else if (!inMenu || !owner.contains(e.target)) m.hidden = true;
      });
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") document.querySelectorAll(".menu").forEach((m) => (m.hidden = true)); });
  }

  function initPalettePicker() {
    document.querySelectorAll("[data-palette-menu]").forEach((menu) => {
      function paint() {
        const cur = currentPalette();
        menu.innerHTML = '<div class="menu-title label">Rəng palitrası</div>' + PALETTES.map((p) =>
          '<button class="menu-item" style="width:100%;border:0;background:none;font:inherit;cursor:pointer" role="menuitemradio" aria-checked="' + (p.id === cur) + '" data-pal="' + p.id + '">' +
          '<span class="swatch" style="background:' + p.sw + '"></span><span style="text-align:left"><b style="font-weight:600">' + p.name + '</b><br><small style="margin:0">' + p.desc + "</small></span></button>").join("");
      }
      paint();
      menu.addEventListener("click", (e) => {
        const b = e.target.closest("[data-pal]"); if (!b) return;
        setPalette(b.dataset.pal); paint();
        if (window.GOAZ) window.GOAZ.toast("Palitra: " + PALETTES.find((p) => p.id === b.dataset.pal).name);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => { initMenus(); initPalettePicker(); });

  window.GOAZ_C = { PALETTES, SECTION_COLORS, LEVEL };
})();
