// Design v3 "Order from chaos" — platform home. Runs after ../v2/v2.js (window.W3: data, icons, search, reveal).
(function () {
  "use strict";
  const W = window.W3;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = W.esc;
  const motion = !W.reduced;
  const coarse = matchMedia("(pointer: coarse)").matches;
  const tech = (id) => W.TECHS.find((t) => t.id === id);
  const clamp01 = (k) => (k < 0 ? 0 : k > 1 ? 1 : k);
  const easeOut = (k) => 1 - Math.pow(1 - k, 3);
  const easeInOut = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
  // returns a getter for "is this element on screen"
  function watch(el, opts) { let v = false; new IntersectionObserver((e) => { v = e[0].isIntersecting; }, opts || { threshold: 0.15 }).observe(el); return () => v; }

  // ======================================================
  // HERO: a particle field that snaps from chaos into shapes
  // ======================================================
  const hero = $("#start"), cv = $("#field"), zone = $("#sculpt-zone"), ui = $(".sculpt-ui"), ring = $("#lock-ring");
  const ctx = cv.getContext("2d");
  const N = innerWidth < 720 ? 1500 : 3200;
  const S = 220; // shapes are drawn on an S×S canvas and sampled into points

  function rr(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
  function sample(draw, depth) {
    const c = document.createElement("canvas"); c.width = c.height = S;
    const g = c.getContext("2d", { willReadFrequently: true });
    g.fillStyle = g.strokeStyle = "#fff"; g.lineCap = g.lineJoin = "round";
    draw(g);
    const d = g.getImageData(0, 0, S, S).data, px = [];
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) if (d[(y * S + x) * 4 + 3] > 110) px.push(x, y);
    const out = new Float32Array(N * 3), n = px.length / 2 || 1;
    for (let i = 0; i < N; i++) {
      const k = ((Math.random() * n) | 0) * 2;
      out[i * 3] = (((px[k] || S / 2) + Math.random()) / S - 0.5) * 2;
      out[i * 3 + 1] = (((px[k + 1] || S / 2) + Math.random()) / S - 0.5) * 2;
      out[i * 3 + 2] = (Math.random() - 0.5) * (depth || 0.1);
    }
    return out;
  }
  function cubePts() {
    const o = new Float32Array(N * 3), s = 0.6, V = [], E = [];
    for (let i = 0; i < 8; i++) V.push([(i & 1 ? 1 : -1) * s, (i & 2 ? 1 : -1) * s, (i & 4 ? 1 : -1) * s]);
    for (let i = 0; i < 8; i++) for (let b = 0; b < 3; b++) { const j = i ^ (1 << b); if (i < j) E.push([i, j]); }
    for (let i = 0; i < N; i++) {
      let p;
      if (Math.random() < 0.74) {
        const e = E[(Math.random() * 12) | 0], a = V[e[0]], b = V[e[1]], t = Math.random(), j = () => (Math.random() - 0.5) * 0.03;
        p = [a[0] + (b[0] - a[0]) * t + j(), a[1] + (b[1] - a[1]) * t + j(), a[2] + (b[2] - a[2]) * t + j()];
      } else {
        const f = (Math.random() * 3) | 0, sg = Math.random() < 0.5 ? -s : s, u = (Math.random() * 2 - 1) * s, v = (Math.random() * 2 - 1) * s;
        p = f === 0 ? [sg, u, v] : f === 1 ? [u, sg, v] : [u, v, sg];
      }
      o[i * 3] = p[0]; o[i * 3 + 1] = p[1]; o[i * 3 + 2] = p[2];
    }
    return o;
  }
  // five shapes = the five sides of every topic
  const SH = [
    // thin strokes on purpose: the points gather on lines, so the drawing stays crisp
    { name: "Xəritə", cap: ["Yol xəritəsi", "nəyi, hansı sırayla öyrənəcəyini göstərir"], pts: sample((g) => {
      const P = [[30, 180], [84, 110], [142, 150], [192, 80], [104, 36], [190, 192]];
      g.lineWidth = 3.4;
      [[0, 1], [1, 2], [2, 3], [1, 4], [2, 5]].forEach((l) => { g.beginPath(); g.moveTo(P[l[0]][0], P[l[0]][1]); g.lineTo(P[l[1]][0], P[l[1]][1]); g.stroke(); });
      P.forEach((p, i) => {
        g.globalCompositeOperation = "destination-out"; g.beginPath(); g.arc(p[0], p[1], 19, 0, 7); g.fill();
        g.globalCompositeOperation = "source-over"; g.beginPath(); g.arc(p[0], p[1], 17, 0, 7); g.stroke();
        if (i < 2) { g.beginPath(); g.arc(p[0], p[1], 8, 0, 7); g.fill(); } // learned nodes are filled
      });
    }) },
    { name: "Kod", cap: ["İşlək kod", "hər nümunə işlədilib, çıxışı yoxlanılıb"], pts: sample((g) => {
      g.font = "700 150px 'JetBrains Mono', ui-monospace, Consolas, monospace"; g.textAlign = "center"; g.textBaseline = "middle";
      g.lineWidth = 3; g.strokeText("{", 46, 112); g.strokeText("}", 174, 112);
      g.fillRect(100, 72, 20, 72); // the cursor
    }) },
    { name: "Vizual", cap: ["Vizual izah", "yaddaşda nə baş verdiyini addım-addım görürsən"], pts: cubePts(), spin: true },
    { name: "Test", cap: ["Test", "hər dərsin sonunda özünü yoxlayırsan"], pts: sample((g) => {
      g.lineWidth = 3.4; g.beginPath(); g.arc(110, 110, 92, 0, 7); g.stroke();
      g.beginPath(); g.arc(110, 110, 78, 0, 7); g.stroke();
      g.lineWidth = 9; g.beginPath(); g.moveTo(74, 114); g.lineTo(100, 140); g.lineTo(150, 84); g.stroke();
    }) },
    { name: "Müsahibə", cap: ["Müsahibə sualı", "mövzunun işdə necə soruşulduğunu bilirsən"], pts: sample((g) => {
      g.lineWidth = 3.4; rr(g, 22, 28, 176, 124, 34); g.stroke();
      g.beginPath(); g.moveTo(64, 152); g.lineTo(50, 196); g.lineTo(106, 152); g.stroke();
      g.font = "700 96px Inter, system-ui, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.lineWidth = 3; g.strokeText("?", 110, 94);
    }) },
  ];

  // particle state (screen space)
  const x = new Float32Array(N), y = new Float32Array(N), vx = new Float32Array(N), vy = new Float32Array(N);
  const hx = new Float32Array(N), hy = new Float32Array(N), ph = new Float32Array(N), rnd = new Float32Array(N), kk = new Float32Array(N), sz = new Float32Array(N);
  let Wd = 1, Hd = 1, CX = 0, CY = 0, R = 100, dpr = 1;
  let shapeIdx = 0, introChaos = motion ? 1 : 0, scrollChaos = 0;
  const ptr = { on: false, px: 0, py: 0, x: 0, y: 0 };

  function rgb(name) {
    const p = document.createElement("i"); p.style.color = "var(" + name + ")"; p.style.display = "none";
    document.body.appendChild(p);
    const m = getComputedStyle(p).color.match(/[\d.]+/g) || [120, 140, 255];
    p.remove();
    return [+m[0], +m[1], +m[2]];
  }
  let COL = [], COLA = [];
  function palette() {
    const st = [rgb("--cyan"), rgb("--accent"), rgb("--accent-2"), rgb("--accent-3")], dark = W.isDark();
    COL = []; COLA = [];
    for (let i = 0; i < 16; i++) {
      const u = (i / 15) * 2.3, a = Math.min(2, Math.floor(u)), f = Math.min(1, u - a);
      const c = [0, 1, 2].map((k) => Math.round(st[a][k] + (st[a + 1][k] - st[a][k]) * f)).join(",");
      // frames are not cleared but faded (trails), so a resting point adds up: keep the alpha low
      COL.push("rgba(" + c + "," + (dark ? 0.5 : 0.62) + ")"); COLA.push("rgba(" + c + "," + (dark ? 0.15 : 0.2) + ")");
    }
  }
  function layout() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    Wd = hero.clientWidth; Hd = hero.clientHeight;
    cv.width = Math.round(Wd * dpr); cv.height = Math.round(Hd * dpr);
    const h = hero.getBoundingClientRect(), z = zone.getBoundingClientRect(), uiH = ui.offsetHeight + 20;
    CX = z.left - h.left + z.width / 2; CY = z.top - h.top + (z.height - uiH) / 2;
    R = Math.min(z.width * 0.43, (z.height - uiH) * 0.47, 260);
    ring.style.setProperty("--cx", CX + "px"); ring.style.setProperty("--cy", CY + "px"); ring.style.setProperty("--d", R * 2.15 + "px");
  }
  function seed() {
    for (let i = 0; i < N; i++) {
      hx[i] = Math.random(); hy[i] = Math.random(); ph[i] = Math.random() * 6.283; rnd[i] = Math.random();
      kk[i] = 0.06 + Math.random() * 0.1; sz[i] = 1 + Math.random() * Math.random() * 1.5;
      x[i] = hx[i] * Wd; y[i] = hy[i] * Hd;
    }
  }
  let lastT = 0;
  // one simulation + draw step; snap = jump straight to the targets (static frame)
  function step(now, snap) {
    const t = now * 0.001, sh = SH[shapeIdx], pts = sh.pts, dark = W.isDark();
    const chaos = Math.max(introChaos, scrollChaos);
    const ry = sh.spin ? t * 0.55 : Math.sin(t * 0.45) * 0.3 + ptr.x * 0.3, rx = sh.spin ? 0.52 : -0.05 + ptr.y * 0.2;
    const cy_ = Math.cos(ry), sy_ = Math.sin(ry), cx_ = Math.cos(rx), sx_ = Math.sin(rx);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    let sub = 1;
    if (snap) ctx.clearRect(0, 0, Wd, Hd);
    else {
      const dt = Math.min(70, lastT ? now - lastT : 16.7); lastT = now;
      sub = Math.max(1, Math.min(4, Math.round(dt / 16.7)));
      // fade the last frame instead of clearing it: moving points leave short light trails
      ctx.globalCompositeOperation = "destination-out"; ctx.fillStyle = "rgba(0,0,0," + (1 - Math.pow(0.7, sub)).toFixed(3) + ")"; ctx.fillRect(0, 0, Wd, Hd);
    }
    ctx.globalCompositeOperation = dark ? "lighter" : "source-over";
    let last = "";
    for (let i = 0; i < N; i++) {
      const j = i * 3, ax = pts[j], ay = pts[j + 1], az = pts[j + 2];
      const x1 = ax * cy_ + az * sy_, z1 = az * cy_ - ax * sy_;
      const y1 = ay * cx_ - z1 * sx_, z2 = ay * sx_ + z1 * cx_;
      const p = 1 / (1 - z2 * 0.32);
      let tx = CX + x1 * p * R, ty = CY + y1 * p * R;
      const amb = i % 7 === 0; // ambient dust never joins the shape
      const c = amb ? 1 : clamp01(chaos * 1.5 - rnd[i] * 0.5);
      if (c > 0) {
        const fx = hx[i] * Wd + Math.sin(t * 0.33 + ph[i]) * 48, fy = hy[i] * Hd + Math.cos(t * 0.27 + ph[i] * 1.7) * 40;
        tx += (fx - tx) * c; ty += (fy - ty) * c;
      }
      if (snap) { x[i] = tx; y[i] = ty; vx[i] = vy[i] = 0; }
      else {
        let px_ = x[i], py_ = y[i], vx_ = vx[i], vy_ = vy[i];
        for (let q = 0; q < sub; q++) { // spring towards the target; sub-steps keep the speed the same at any frame rate
          vx_ += (tx - px_) * kk[i]; vy_ += (ty - py_) * kk[i];
          if (ptr.on) {
            const dx = px_ - ptr.px, dy = py_ - ptr.py, d2 = dx * dx + dy * dy;
            if (d2 < 14400 && d2 > 1) { const d = Math.sqrt(d2), f = (1 - d / 120) * 1.5; vx_ += (dx / d) * f; vy_ += (dy / d) * f; }
          }
          vx_ *= 0.8; vy_ *= 0.8; px_ += vx_; py_ += vy_;
        }
        x[i] = px_; y[i] = py_; vx[i] = vx_; vy[i] = vy_;
      }
      const b = (clamp01((x[i] - CX) / (2.5 * R) + 0.5) * 15) | 0;
      const col = amb ? COLA[b] : COL[b];
      if (col !== last) { ctx.fillStyle = col; last = col; }
      const s = amb ? sz[i] * 0.8 : sz[i] * (0.45 + 0.55 * p);
      ctx.fillRect(x[i] - s * 0.5, y[i] - s * 0.5, s, s);
    }
  }
  let raf = 0;
  const heroVis = watch(hero, { threshold: 0.02 });
  function loop(now) { step(now); raf = heroVis() && !document.hidden ? requestAnimationFrame(loop) : 0; if (!raf) lastT = 0; }
  function run() { if (motion && !raf) raf = requestAnimationFrame(loop); }
  const settle = () => step(performance.now(), true);

  // tabs + caption
  const tabs = $("#sculpt-tabs"), cap = $("#sculpt-cap");
  const CYCLE = 4600;
  tabs.style.setProperty("--cycle", CYCLE + "ms");
  tabs.innerHTML = SH.map((s, i) => '<button role="tab" aria-selected="' + (i === 0) + '" data-s="' + i + '">' + s.name + "</button>").join("");
  const paintCap = () => { cap.firstElementChild.textContent = SH[shapeIdx].cap[0]; cap.lastElementChild.textContent = SH[shapeIdx].cap[1]; };
  paintCap();
  function pulse() { ring.classList.remove("go"); void ring.offsetWidth; ring.classList.add("go"); }
  let cycleT = 0;
  function schedule() {
    clearTimeout(cycleT);
    if (!motion) return;
    tabs.classList.add("auto");
    cycleT = setTimeout(() => { if (heroVis() && !document.hidden && scrollChaos < 0.3) setShape((shapeIdx + 1) % SH.length); else schedule(); }, CYCLE);
  }
  function setShape(i) {
    shapeIdx = i;
    for (let k = 0; k < N; k++) { vx[k] += (Math.random() - 0.5) * 7; vy[k] += (Math.random() - 0.5) * 7; } // a kick, so the swarm bursts before it re-forms
    $$("button", tabs).forEach((b, k) => b.setAttribute("aria-selected", String(k === i)));
    cap.classList.add("swap");
    setTimeout(() => { paintCap(); cap.classList.remove("swap"); }, 220);
    if (motion) pulse(); else settle();
    schedule();
  }
  tabs.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) setShape(+b.dataset.s); });
  tabs.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const n = (shapeIdx + (e.key === "ArrowRight" ? 1 : -1) + SH.length) % SH.length;
    setShape(n); tabs.children[n].focus();
  });

  // headings wipe in from under a mask; the mask sits on an inner span, because an
  // element that clips itself away never reports as intersecting
  $$("h2[data-reveal]").forEach((h) => { const s = document.createElement("span"); s.className = "h2-in"; while (h.firstChild) s.appendChild(h.firstChild); h.appendChild(s); });

  // intro: the headline rises while the field is chaos; then everything locks into the map
  const title = $("#hero-title"), introEls = $$("[data-intro]");
  const reveal = (n) => introEls.forEach((el) => { if (+el.dataset.intro === n) el.classList.add("in"); });
  palette(); layout(); seed();
  if (!motion) {
    title.classList.add("go"); [1, 2, 3].forEach(reveal); settle();
  } else {
    run();
    setTimeout(() => title.classList.add("go"), 120);
    setTimeout(() => reveal(1), 1450);
    setTimeout(() => {
      const t0 = performance.now();
      (function lock(now) { const k = clamp01((now - t0) / 1150); introChaos = 1 - easeInOut(k); if (k < 1) requestAnimationFrame(lock); })(t0);
      setTimeout(pulse, 420);
      reveal(2);
      setTimeout(() => { reveal(3); schedule(); }, 420);
    }, 1750);
  }
  new IntersectionObserver((e) => { if (e[0].isIntersecting) run(); }, { threshold: 0.02 }).observe(hero);
  document.addEventListener("visibilitychange", () => { if (!document.hidden && heroVis()) run(); });
  window.addEventListener("w3:look", () => { palette(); if (!motion) settle(); });
  let rsz = 0;
  addEventListener("resize", () => { clearTimeout(rsz); rsz = setTimeout(() => { layout(); if (!motion) settle(); }, 120); });
  if (document.fonts) document.fonts.ready.then(() => { layout(); if (!motion) settle(); });
  if (motion && !coarse) {
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      ptr.on = true; ptr.px = e.clientX - r.left; ptr.py = e.clientY - r.top;
      ptr.x = ptr.px / r.width - 0.5; ptr.y = ptr.py / r.height - 0.5;
    }, { passive: true });
    hero.addEventListener("pointerleave", () => { ptr.on = false; });
  }

  // ======================================================
  // 01 BEFORE / AFTER
  // ======================================================
  const CHIPS = [
    ["video", "Playlist · 47 video", 4, 14, -7], ["forum", "slice yoxsa array?", 30, 9, 5], ["kurs", "34%-də qalıb", 57, 16, -4], ["pdf", "612 səhifə", 80, 10, 8],
    ["əlfəcin", "sonra oxuyaram", 12, 38, 6], ["tutorial", "#12 (yarımçıq)", 40, 34, -9], ["sual", "Hansı dildən başlayım?", 61, 43, 4], ["şəkil", "roadmap-final-v3.png", 7, 63, -5],
    ["sənəd", "Effective Go", 37, 60, 9], ["video", "Go 1 saatda", 62, 69, -6], ["qeyd", "bazar ertəsi başlayıram", 17, 84, 3], ["tab", "+35 açıq tab", 70, 86, -8],
    ["məqalə", "10 səhv ki, hamı edir", 24, 23, -3], ["kurs", "yenə endirimdədir", 50, 52, 7], ["forum", "bu hələ aktualdır?", 82, 34, -6], ["video", "2x sürətlə baxılıb", 84, 60, 5],
  ];
  $("#ba-before").insertAdjacentHTML("beforeend", CHIPS.map((c, i) =>
    '<span class="tabchip" style="--x:' + c[2] + "%;--y:" + c[3] + "%;--r:" + c[4] + "deg;--d:" + (3.6 + (i % 5) * 0.7) + "s;--jx:" + ((i % 3) - 1) * 9 + "px;--jy:" + (i % 2 ? -8 : 7) + "px;--jr:" + (c[4] + (i % 2 ? 4 : -4)) + 'deg"><i>' + c[0] + "</i>" + esc(c[1]) + "</span>").join(""));
  const FLAT = W.FLAT;
  const doneN = FLAT.filter((e) => W.learnedSet.has(e.slug)).length, next = FLAT.find((e) => !W.learnedSet.has(e.slug));
  $("#ba-clean").innerHTML =
    '<div class="bc-top"><span class="mono-ic" style="--c:#00add8">Go</span><div><b>Go yol xəritəsi</b><small>' + W.SECTIONS.length + " bölmə · " + FLAT.length + " mövzu</small></div><em>" + doneN + " / " + FLAT.length + "</em></div>" +
    '<div class="bc-bar" style="--p:' + Math.max(4, Math.round((doneN / (FLAT.length || 1)) * 100)) + '%"><i></i></div>' +
    '<ol class="bc-steps">' + W.SECTIONS.map((s) => {
      const all = s.items.every((it) => W.learnedSet.has(it[0])), now = next && s.id === next.sid;
      return '<li class="' + (all ? "done" : now ? "now" : "") + '">' + esc(s.title) + "</li>";
    }).join("") + "</ol>" +
    (next ? '<div class="bc-next"><div><small>NÖVBƏTİ DƏRS</small><b>' + esc(next.title) + "</b><span>" + esc(next.sub) + " · " + esc(next.section) + '</span></div><a class="btn btn-primary btn-sm" href="' + W.lessonHref(next.slug) + '">Davam et</a></div>' : "");
  const ba = $("#ba"), handle = $("#ba-handle");
  let split = 96, baTouched = false, baAnim = 0;
  function setSplit(v) { split = Math.max(3, Math.min(97, v)); ba.style.setProperty("--split", split + "%"); handle.setAttribute("aria-valuenow", String(Math.round(100 - split))); }
  function animSplit(to, dur) {
    cancelAnimationFrame(baAnim);
    if (!motion) { setSplit(to); return; }
    const from = split, t0 = performance.now();
    (function a(now) { const k = clamp01((now - t0) / dur); setSplit(from + (to - from) * easeInOut(k)); if (k < 1) baAnim = requestAnimationFrame(a); })(t0);
  }
  const splitAt = (e) => { const r = ba.getBoundingClientRect(); return ((e.clientX - r.left) / r.width) * 100; };
  handle.addEventListener("pointerdown", (e) => { baTouched = true; cancelAnimationFrame(baAnim); ba.classList.add("drag"); handle.setPointerCapture(e.pointerId); e.preventDefault(); });
  handle.addEventListener("pointermove", (e) => { if (ba.classList.contains("drag")) setSplit(splitAt(e)); });
  ["pointerup", "pointercancel"].forEach((ev) => handle.addEventListener(ev, () => ba.classList.remove("drag")));
  handle.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") { baTouched = true; e.preventDefault(); setSplit(split + (e.key === "ArrowLeft" ? -5 : 5)); }
  });
  ba.addEventListener("click", (e) => { if (e.target.closest("a, .ba-handle")) return; baTouched = true; animSplit(splitAt(e), 500); });
  setSplit(96);
  new IntersectionObserver((e, o) => { if (e[0].isIntersecting) { o.disconnect(); if (!baTouched) animSplit(innerWidth < 900 ? 6 : 43, 1700); } }, { threshold: 0.55 }).observe(ba);

  // ======================================================
  // 02 MANIFESTO: words light up as you scroll
  // ======================================================
  const mani = $("#manifesto");
  const MANI = [["Biz video çəkmirik. Slayd oxumuruq. Hər mövzunu", 0], ["qısa izah edirik,", 1], ["kodu", 0], ["gözünün qabağında işlədirik,", 1], ["yaddaşda nə baş verdiyini", 0], ["göstəririk", 1], ["— və soruşuruq: anladın? Azərbaycan dilində. Pulsuz. Açıq mənbə.", 0]];
  mani.innerHTML = MANI.map((seg) => seg[0].split(" ").map((w) => '<span class="mw' + (seg[1] ? " em" : "") + '">' + esc(w) + "</span>").join(" ")).join(" ");
  const mWords = $$(".mw", mani);
  let mLit = -1;
  function maniScroll() {
    if (!motion) return;
    const r = mani.getBoundingClientRect();
    const k = clamp01((innerHeight * 0.86 - r.top) / (r.height + innerHeight * 0.42));
    const lit = Math.round(k * mWords.length);
    if (lit === mLit) return;
    mLit = lit;
    mWords.forEach((w, i) => w.classList.toggle("on", i < lit));
  }

  // ======================================================
  // 03 ONE TOPIC, FIVE LAYERS: exploded view
  // ======================================================
  const LAYERS = [
    { n: "Nəzəriyyə", icon: "book", d: "Qısa, dəqiq izah. Bir ekran, artıq söz yoxdur.", html: '<div class="sk hl"></div><div class="sk"></div><div class="sk"></div><div class="sk s"></div>' },
    { n: "İşlək kod", icon: "code", d: "Hər nümunə Go ilə işlədilib; gördüyün çıxış real çıxışdır.", html: '<pre class="code" data-code></pre>' },
    { n: "Vizual", icon: "eye", d: "Sətir-sətir: yaddaşda nə dəyişir, ekrana nə çıxır.", html: '<div class="cells"><span class="cell on">"milk"</span><span class="cell on">"bread"</span><span class="cell on">"honey"</span><span class="cell cap">·</span></div><small>len 3 · cap 4</small>' },
    { n: "Test", icon: "check", d: "Beş-on sual. Səhv cavabın da izahı var.", html: '<div class="pq"><span>len 3 · cap 3</span><span class="ok">len 3 · cap 4 ✓</span><span>len 4 · cap 4</span></div>' },
    { n: "Müsahibə", icon: "chat", d: "Bu mövzu müsahibədə necə soruşulur — cavabı ilə.", html: '<div class="pi"><p>append niyə nəticəni qaytarır?</p><p class="a">Çünki yeni array ayrıla bilər.</p></div>' },
  ];
  const xp = $("#qatlar"), stack = $("#xp-stack"), xpList = $("#xp-list");
  stack.innerHTML = LAYERS.map((l, i) => '<div class="plate" style="--k:' + i + '"><div class="plate-head"><span class="plate-ic">' + W.I[l.icon] + "</span><b>" + l.n + "</b><em>0" + (i + 1) + "</em></div>" + l.html + "</div>").join("");
  xpList.innerHTML = LAYERS.map((l, i) => '<li><button type="button" class="xp-item" data-k="' + i + '"><span class="n">0' + (i + 1) + "</span><b>" + l.n + '</b><span class="d">' + l.d + "</span></button></li>").join("");
  W.renderCode($("[data-code]", stack), 'cart := []string{"milk", "bread"}\ncart = append(cart, "honey")\nfmt.Println(len(cart), cap(cart))');
  const plates = $$(".plate", stack), xpItems = $$(".xp-item", xpList);
  let xpActive = -2, xpStatic = false, xpTouched = false;
  function setLayer(i) {
    if (i === xpActive) return;
    xpActive = i;
    stack.classList.toggle("has-active", i >= 0);
    plates.forEach((p, k) => p.classList.toggle("active", k === i));
    xpItems.forEach((b, k) => b.classList.toggle("active", k === i));
  }
  const XP_FROM = 0.14, XP_STEP = 0.172;
  function xpScroll() {
    if (xpStatic) return;
    const r = xp.getBoundingClientRect(), total = r.height - innerHeight;
    const p = clamp01(-r.top / total);
    stack.style.setProperty("--gap", easeOut(clamp01(p / 0.2)).toFixed(3));
    stack.style.setProperty("--spin", (p * 16).toFixed(1) + "deg");
    setLayer(p < XP_FROM ? -1 : Math.min(4, Math.floor((p - XP_FROM) / XP_STEP)));
  }
  function xpMode() {
    xpStatic = !motion || innerWidth < 900;
    xp.classList.toggle("static", xpStatic);
    $("#xp-hint").textContent = xpStatic ? "Qatın adına toxun — içinə bax." : "Sürüşdür — qatlar ayrılsın.";
    if (xpStatic) { stack.style.setProperty("--gap", "1"); stack.style.setProperty("--spin", "0deg"); if (xpActive < 0) setLayer(0); } else xpScroll();
  }
  xpList.addEventListener("click", (e) => {
    const b = e.target.closest(".xp-item"); if (!b) return;
    const i = +b.dataset.k;
    if (xpStatic) { xpTouched = true; setLayer(i); return; }
    const r = xp.getBoundingClientRect(), total = r.height - innerHeight;
    scrollTo({ top: scrollY + r.top + total * (XP_FROM + XP_STEP * (i + 0.5)), behavior: "smooth" });
  });
  xpMode();
  addEventListener("resize", xpMode);
  const xpVis = watch(xp, { threshold: 0.2 });
  if (motion) setInterval(() => { if (xpStatic && !xpTouched && xpVis() && !document.hidden) setLayer((xpActive + 1) % LAYERS.length); }, 2600);

  // ======================================================
  // 04 ORBIT: technologies around you, directions as numbered paths
  // ======================================================
  const RINGS = [
    { r: 0.2, dur: 70, ids: ["go", "python", "typescript", "javascript", "rust"] },
    { r: 0.325, dur: 100, rev: true, ids: ["sql", "http", "react", "html"] },
    { r: 0.44, dur: 130, ids: ["git", "linux", "docker", "k8s"] },
  ];
  const short = (n) => n.replace(" və şəbəkə", "").replace(" və ", "/");
  const orbit = $("#orbit");
  orbit.innerHTML = RINGS.map((rg, ri) => '<div class="ring' + (rg.rev ? " rev" : "") + '" style="--r:' + rg.r + ";--dur:" + rg.dur + 's">' + rg.ids.map((id, k) => {
    const t = tech(id), a = (360 / rg.ids.length) * k + ri * 26;
    const inner = '<span class="mono-ic" style="--c:' + t.c + '">' + esc(t.ic) + "</span><span>" + esc(short(t.name)) + "</span>";
    return '<div class="orb" style="--a:' + a + 'deg">' + (t.href
      ? '<a class="orb-in live" href="' + t.href + '" data-tech="' + id + '" style="--c:' + t.c + '" title="' + esc(t.name) + ' — hazırdır">' + inner + "</a>"
      : '<div class="orb-in" data-tech="' + id + '" style="--c:' + t.c + '" title="' + esc(t.name) + ' — tezliklə">' + inner + "</div>") + "</div>";
  }).join("") + "</div>").join("") + '<div class="core"><b>sən</b><small>buradasan</small></div>';
  orbit.insertAdjacentHTML("afterend", '<p class="orbit-legend">daxili: dillər · orta: veb və data · xarici: alətlər və infra</p>');
  const dirsEl = $("#dirs"), dirPath = $("#dir-path"), orbs = $$(".orb-in", orbit);
  dirsEl.innerHTML = W.DIRECTIONS.map((d) => '<button class="dirb" role="tab" aria-selected="false" data-dir="' + d.id + '" style="--c:' + d.c + '"><span class="mono-ic" style="--c:' + d.c + '">' + d.ic + "</span><span><b>" + d.name + "</b><small>" + d.techs.length + " texnologiya · ~" + d.nodes + " node</small></span></button>").join("");
  let curDir = "", dirTouched = false;
  function selectDir(id) {
    if (id === curDir) return;
    curDir = id;
    const d = W.DIRECTIONS.find((v) => v.id === id);
    $$(".dirb", dirsEl).forEach((b) => b.setAttribute("aria-selected", String(b.dataset.dir === id)));
    orbit.classList.add("has-dir");
    orbs.forEach((el) => { const k = d.techs.indexOf(el.dataset.tech); el.classList.toggle("on", k >= 0); if (k >= 0) el.dataset.seq = k + 1; else el.removeAttribute("data-seq"); });
    dirPath.innerHTML = '<div class="dp-chain">' + d.techs.map((tid, i) => { const t = tech(tid); return '<span class="dp" style="--c:' + t.c + ";--i:" + i + '"><i>' + (i + 1) + "</i>" + esc(short(t.name)) + "</span>"; }).join("") + "</div><p>" + esc(d.desc) +
      (d.href ? '<a href="' + d.href + '">Xəritəni aç →</a>' : ' <span class="muted">Xəritə hazırlanır.</span>') + "</p>";
  }
  dirsEl.addEventListener("click", (e) => { const b = e.target.closest(".dirb"); if (b) { dirTouched = true; selectDir(b.dataset.dir); } });
  orbit.addEventListener("click", (e) => { const o = e.target.closest("div.orb-in"); if (o) W.toast(tech(o.dataset.tech).name + " — tezliklə"); });
  selectDir("backend");
  if (motion) {
    const vis = watch($("#stack"), { threshold: 0.3 });
    let di = 0;
    setInterval(() => { if (dirTouched || !vis() || document.hidden) return; di = (di + 1) % W.DIRECTIONS.length; selectDir(W.DIRECTIONS[di].id); }, 4600);
  }

  // ======================================================
  // 05 PLATFORM LIST with a cursor-following preview
  // ======================================================
  const pl = $("#pl"), prev = $("#pl-preview");
  pl.setAttribute("data-reveal", "");
  pl.innerHTML = W.PLATFORM.map((p, i) => '<li class="pl-row ' + p.status + '" data-i="' + i + '" style="--i:' + i + '"><span class="pl-n">0' + (i + 1) + '</span><b class="pl-name">' + p.name + '</b><span class="pl-desc">' + esc(p.desc) + "</span>" + W.badge(p.status) + '<span class="pl-arrow">' + W.I.arrow + "</span></li>").join("");
  if (!coarse) {
    let tx = 0, ty = 0, px = 0, py = 0, on = false, cur = -1;
    const tick = () => {
      px += (tx - px) * 0.18; py += (ty - py) * 0.18;
      prev.style.transform = "translate(" + px.toFixed(1) + "px," + py.toFixed(1) + "px)";
      if (on) requestAnimationFrame(tick);
    };
    pl.addEventListener("pointermove", (e) => {
      const row = e.target.closest(".pl-row"); if (!row) return;
      tx = Math.min(e.clientX + 26, innerWidth - 256); ty = Math.min(e.clientY + 20, innerHeight - 170);
      if (+row.dataset.i !== cur) {
        cur = +row.dataset.i;
        const p = W.PLATFORM[cur];
        prev.innerHTML = '<span class="pp-ic">' + W.I[p.icon] + "</span><b>" + p.name + "</b><small>" + esc(p.desc) + " · " + W.STATUS[p.status][1] + "</small>";
      }
      if (!on) { on = true; px = tx; py = ty; prev.classList.add("show"); if (motion) requestAnimationFrame(tick); else prev.style.transform = "translate(" + tx + "px," + ty + "px)"; }
      else if (!motion) prev.style.transform = "translate(" + tx + "px," + ty + "px)";
    });
    pl.addEventListener("pointerleave", () => { on = false; cur = -1; prev.classList.remove("show"); });
    addEventListener("scroll", () => { if (on) { on = false; cur = -1; prev.classList.remove("show"); } }, { passive: true });
  }

  // ======================================================
  // FINALE: resume where you left off
  // ======================================================
  if (FLAT.length) {
    $("#res-pct").textContent = Math.round((doneN / FLAT.length) * 100) + "%";
    new IntersectionObserver((e, o) => { if (e[0].isIntersecting) { $("#res-bar").style.strokeDashoffset = 314.2 * (1 - doneN / FLAT.length); o.disconnect(); } }).observe($("#resume"));
    if (next) {
      $("#res-title").textContent = next.title;
      $("#res-sub").textContent = next.sub + " · " + next.section + " · " + doneN + "/" + FLAT.length;
      $("#resume").href = $("#cta-next").href = W.lessonHref(next.slug);
    }
  }

  // ======================================================
  // one scroll handler for everything scroll-linked
  // ======================================================
  let ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      scrollChaos = clamp01(scrollY / (Hd * 0.75)) * 0.95; // leaving the hero: order dissolves back into dust
      maniScroll(); xpScroll();
    });
  }
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  W.paintIcons();
  W.observe();
})();
