/* Variant D — UX əlavələri. Asılılıq: ../app.js (toast), ../c/c.js (menyular).
   1) Dərs səhifəsi: görünüş rejimləri — sidebar gizlət, kontent eni (mərkəzdə / tam en), Zen.
      Vəziyyət <html> atributlarındadır: data-sidebar="off", data-width="full", data-zen.
      Sidebar və en localStorage-da, Zen isə sessionStorage-da (yalnız bu tab) saxlanılır.
      Klaviatura: [ — panel, F — en, Z — zen, Esc — zen-dən çıx.
   2) Ana səhifə: scroll animasiyaları (başlıqlar, kartlar, hero parallax, pleyerin 3D girişi). */
(function () {
  "use strict";

  const root = document.documentElement;
  const mq = (q) => matchMedia(q).matches;
  const narrow = () => mq("(max-width: 980px)");
  const reduced = () => mq("(prefers-reduced-motion: reduce)");
  const typing = () => { const a = document.activeElement; return !!a && (/INPUT|TEXTAREA|SELECT/.test(a.tagName) || a.isContentEditable); };
  const save = (store, k, v) => { try { v == null ? store.removeItem(k) : store.setItem(k, v); } catch (e) {} };
  const toast = (m) => window.GOAZ && window.GOAZ.toast(m);

  // ---------- 1. Dərs səhifəsi: görünüş rejimləri ----------
  function initLessonView() {
    if (!document.querySelector(".layout")) return;

    const isOff = () => root.getAttribute("data-sidebar") === "off";
    const isFull = () => root.getAttribute("data-width") === "full";
    const isZen = () => root.hasAttribute("data-zen");
    const all = (sel, fn) => document.querySelectorAll(sel).forEach(fn);

    // Səhifə yerləşməsi dəyişdi — yapışqan kod paneli yenidən hesablansın (animasiyadan sonra da)
    function notify() {
      dispatchEvent(new Event("goaz:layout"));
      setTimeout(() => dispatchEvent(new Event("goaz:layout")), 320);
    }

    function paint() {
      all("[data-sb-toggle]", (b) => b.setAttribute("aria-pressed", String(!isOff())));
      all('[data-act="sidebar"]', (b) => b.setAttribute("aria-checked", String(!isOff())));
      all("[data-width-opt]", (b) => b.setAttribute("aria-checked", String((b.dataset.widthOpt === "full") === isFull())));
      all("[data-zen-toggle]", (b) => b.setAttribute("aria-pressed", String(isZen())));
      all("[data-zen-label]", (l) => (l.textContent = isZen() ? "Çıx" : "Zen"));
    }

    // Rejim dəyişəndə oxunan yer ekranda sabit qalsın (header/crumbs yox olanda sıçramasın)
    function keepAnchor(fn) {
      const hit = document.elementFromPoint(innerWidth * 0.3, innerHeight * 0.4);
      const el = hit && hit.closest(".step, .lead, .lesson-head, .chips, .after > *, .pager");
      const before = el && el.getBoundingClientRect().top;
      fn();
      if (el) scrollTo({ top: scrollY + el.getBoundingClientRect().top - before, behavior: "instant" });
    }

    function setSidebar(on) {
      if (on) root.removeAttribute("data-sidebar"); else root.setAttribute("data-sidebar", "off");
      save(localStorage, "goaz:sidebar", on ? "on" : "off");
      paint(); notify();
    }
    function toggleSidebar() {
      if (narrow()) { document.body.classList.toggle("drawer-open"); return; } // dar ekran: drawer
      if (isZen()) { setZen(false); setSidebar(true); return; }
      setSidebar(isOff());
    }

    function setWidth(full) {
      if (full === isFull()) return;
      if (full) root.setAttribute("data-width", "full"); else root.removeAttribute("data-width");
      save(localStorage, "goaz:width", full ? "full" : "center");
      paint(); notify();
    }

    const bar = document.querySelector(".zen-bar");
    let peekT;
    function peek() {
      if (!bar) return;
      bar.classList.add("show");
      clearTimeout(peekT);
      peekT = setTimeout(() => bar.classList.remove("show"), 2400);
    }

    function setZen(on) {
      if (on === isZen()) return;
      keepAnchor(() => {
        if (on) root.setAttribute("data-zen", ""); else root.removeAttribute("data-zen");
      });
      save(sessionStorage, "goaz:zen", on ? "1" : null);
      document.body.classList.remove("drawer-open");
      all(".menu", (m) => (m.hidden = true));
      const art = document.querySelector(".article");
      if (art) { art.classList.remove("mode-in"); void art.offsetWidth; art.classList.add("mode-in"); }
      paint(); notify(); progress();
      if (on) { peek(); toast("Zen rejimi — çıxmaq üçün Esc"); }
    }

    // Zen: yuxarıda nazik oxuma irəliləyişi
    const pr = document.querySelector(".read-progress span");
    let raf = 0;
    function progress() {
      if (!pr || !isZen() || raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const max = root.scrollHeight - innerHeight;
        pr.style.transform = "scaleX(" + (max > 0 ? Math.min(1, scrollY / max) : 0) + ")";
      });
    }
    addEventListener("scroll", progress, { passive: true });
    addEventListener("mousemove", (e) => { if (isZen() && e.clientY > innerHeight - 90 && e.clientX < 420) peek(); }, { passive: true });

    // Zen paneldəki başlıq — səhifənin h1-dən
    const h1 = document.querySelector(".lesson-head h1");
    const zt = document.querySelector("[data-zen-title]");
    if (h1 && zt) zt.textContent = h1.firstChild.textContent.trim();

    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-sb-toggle], [data-act='sidebar']")) toggleSidebar();
      const w = e.target.closest("[data-width-opt]");
      if (w) setWidth(w.dataset.widthOpt === "full");
      if (e.target.closest("[data-zen-toggle]")) setZen(!isZen());
    });

    // capture: axtarış palitrası açıqdırsa Esc ona aid olsun, zen-ə yox
    addEventListener("keydown", (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || typing()) return;
      if (document.querySelector(".palette-backdrop.open")) return;
      if (e.key === "Escape" && isZen()) { setZen(false); return; }
      // e.code — klaviatura düzülüşündən asılı deyil (AZ düzülüşündə [ = "ö")
      if (e.code === "BracketLeft" || (!e.code && e.key === "[")) { e.preventDefault(); toggleSidebar(); }
      // F zen-də işləmir: zen həmişə mərkəzdədir
      else if (e.code === "KeyF" && !isZen()) { e.preventDefault(); setWidth(!isFull()); toast(isFull() ? "Kontent: tam en" : "Kontent: mərkəzdə"); }
      else if (e.code === "KeyZ") { e.preventDefault(); setZen(!isZen()); }
    }, true);

    paint();
    if (isZen()) { progress(); peek(); }
  }

  // ---------- 2. Ana səhifə: scroll animasiyaları ----------
  // a) Bölmə başlığı: kod etiketi yazılır (typewriter), h2 sözləri maskanın altından qalxır,
  //    rəqəmlər 0-dan sayılır, alt mətn bulanıqlıqdan aydınlaşır.
  // b) Kartlar: növbə ilə aşağıdan, kiçikdən və bulanıqdan gəlir.
  // c) Scroll-a bağlı: hero yuxarı çəkildikcə solur; demo pleyer 3D əyilmədən düzəlir.
  // h2-ni sözlərə böl: <span class="w"><span>söz</span></span>. Daxili elementlər (.grad-text) bütöv qalır.
  function splitWords(h) {
    const frag = document.createDocumentFragment();
    let i = 0;
    const wrap = (node) => {
      const w = document.createElement("span"); w.className = "w";
      const inner = document.createElement("span"); inner.style.setProperty("--i", i++);
      inner.appendChild(node); w.appendChild(inner); return w;
    };
    Array.from(h.childNodes).forEach((n) => {
      if (n.nodeType === 3) {
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          // "84" və ya "9" kimi rəqəmlər sayılacaq; "nümunə." kimi sözlərdə nöqtə ayrılmır
          const m = part.match(/^(\d+)(\D*)$/);
          if (m) {
            const num = document.createElement("span"); num.dataset.count = m[1]; num.textContent = m[1];
            const box = document.createElement("span"); box.appendChild(num); if (m[2]) box.appendChild(document.createTextNode(m[2]));
            frag.appendChild(wrap(box));
          } else frag.appendChild(wrap(document.createTextNode(part)));
        });
      } else frag.appendChild(wrap(n));
    });
    h.textContent = ""; h.appendChild(frag);
    h.classList.add("fx-words");
  }

  function countUp(el) {
    const to = +el.dataset.count, t0 = performance.now(), dur = 1100;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    el.textContent = "0"; requestAnimationFrame(tick);
  }

  function typeTag(tag) {
    const txt = tag.firstChild;
    if (!txt || txt.nodeType !== 3) return;
    const full = txt.textContent; txt.textContent = "";
    tag.classList.add("typing");
    let n = 0;
    const id = setInterval(() => { txt.textContent = full.slice(0, ++n); if (n >= full.length) { clearInterval(id); tag.classList.remove("typing"); } }, 45);
  }

  function initScrollFx() {
    if (!document.querySelector(".hero") || reduced() || !("IntersectionObserver" in window)) return;
    root.classList.add("fx");

    // Bölmə başlıqları
    const heads = Array.from(document.querySelectorAll(".section-head"));
    heads.forEach((sh) => { const h = sh.querySelector("h2"); if (h) splitWords(h); });
    const headIO = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const sh = en.target; headIO.unobserve(sh);
      sh.classList.add("in");
      const tag = sh.querySelector(".tag-code"); if (tag) typeTag(tag);
      sh.querySelectorAll("[data-count]").forEach((c) => setTimeout(() => countUp(c), 150));
    }), { rootMargin: "0px 0px -15% 0px" });
    heads.forEach((sh) => headIO.observe(sh));

    // Kartlar və bloklar — eyni anda görünənlər növbə ilə
    const cards = document.querySelectorAll(".prog-bar, .path-bar, .section-card, .track, .bento-card, .tech, .path-card, .nx-map, .nx-panel, .map-row, .player + p");
    const cardIO = new IntersectionObserver((entries) => {
      let i = 0;
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target; cardIO.unobserve(el);
        el.style.setProperty("--d", Math.min(i++ * 90, 540) + "ms");
        el.classList.add("in");
        // animasiya bitəndə sinifləri sil — kartların öz hover keçidləri qayıtsın
        const done = (e) => {
          if (e.target !== el) return; // daxili animasiyalar (xəritə budaqları) bubble edir
          el.removeEventListener("animationend", done);
          el.classList.remove("fx-card", "in"); el.style.removeProperty("--d");
        };
        el.addEventListener("animationend", done);
      });
    }, { rootMargin: "0px 0px -10% 0px" });
    cards.forEach((el) => { el.classList.add("fx-card"); cardIO.observe(el); });

    // Scroll-a bağlı effektlər
    const heroGrid = document.querySelector(".hero-grid");
    const hero = document.querySelector(".hero");
    const tilts = Array.from(document.querySelectorAll(".section .player"));
    tilts.forEach((el) => el.classList.add("fx-tilt"));
    let raf = 0;
    const clamp = (v) => Math.max(0, Math.min(1, v));
    function frame() {
      raf = 0;
      if (heroGrid) {
        const p = clamp(scrollY / (hero.offsetHeight + 60));
        heroGrid.style.transform = "translate3d(0," + (p * 90).toFixed(1) + "px,0) scale(" + (1 - p * 0.05).toFixed(3) + ")";
        heroGrid.style.opacity = Math.max(0, 1 - p * 1.1).toFixed(3);
      }
      tilts.forEach((el) => {
        const r = el.getBoundingClientRect();
        const p = clamp((innerHeight - r.top) / (innerHeight * 0.75));
        el.style.transform = "perspective(1400px) rotateX(" + ((1 - p) * 18).toFixed(2) + "deg) scale(" + (0.88 + p * 0.12).toFixed(3) + ")";
        el.style.opacity = (0.25 + p * 0.75).toFixed(3);
      });
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(frame); };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    frame();

    initViewSwitchFx();
    initBentoFx();
  }

  // Elementin uşaqlarını növbə ilə yenidən animasiya et (sinfi silib-əlavə etməklə təkrar işləyir)
  function playStagger(box) {
    if (!box) return;
    Array.from(box.children).forEach((c, i) => {
      c.classList.remove("fx-card", "in"); // scroll animasiyası hələ işləməyibsə — ona yer qoyma
      c.style.setProperty("--i", Math.min(i, 12));
    });
    box.classList.remove("view-in"); void box.offsetWidth; box.classList.add("view-in");
    clearTimeout(box._fxT);
    box._fxT = setTimeout(() => box.classList.remove("view-in"), 1500);
  }

  // "Bütün mövzular / Bölmə üzrə / Yol xəritəsi" keçidləri + bölmə seçəndə sətirlər
  // Platform home: "Texnologiya üzrə / İstiqamət üzrə" (tech / dir)
  function initViewSwitchFx() {
    const targets = { cards: ["#view-cards"], tracks: ["#tracks", "#rows"], map: ["#map"], tech: ["#paths-tech"], dir: ["#paths-dir"] };
    document.addEventListener("click", (e) => {
      const b = e.target.closest("[data-view], [data-view-link]");
      if (!b) return;
      const v = b.dataset.view || b.dataset.viewLink;
      // səhifə skripti görünüşü artıq dəyişib (onun dinləyicisi düymənin özündədir)
      (targets[v] || []).forEach((sel) => playStagger(document.querySelector(sel)));
    });
    const rows = document.getElementById("rows");
    if (rows) new MutationObserver(() => playStagger(rows)).observe(rows, { childList: true });
  }

  // "Niyə bu sayt?" kartları: ekrandaykən daxili mini-animasiyalar işləyir + kursoru izləyən işıq
  function initBentoFx() {
    const cards = document.querySelectorAll(".bento-card");
    const io = new IntersectionObserver((entries) => entries.forEach((en) => en.target.classList.toggle("live", en.isIntersecting)), { threshold: 0.35 });
    cards.forEach((c) => {
      io.observe(c);
      c.addEventListener("pointermove", (e) => {
        const r = c.getBoundingClientRect();
        c.style.setProperty("--mx", e.clientX - r.left + "px");
        c.style.setProperty("--my", e.clientY - r.top + "px");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initLessonView();
    // səhifə skripti kartları DOMContentLoaded-da çəkir — onlardan sonra işləsin
    setTimeout(initScrollFx, 0);
  });
})();
