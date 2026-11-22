/* Nümunələrlə Go — prototip skriptləri (tema, axtarış, kod işıqlandırma, irəliləyiş) */
(function () {
  "use strict";

  // ---------- Storage (həmişə try/catch) ----------
  const store = {
    get(k, fallback) {
      try { const v = localStorage.getItem(k); return v === null ? fallback : JSON.parse(v); }
      catch (e) { return fallback; }
    },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } },
  };

  // ---------- Icons ----------
  const I = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.7 7.7-5.5 5.5a1 1 0 0 1-1.4 0l-2.5-2.5a1 1 0 1 1 1.4-1.4l1.8 1.8 4.8-4.8a1 1 0 0 1 1.4 1.4Z"/></svg>',
    circle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg>',
    chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/></svg>',
    stack: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/></svg>',
    func: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 20c2 0 3-1 3.5-3.5L13 7.5C13.5 5 14.5 4 16.5 4M7.5 11h9"/></svg>',
    shape: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="8" height="8" rx="2"/><circle cx="17" cy="17" r="4"/><path d="M14 3h7v7"/></svg>',
    alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0ZM12 9v4M12 17h.01"/></svg>',
    flow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h10M4 12h16M4 18h7"/><path d="m17 3 3 3-3 3M17 15l3 3-3 3"/></svg>',
    text: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V5h16v2M9 19h6M12 5v14"/></svg>',
    file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Z"/><path d="M14 3v6h6"/></svg>',
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
  };

  // ---------- Theme ----------
  const root = document.documentElement;
  const saved = store.get("goaz:theme", null);
  if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);

  function currentTheme() {
    const t = root.getAttribute("data-theme");
    if (t) return t;
    return window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function paintThemeButtons() {
    document.querySelectorAll("[data-theme-toggle]").forEach((b) => {
      const dark = currentTheme() === "dark";
      b.innerHTML = dark ? I.sun : I.moon;
      b.setAttribute("aria-label", dark ? "Açıq temaya keç" : "Tünd temaya keç");
      b.title = dark ? "Açıq tema" : "Tünd tema";
    });
  }

  // ---------- Data helpers ----------
  const SECTIONS = window.GOAZ_SECTIONS || [];
  const FLAT = [];
  SECTIONS.forEach((s) => s.items.forEach(([slug, title, sub]) => FLAT.push({ slug, title, sub, section: s.title, n: FLAT.length + 1 })));
  const READY = new Set(["slices"]);
  const href = (slug) => "example.html?ex=" + encodeURIComponent(slug);

  // Demo irəliləyiş: ilk girişdə "Əsaslar" + "Arrays" öyrənilmiş kimi göstərilir
  let learned = store.get("goaz:learned", null);
  if (!Array.isArray(learned)) {
    learned = ["hello-world", "values", "variables", "constants", "for", "if-else", "switch", "arrays"];
  }
  const learnedSet = new Set(learned);
  function saveLearned() { store.set("goaz:learned", Array.from(learnedSet)); }

  // Azərbaycan hərflərinə həssas olmayan axtarış: "dovr" → "Dövr"
  function norm(s) {
    return s.toLocaleLowerCase("az")
      .replace(/ə/g, "e").replace(/ı/g, "i").replace(/i̇/g, "i").replace(/ş/g, "s")
      .replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ö/g, "o").replace(/ü/g, "u");
  }
  function esc(s) { return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

  // ---------- Toast ----------
  let toastEl, toastTimer;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "toast"; toastEl.setAttribute("role", "status"); document.body.appendChild(toastEl); }
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2600);
  }

  // ---------- Go syntax highlighter (prototip; real saytda Shiki) ----------
  const KW = new Set("break case chan const continue default defer else fallthrough for func go goto if import interface map package range return select struct switch type var".split(" "));
  const TYPES = new Set("bool byte complex64 complex128 error float32 float64 int int8 int16 int32 int64 rune string uint uint8 uint16 uint32 uint64 uintptr any".split(" "));
  const BUILTINS = new Set("append cap clear close complex copy delete imag len make max min new panic print println real recover true false nil iota".split(" "));
  const RE = /(\/\/.*$)|("(?:[^"\\]|\\.)*"|`[^`]*`|'(?:[^'\\]|\\.)*')|\b(\d+(?:\.\d+)?)\b|\b([A-Za-z_]\w*)\b/g;

  function hlLine(line) {
    let out = "", last = 0, m;
    RE.lastIndex = 0;
    while ((m = RE.exec(line))) {
      out += esc(line.slice(last, m.index));
      const t = m[0];
      let cls = null;
      if (m[1]) cls = "com";
      else if (m[2]) cls = "str";
      else if (m[3]) cls = "num";
      else if (m[4]) {
        if (KW.has(t)) cls = "kw";
        else if (TYPES.has(t)) cls = "type";
        else if (BUILTINS.has(t)) cls = "builtin";
        else if (line[RE.lastIndex] === "(") cls = "fn";
      }
      out += cls ? '<span class="tok-' + cls + '">' + esc(t) + "</span>" : esc(t);
      last = RE.lastIndex;
    }
    return out + esc(line.slice(last));
  }

  function renderCode(pre, src, opts) {
    opts = opts || {};
    const lines = src.replace(/\n$/, "").split("\n");
    const from = opts.from || 1, to = opts.to || lines.length;
    let html = "";
    for (let i = from; i <= to; i++) {
      html += '<span class="line" data-n="' + i + '"><span class="ln">' + i + "</span>" + (hlLine(lines[i - 1]) || " ") + "</span>";
    }
    pre.innerHTML = html;
  }

  // ---------- Command palette ----------
  function buildPalette() {
    const wrap = document.createElement("div");
    wrap.className = "palette-backdrop";
    wrap.innerHTML =
      '<div class="palette" role="dialog" aria-modal="true" aria-label="Axtarış">' +
      '<div class="palette-input-row">' + I.search +
      '<input type="text" placeholder="Nümunə axtar… (məs. slice, dövr, kanal)" aria-label="Axtarış" autocomplete="off" spellcheck="false">' +
      "<kbd>Esc</kbd></div>" +
      '<ul class="palette-list" role="listbox"></ul>' +
      '<div class="palette-foot"><span><kbd>↑</kbd><kbd>↓</kbd> seç</span><span><kbd>↵</kbd> aç</span><span><kbd>Esc</kbd> bağla</span></div>' +
      "</div>";
    document.body.appendChild(wrap);
    const input = wrap.querySelector("input");
    const list = wrap.querySelector(".palette-list");
    let results = [], sel = 0;

    function mark(text, q) {
      if (!q) return esc(text);
      const i = norm(text).indexOf(q);
      if (i < 0) return esc(text);
      return esc(text.slice(0, i)) + "<mark>" + esc(text.slice(i, i + q.length)) + "</mark>" + esc(text.slice(i + q.length));
    }
    function render() {
      const q = norm(input.value.trim());
      results = FLAT.filter((e) => !q || norm(e.title).includes(q) || norm(e.sub).includes(q) || norm(e.section).includes(q));
      if (sel >= results.length) sel = 0;
      if (!results.length) { list.innerHTML = '<li class="palette-empty">Heç nə tapılmadı. Başqa söz yoxlayın.</li>'; return; }
      let html = "", group = null;
      results.slice(0, 60).forEach((e, i) => {
        if (e.section !== group) { group = e.section; html += '<li class="palette-group" role="presentation">' + esc(group) + "</li>"; }
        html += '<li class="palette-item" role="option" data-i="' + i + '" aria-selected="' + (i === sel) + '">' +
          '<span class="pi-num">' + String(e.n).padStart(2, "0") + "</span>" +
          '<span class="pi-title">' + mark(e.title, q) + "</span>" +
          '<span class="pi-sub">' + mark(e.sub, q) + "</span>" +
          (learnedSet.has(e.slug) ? '<span class="pi-done">✓ öyrənildi</span>' : "") + "</li>";
      });
      list.innerHTML = html;
      const active = list.querySelector('[aria-selected="true"]');
      if (active) active.scrollIntoView({ block: "nearest" });
    }
    function go(i) { const e = results[i]; if (e) location.href = href(e.slug); }
    input.addEventListener("input", () => { sel = 0; render(); });
    input.addEventListener("keydown", (ev) => {
      if (ev.key === "ArrowDown") { sel = Math.min(sel + 1, results.length - 1); render(); ev.preventDefault(); }
      else if (ev.key === "ArrowUp") { sel = Math.max(sel - 1, 0); render(); ev.preventDefault(); }
      else if (ev.key === "Enter") { go(sel); }
    });
    list.addEventListener("mousemove", (ev) => {
      const li = ev.target.closest(".palette-item"); if (!li) return;
      const i = +li.dataset.i; if (i !== sel) { sel = i; list.querySelectorAll(".palette-item").forEach((x) => x.setAttribute("aria-selected", String(+x.dataset.i === sel))); }
    });
    list.addEventListener("click", (ev) => { const li = ev.target.closest(".palette-item"); if (li) go(+li.dataset.i); });
    wrap.addEventListener("click", (ev) => { if (ev.target === wrap) close(); });

    let lastFocus = null;
    function open() { lastFocus = document.activeElement; wrap.classList.add("open"); input.value = ""; sel = 0; render(); setTimeout(() => input.focus(), 10); }
    function close() { wrap.classList.remove("open"); if (lastFocus) lastFocus.focus(); }
    return { open, close, isOpen: () => wrap.classList.contains("open") };
  }

  // ---------- Sidebar ----------
  function renderSidebar(el, current) {
    const done = FLAT.filter((e) => learnedSet.has(e.slug)).length;
    let html = '<div class="sb-progress"><div class="row"><span>İrəliləyiş</span><span><b>' + done + "</b> / " + FLAT.length + "</span></div>" +
      '<div class="bar"><span style="width:' + Math.round((done / FLAT.length) * 100) + '%"></span></div></div><nav aria-label="Nümunələr">';
    SECTIONS.forEach((s) => {
      const has = s.items.some((it) => it[0] === current);
      const sd = s.items.filter((it) => learnedSet.has(it[0])).length;
      html += '<details class="sb-group"' + (has || s.id === "basics" ? " open" : "") + "><summary>" + esc(s.title) +
        '<span class="cnt">' + sd + "/" + s.items.length + "</span>" + I.chev + '</summary><ul class="sb-list">';
      s.items.forEach(([slug, title]) => {
        html += '<li><a href="' + href(slug) + '"' + (slug === current ? ' aria-current="page"' : "") + ">" + esc(title) +
          (learnedSet.has(slug) ? '<span class="dot" title="Öyrənildi">' + I.check + "</span>" : "") + "</a></li>";
      });
      html += "</ul></details>";
    });
    el.innerHTML = html + "</nav>";
  }

  // ---------- Copy ----------
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch (e) {
      const ta = document.createElement("textarea"); ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      let ok = false; try { ok = document.execCommand("copy"); } catch (e2) { /* ignore */ }
      ta.remove(); return ok;
    }
  }

  // ---------- A/B variant switch (yalnız dizayn müqayisəsi üçün) ----------
  function mountVariantSwitch() {
    const m = location.pathname.match(/\/([bcd])\//);
    const cur = m ? m[1] : "a";
    const root = cur === "a" ? "" : "../";
    const page = /example\.html$/.test(location.pathname) ? "example.html" + location.search : "index.html";
    const el = document.createElement("div");
    el.setAttribute("role", "navigation");
    el.setAttribute("aria-label", "Dizayn variantı");
    el.style.cssText = "position:fixed;right:16px;bottom:16px;z-index:90;display:flex;gap:2px;padding:3px;border-radius:999px;" +
      "background:rgba(20,22,26,.92);border:1px solid rgba(255,255,255,.14);box-shadow:0 10px 30px rgba(0,0,0,.35);" +
      "font:600 12px/1 ui-monospace,Consolas,monospace;backdrop-filter:blur(8px)";
    const link = (label, href, on) => '<a href="' + href + '" style="padding:7px 12px;border-radius:999px;text-decoration:none;' +
      (on ? "background:#e8ebf2;color:#0b0e14" : "color:#adbac7") + '"' + (on ? ' aria-current="page"' : "") + ">" + label + "</a>";
    el.innerHTML = '<span style="padding:7px 4px 7px 10px;color:#7d8694">Variant</span>' +
      link("A", root + page, cur === "a") + link("B", root + "b/" + page, cur === "b") + link("C", root + "c/" + page, cur === "c") + link("D", root + "d/" + page, cur === "d");
    document.body.appendChild(el);
  }

  // ---------- Init ----------
  let palette;
  document.addEventListener("DOMContentLoaded", () => {
    paintThemeButtons();
    document.querySelectorAll("[data-theme-toggle]").forEach((b) => b.addEventListener("click", () => {
      const next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next); store.set("goaz:theme", next); paintThemeButtons();
    }));
    document.querySelectorAll("[data-icon]").forEach((el) => { el.innerHTML = I[el.dataset.icon] || ""; });

    palette = buildPalette();
    mountVariantSwitch();
    document.querySelectorAll("[data-open-search]").forEach((b) => b.addEventListener("click", () => palette.open()));

    // Mobile drawer
    document.querySelectorAll("[data-menu-toggle]").forEach((b) => b.addEventListener("click", () => document.body.classList.toggle("drawer-open")));
    const scrim = document.querySelector(".scrim");
    if (scrim) scrim.addEventListener("click", () => document.body.classList.remove("drawer-open"));

    document.addEventListener("keydown", (ev) => {
      const typing = /INPUT|TEXTAREA/.test(document.activeElement.tagName) || document.activeElement.isContentEditable;
      if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === "k") { ev.preventDefault(); palette.isOpen() ? palette.close() : palette.open(); return; }
      if (ev.key === "Escape") { if (palette.isOpen()) palette.close(); document.body.classList.remove("drawer-open"); return; }
      if (typing || palette.isOpen()) return;
      if (ev.key === "/") { ev.preventDefault(); palette.open(); }
      if (ev.key === "ArrowLeft" || ev.key === "ArrowRight") {
        const a = document.querySelector(ev.key === "ArrowLeft" ? "[data-prev]" : "[data-next]");
        if (a) location.href = a.getAttribute("href");
      }
    });
  });

  // Public API for page scripts
  window.GOAZ = { I, FLAT, SECTIONS, READY, href, learnedSet, saveLearned, renderCode, renderSidebar, toast, copyText, esc };
})();
