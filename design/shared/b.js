/* Variant B — addım pleyeri, yaddaş vizualizatoru və iki istiqamətli highlight.
   Asılılıq: app.js (window.GOAZ). */
(function () {
  "use strict";

  // Bölmə rəngləri (frontscope üslubunda hər trekin öz rəngi)
  const SECTION_COLORS = {
    basics: "#e8ff5a", collections: "#6cb6ff", functions: "#dcbdfb", types: "#f69d50",
    errors: "#f47067", concurrency: "#3affa0", text: "#96d0ff", files: "#ffd479", system: "#c6a0ff",
  };
  const LEVEL_BY_SECTION = {
    basics: "beginner", collections: "beginner", functions: "beginner",
    types: "mid", errors: "mid", text: "mid", files: "mid",
    concurrency: "adv", system: "adv",
  };
  const LEVEL_LABEL = { beginner: "başlanğıc", mid: "orta", adv: "irəli" };
  const minutesFor = (slug) => 3 + (slug.length * 7) % 6; // prototip üçün sabit "təsadüfi" dəqiqə

  // ---------- Slices dərsinin məlumatı ----------
  const SLICES = {
    file: "slices.go",
    src: [
      "package main",
      "",
      'import "fmt"',
      "",
      "func main() {",
      "\tvar s []string",
      '\tfmt.Println("boş:", s, len(s))',
      "",
      "\ts = make([]string, 3)",
      '\ts[0] = "a"',
      '\ts[1] = "b"',
      '\ts[2] = "c"',
      '\tfmt.Println("make:", s, len(s))',
      "",
      '\ts = append(s, "d", "e")',
      '\tfmt.Println("append:", s)',
      "",
      '\tfmt.Println("kəsik:", s[1:3])',
      "",
      "\tt := []int{1, 2, 3}",
      '\tfmt.Println("qısa:", t)',
      "}",
    ].join("\n"),
    steps: [
      { title: "Boş slice", lines: [6, 7], out: "boş: [] 0",
        vis: { name: "s", nil: true, cells: [], len: 0, cap: 0 },
        note: "Hələ heç bir massiv yoxdur: s == nil, len = 0." },
      { title: "make ilə hazır ölçü", lines: [9, 13], out: "make: [a b c] 3",
        vis: { name: "s", cells: ["a", "b", "c"], len: 3, cap: 3 },
        note: "make 3 yer ayırdı, sonra indekslə dolduruldu." },
      { title: "append ilə əlavə", lines: [15, 16], out: "append: [a b c d e]",
        vis: { name: "s", cells: ["a", "b", "c", "d", "e", ""], len: 5, cap: 6, fresh: [3, 4] },
        note: "Yer çatmadı → Go 2 qat böyük yeni massiv ayırdı (cap 6)." },
      { title: "Kəsik s[1:3]", lines: [18, 18], out: "kəsik: [b c]",
        vis: { name: "s[1:3]", cells: ["a", "b", "c", "d", "e", ""], len: 2, cap: 5, window: [1, 3] },
        note: "Kəsik eyni massivə baxır — heç nə kopyalanmır." },
      { title: "Qısa yazılış", lines: [20, 21], out: "qısa: [1 2 3]",
        vis: { name: "t", cells: ["1", "2", "3"], len: 3, cap: 3 },
        note: "Literal: elementlər birbaşa yazılır, tip özü təyin olunur." },
    ],
  };

  // ---------- Vizualizator ----------
  function renderVis(el, v) {
    const G = window.GOAZ;
    let head = '<div class="vis-head"><span class="var">' + G.esc(v.name) + "</span>";
    head += v.nil
      ? '<span class="field nil">nil</span><span class="field">len <b>0</b></span><span class="field">cap <b>0</b></span>'
      : '<span class="field">len <b>' + v.len + '</b></span><span class="field">cap <b>' + v.cap + "</b></span>";
    head += "</div>";
    let cells = "";
    if (!v.cells.length) {
      cells = '<div class="cells-empty">massiv yoxdur — ilk append zamanı yaradılacaq</div>';
    } else {
      v.cells.forEach((val, i) => {
        let cls = "cell";
        if (v.window) cls += i >= v.window[0] && i < v.window[1] ? " in" : " out";
        else if (i >= v.len) cls += " cap";
        if (v.fresh && v.fresh.indexOf(i) >= 0) cls += " fresh";
        const shown = val === "" ? "·" : (/^\d+$/.test(val) ? val : '"' + val + '"');
        cells += '<div class="' + cls + '" style="animation-delay:' + i * 40 + 'ms"><span class="idx">' + i + '</span><span class="box">' + G.esc(shown) + "</span></div>";
      });
    }
    el.innerHTML = head + '<div class="cells">' + cells + "</div>";
  }

  // ---------- Dərs kontrolleri ----------
  // opts: { lesson, pre, stepEls?, vis, term, count, title, note, dots, prev, next, play, reset, onChange? }
  function createLesson(opts) {
    const G = window.GOAZ;
    const L = opts.lesson;
    const n = L.steps.length;
    let pinned = 0;        // scroll/düymələrlə seçilmiş addım
    let shown = -1;        // hazırda göstərilən addım (hover müvəqqəti dəyişə bilər)
    let playing = null;

    G.renderCode(opts.pre, L.src);

    if (opts.dots) {
      opts.dots.innerHTML = L.steps.map((_, i) => '<i data-i="' + i + '" title="Addım ' + (i + 1) + '"></i>').join("");
      opts.dots.addEventListener("click", (e) => { const d = e.target.closest("i"); if (d) go(+d.dataset.i, true); });
    }

    function show(i) {
      if (i === shown) return;
      shown = i;
      const s = L.steps[i];
      // kod
      opts.pre.classList.add("has-focus");
      opts.pre.querySelectorAll(".line").forEach((l) => { const k = +l.dataset.n; l.classList.toggle("hl", k >= s.lines[0] && k <= s.lines[1]); });
      // Kod qutusu öz scroll-u olanda işıqlanan sətirləri görünən sahəyə gətir (səhifəni sürüşdürmədən)
      const box = opts.scrollBox;
      if (box && box.scrollHeight > box.clientHeight + 4) {
        const first = opts.pre.querySelector(".line.hl"), last = opts.pre.querySelectorAll(".line.hl");
        if (first) {
          const top = first.offsetTop, bottom = last[last.length - 1].offsetTop + last[last.length - 1].offsetHeight;
          if (top < box.scrollTop + 30 || bottom > box.scrollTop + box.clientHeight - 10) {
            box.scrollTo({ top: Math.max(0, top - box.clientHeight / 3), behavior: "smooth" });
          }
        }
      }
      // izah
      if (opts.stepEls) opts.stepEls.forEach((el, k) => el.classList.toggle("is-active", k === i));
      // vizual
      if (opts.vis) renderVis(opts.vis, s.vis);
      if (opts.note) opts.note.textContent = s.note;
      if (opts.title) opts.title.textContent = s.title;
      if (opts.count) opts.count.textContent = String(i + 1).padStart(2, "0") + " / " + String(n).padStart(2, "0");
      if (opts.dots) opts.dots.querySelectorAll("i").forEach((d, k) => d.classList.toggle("on", k <= i));
      if (opts.prev) opts.prev.disabled = i === 0;
      if (opts.next) opts.next.disabled = i === n - 1;
      // çıxış: bu addıma qədər çap olunanlar
      if (opts.term) {
        opts.term.innerHTML = L.steps.slice(0, i + 1).map((x, k) => '<span class="out-line' + (k < i ? " dim" : "") + '">' + G.esc(x.out) + "</span>").join("");
      }
      if (opts.onChange) opts.onChange(i);
    }

    function go(i, fromUser) {
      i = Math.max(0, Math.min(n - 1, i));
      pinned = i;
      show(i);
      if (fromUser && opts.onNavigate) opts.onNavigate(i);
    }
    function preview(i) { if (i == null) show(pinned); else show(i); }

    function stop() { clearInterval(playing); playing = null; paintPlay(); }
    function paintPlay() {
      if (!opts.play) return;
      opts.play.innerHTML = playing
        ? '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg><span class="txt">Dayandır</span>'
        : '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15a1 1 0 0 0 1.5.9l12-7.5a1 1 0 0 0 0-1.8l-12-7.5A1 1 0 0 0 7 4.5Z"/></svg><span class="txt">Oynat</span>';
    }
    function play() {
      if (playing) { stop(); return; }
      if (pinned === n - 1) go(0, true);
      playing = setInterval(() => { if (pinned >= n - 1) { stop(); return; } go(pinned + 1, true); }, 2200);
      paintPlay();
    }

    if (opts.prev) opts.prev.addEventListener("click", () => { stop(); go(pinned - 1, true); });
    if (opts.next) opts.next.addEventListener("click", () => { stop(); go(pinned + 1, true); });
    if (opts.reset) opts.reset.addEventListener("click", () => { stop(); go(0, true); });
    if (opts.play) opts.play.addEventListener("click", play);
    paintPlay();

    // Kod → izah: sətrin üzərinə gələndə uyğun addım
    const stepForLine = (k) => L.steps.findIndex((s) => k >= s.lines[0] && k <= s.lines[1]);
    opts.pre.addEventListener("mouseover", (e) => {
      if (opts.pre.isContentEditable) return;
      const line = e.target.closest(".line"); if (!line) return;
      const i = stepForLine(+line.dataset.n);
      if (i >= 0) { preview(i); if (opts.onCodeHover) opts.onCodeHover(i); }
    });
    opts.pre.addEventListener("mouseleave", () => { if (!opts.pre.isContentEditable) preview(null); });

    go(0);
    return { go, preview, stop, get pinned() { return pinned; }, n, rerender() { const p = shown; shown = -1; show(p); } };
  }

  window.GOAZ_B = { SLICES, SECTION_COLORS, LEVEL_BY_SECTION, LEVEL_LABEL, minutesFor, renderVis, createLesson };
})();
