// Design v3 — platform home. Runs after ../v2/v2.js (window.W3: data, icons, search, reveal, aurora).
(function () {
  "use strict";
  const W = window.W3;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = W.esc;
  const motion = !W.reduced;
  const PAGES = window.W3_PAGES || "";
  const coarse = matchMedia("(pointer: coarse)").matches;
  const tech = (id) => W.TECHS.find((t) => t.id === id);
  const ease = (k) => 1 - Math.pow(1 - k, 3);
  const clamp01 = (k) => Math.max(0, Math.min(1, k));
  // intersection helper: calls fn(visible) and keeps the last state
  function watch(el, fn, opts) { let v = false; new IntersectionObserver((e) => { v = e[0].isIntersecting; fn(v); }, opts || { threshold: 0.2 }).observe(el); return () => v; }
  function countUp(el, to, dur) {
    if (!motion) { el.textContent = to; return; }
    const t0 = performance.now();
    (function step(t) { const k = Math.min(1, (t - t0) / (dur || 1300)); el.textContent = Math.round(to * ease(k)); if (k < 1) requestAnimationFrame(step); })(t0);
  }

  // ======================================================
  // HERO: the learning path, drawn as the intro
  // ======================================================
  const NODES = [
    { t: "Hello, World", s: "Əsaslar · 01", ic: "Go", c: "#00add8", st: "done" },
    { t: "Variables", s: "Əsaslar · 03", ic: "Go", c: "#00add8", st: "done" },
    { t: "Slices", s: "Kolleksiyalar · 09", ic: "Go", c: "#00add8", st: "done" },
    { t: "Goroutines", s: "Konkurentlik · 31", ic: "Go", c: "#00add8", st: "now" },
    { t: "HTTP", s: "şəbəkə", ic: "Net", c: "#22c3a6", st: "up" },
    { t: "SQL", s: "verilənlər bazası", ic: "SQL", c: "#7b8cff", st: "up" },
    { t: "Docker", s: "deploy", ic: "Dkr", c: "#2496ed", st: "up" },
    { t: "İlk iş günü", s: "Backend developer", ic: "★", c: "#ff8a6b", st: "goal" },
  ];
  const NOW = 3; // the traveller stops at this node
  const DESK = [[0.07, 0.66], [0.195, 0.38], [0.32, 0.6], [0.445, 0.3], [0.57, 0.58], [0.695, 0.34], [0.82, 0.6], [0.935, 0.28]];
  const stage = $("#path-stage"), svg = $("#path-svg"), nodesEl = $("#path-nodes");
  const pGhost = $("#p-ghost"), pDraw = $("#p-draw"), pDone = $("#p-done"), trav = $("#trav"), travGlow = $("#trav-glow");
  nodesEl.innerHTML = NODES.map((n, i) =>
    '<div class="pnode ' + n.st + '" data-i="' + i + '" style="--c:' + n.c + '"><span class="mono-ic" style="--c:' + n.c + '">' + esc(n.ic) + "</span>" +
    '<span class="lbl"><b>' + esc(n.t) + "</b><small>" + esc(n.s) + "</small></span></div>").join("");
  const pnodes = $$(".pnode", nodesEl);
  let pts = [], L = 0, doneLen = 0;

  function positions() {
    const Wd = stage.clientWidth, H = stage.clientHeight, narrow = innerWidth < 720;
    return NODES.map((_, i) => narrow
      ? { x: Wd * (i % 2 ? 0.68 : 0.32), y: H * ((i + 0.5) / NODES.length) }
      : { x: Wd * DESK[i][0], y: H * DESK[i][1] });
  }
  // Catmull-Rom through the node centres → cubic Béziers
  function curve(p) {
    let d = "M" + p[0].x + " " + p[0].y;
    for (let i = 0; i < p.length - 1; i++) {
      const p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
      const c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6;
      const c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
      d += " C" + c1x.toFixed(1) + " " + c1y.toFixed(1) + " " + c2x.toFixed(1) + " " + c2y.toFixed(1) + " " + p2.x.toFixed(1) + " " + p2.y.toFixed(1);
    }
    return d;
  }
  // path length at the node's centre (closest point search, cheap enough for 8 nodes)
  function lenAt(i) {
    const target = pts[i];
    let lo = 0, hi = L, best = 0, bd = Infinity;
    for (let k = 0; k <= 60; k++) {
      const l = lo + ((hi - lo) * k) / 60, q = pDraw.getPointAtLength(l), d = Math.hypot(q.x - target.x, q.y - target.y);
      if (d < bd) { bd = d; best = l; }
    }
    return best;
  }
  function layoutPath() {
    const Wd = stage.clientWidth, H = stage.clientHeight;
    pts = positions();
    svg.setAttribute("viewBox", "0 0 " + Wd + " " + H);
    $("#pathGrad").setAttribute("x2", Wd);
    const d = curve(pts);
    pGhost.setAttribute("d", d); pDraw.setAttribute("d", d); pDone.setAttribute("d", d);
    L = pDraw.getTotalLength();
    pDraw.style.strokeDasharray = pDone.style.strokeDasharray = L;
    doneLen = lenAt(NOW);
    pnodes.forEach((el, i) => { el.style.setProperty("--x", ((pts[i].x / Wd) * 100).toFixed(2) + "%"); el.style.setProperty("--y", ((pts[i].y / H) * 100).toFixed(2) + "%"); });
  }
  function placeTrav(len) {
    const q = pDraw.getPointAtLength(len);
    trav.setAttribute("cx", q.x); trav.setAttribute("cy", q.y);
    travGlow.setAttribute("cx", q.x); travGlow.setAttribute("cy", q.y);
  }
  function finalState() {
    pDraw.style.strokeDashoffset = 0; pDraw.classList.add("settled");
    pDone.style.strokeDashoffset = L - doneLen;
    pnodes.forEach((el) => { el.style.transform = ""; el.style.opacity = ""; el.classList.add("in"); });
    placeTrav(doneLen); trav.setAttribute("opacity", 1); travGlow.setAttribute("opacity", 0.9); travGlow.classList.add("idle");
  }
  layoutPath();

  // --- intro timeline (ms). A returning visitor in this session gets a quicker version.
  const seen = (() => { try { return sessionStorage.getItem("w3:intro") === "1"; } catch (e) { return false; } })();
  try { sessionStorage.setItem("w3:intro", "1"); } catch (e) { /* private mode */ }
  const SPEED = seen ? 0.6 : 1;
  const T = { burst: 1000, burstStagger: 75, drawFrom: 420, drawTo: 1800, labels: 1000, title: 980, sub: 1500, cta: 1700, facts: 2000, travelFrom: 1800, travelTo: 3200, aurora: 700 };
  const heroTitle = $("#hero-title"), introEls = $$("[data-intro]");
  const facts = $$(".hero-facts [data-n]");
  function revealIntro(step) { introEls.forEach((el) => { if (+el.dataset.intro === step) el.classList.add("in"); }); if (step === 4) facts.forEach((b) => countUp(b, +b.dataset.n, 1200)); }

  if (!motion) {
    document.body.classList.remove("intro");
    finalState(); heroTitle.classList.add("go"); [0, 2, 3, 4].forEach(revealIntro);
    facts.forEach((b) => (b.textContent = b.dataset.n));
    W.aurora($("#aurora"), { scale: 0.5 });
  } else {
    // start: nodes gathered at the centre, path undrawn
    const cx = stage.clientWidth / 2, cy = stage.clientHeight / 2;
    const seeds = NODES.map((_, i) => ({ a: (i / NODES.length) * Math.PI * 2 + 0.6, r: 18 + (i % 3) * 10 }));
    pnodes.forEach((el) => { el.style.opacity = 0; });
    pDraw.style.strokeDashoffset = L; pDone.style.strokeDashoffset = L;
    const done = { title: false, sub: false, cta: false, facts: false, labels: false, aurora: false, settled: false };
    const t0 = performance.now();
    let travelling = true;
    function frame(now) {
      const t = (now - t0) / SPEED;
      // 1. burst: every node flies from the centre to its place, staggered
      pnodes.forEach((el, i) => {
        const k = clamp01((t - i * T.burstStagger) / T.burst);
        if (k <= 0) return;
        const e = 1 - Math.pow(1 - k, 4), over = 1 + 0.08 * Math.sin(k * Math.PI); // slight overshoot
        const sx = cx + Math.cos(seeds[i].a) * seeds[i].r, sy = cy + Math.sin(seeds[i].a) * seeds[i].r;
        const x = sx + (pts[i].x - sx) * e, y = sy + (pts[i].y - sy) * e;
        el.style.opacity = Math.min(1, k * 3);
        el.style.transform = "translate(-50%,-50%) translate(" + (x - pts[i].x).toFixed(1) + "px," + (y - pts[i].y).toFixed(1) + "px) scale(" + (0.35 + 0.65 * e * over).toFixed(3) + ")";
        if (k >= 1) { el.style.transform = ""; el.style.opacity = ""; }
      });
      // 2. the path draws itself left → right
      const kd = clamp01((t - T.drawFrom) / (T.drawTo - T.drawFrom));
      pDraw.style.strokeDashoffset = L * (1 - ease(kd));
      if (kd >= 1 && !done.settled) { done.settled = true; pDraw.classList.add("settled"); }
      // 3. copy
      if (t >= T.labels && !done.labels) { done.labels = true; pnodes.forEach((el) => el.classList.add("in")); revealIntro(0); }
      if (t >= T.title && !done.title) { done.title = true; heroTitle.classList.add("go"); }
      if (t >= T.sub && !done.sub) { done.sub = true; revealIntro(2); }
      if (t >= T.cta && !done.cta) { done.cta = true; revealIntro(3); }
      if (t >= T.facts && !done.facts) { done.facts = true; revealIntro(4); }
      if (t >= T.aurora && !done.aurora) { done.aurora = true; W.aurora($("#aurora"), { scale: 0.5 }); }
      // 4. the traveller walks the learned part of the path
      const kt = clamp01((t - T.travelFrom) / (T.travelTo - T.travelFrom));
      if (kt > 0) {
        const len = doneLen * ease(kt);
        placeTrav(len); pDone.style.strokeDashoffset = L - len;
        trav.setAttribute("opacity", 1); travGlow.setAttribute("opacity", 0.9);
      }
      if (kt >= 1) { travelling = false; travGlow.classList.add("idle"); document.body.classList.remove("intro"); return; }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  let rsz;
  addEventListener("resize", () => { clearTimeout(rsz); rsz = setTimeout(() => { layoutPath(); if (!document.body.classList.contains("intro")) finalState(); }, 120); });

  // pointer parallax on the path (desktop only)
  const hero = $("#start");
  if (motion && !coarse) {
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      stage.style.setProperty("--px", (x * 14).toFixed(1) + "px"); stage.style.setProperty("--py", (y * 10).toFixed(1) + "px");
    }, { passive: true });
    hero.addEventListener("pointerleave", () => { stage.style.setProperty("--px", "0px"); stage.style.setProperty("--py", "0px"); });
  }

  // ======================================================
  // SCROLL: reading progress + hero fade
  // ======================================================
  const progress = $("#progress-top"), heroInner = $("#hero-inner");
  let ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const max = document.documentElement.scrollHeight - innerHeight;
      progress.style.setProperty("--p", (max > 0 ? scrollY / max : 0).toFixed(4));
      if (motion) {
        const k = clamp01(scrollY / (innerHeight * 0.7));
        heroInner.style.opacity = (1 - k * 1.15).toFixed(3);
        heroInner.style.transform = "translateY(" + (-k * 46).toFixed(1) + "px)";
      }
    });
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // magnetic buttons
  if (motion && !coarse) {
    document.addEventListener("pointermove", (e) => {
      const b = e.target.closest && e.target.closest(".magnetic");
      if (!b) return;
      const r = b.getBoundingClientRect();
      b.style.setProperty("--tx", (((e.clientX - r.left) / r.width - 0.5) * 12).toFixed(1) + "px");
      b.style.setProperty("--ty", (((e.clientY - r.top) / r.height - 0.5) * 8).toFixed(1) + "px");
    }, { passive: true });
    document.addEventListener("pointerout", (e) => { const b = e.target.closest && e.target.closest(".magnetic"); if (b && !b.contains(e.relatedTarget)) { b.style.setProperty("--tx", "0px"); b.style.setProperty("--ty", "0px"); } });
  }

  // ======================================================
  // BAND: technology marquee
  // ======================================================
  const mqSet = () => '<div class="mq-set">' + W.TECHS.map((t) => {
    const inner = '<span class="mono-ic" style="--c:' + t.c + '">' + esc(t.ic) + "</span>" + esc(t.name) + "<small>" + (t.status === "live" ? "84 mövzu" : "tezliklə") + "</small><i></i>";
    return t.href ? '<a class="mq-item live" href="' + t.href + '" style="--c:' + t.c + '">' + inner + "</a>" : '<span class="mq-item" style="--c:' + t.c + '">' + inner + "</span>";
  }).join("") + "</div>";
  $("#marquee-track").innerHTML = mqSet() + mqSet();

  // ======================================================
  // STORY: map → lesson → quiz
  // ======================================================
  const chapters = $$(".chapter"), framesEl = $("#frames"), frames = $$(".frame", framesEl);
  let activeCh = 0, narrowStory = false;
  function layoutStory() {
    narrowStory = innerWidth < 900;
    frames.forEach((f, i) => {
      const target = narrowStory ? $(".ch-frame", chapters[i]) : framesEl;
      if (f.parentElement !== target) target.appendChild(f);
    });
  }
  layoutStory();
  addEventListener("resize", layoutStory);
  function setChapter(i) {
    if (i === activeCh && chapters[i].classList.contains("active")) return;
    activeCh = i;
    chapters.forEach((c, k) => c.classList.toggle("active", k === i));
    framesEl.dataset.active = i;
  }
  function pickChapter() {
    if (narrowStory) return;
    const mid = innerHeight * 0.55;
    let i = 0;
    chapters.forEach((c, k) => { if (c.getBoundingClientRect().top < mid) i = k; });
    setChapter(i);
  }
  addEventListener("scroll", pickChapter, { passive: true }); pickChapter();
  // is frame i showing right now? (desktop: the active frame while the story is on screen; narrow: its own visibility)
  const storyVis = watch($("#story"), () => {}, { threshold: 0.05 });
  const frameVis = frames.map((f) => watch(f, () => {}, { threshold: 0.3 }));
  const live = (i) => !document.hidden && (narrowStory ? frameVis[i]() : storyVis() && activeCh === i);

  // frame 0: the Backend map with Go expanded
  const roadSt = { git: "done", linux: "done", http: "done", go: "now" };
  const goSecs = W.SECTIONS.slice(0, 4);
  $("#mini-road").innerHTML = W.DIRECTIONS[0].techs.map((id, i) => {
    const t = tech(id), st = roadSt[id] || "up";
    let inner = '<span class="mono-ic" style="--c:' + t.c + '">' + esc(t.ic) + "</span><b>" + esc(t.name) + "</b><em>" + (st === "done" ? "✓" : st === "now" ? "38%" : "") + "</em>";
    if (st === "now") inner += '<span class="sub">' + goSecs.map((s, k) => '<span class="' + (k === 0 ? "d" : k === 1 ? "n" : "") + '">' + esc(s.title) + (k === 1 ? " · davam" : "") + "</span>").join("") + "<span>… 5 bölmə daha</span></span>" +
      '<span class="bar" style="--p:38%"><i></i></span>';
    return '<li class="' + st + '" style="--i:' + i + '">' + inner + "</li>";
  }).join("");

  // frame 1: the Slices lesson (two-way highlighting + auto steps)
  const FL_SRC = 'func main() {\n\tvar cart []string\n\tcart = append(cart, "milk")\n\tcart = append(cart, "bread")\n\tcart = append(cart, "honey")\n\tfmt.Println(cart, len(cart), cap(cart))\n}';
  const FL_STEPS = [
    { h: "Boş slice", p: "Slice elan olunur — hələ array yoxdur, dəyəri nil-dir.", lines: [2], cells: [], cap: 0, out: "[] 0 0" },
    { h: "append böyüdür", p: "Element əlavə olunur; yer yoxdursa Go yeni array ayırır.", lines: [3, 4], cells: ["milk", "bread"], cap: 2, out: "[milk bread] 2 2" },
    { h: "Tutum ikiqat", p: "Tutum dolanda ikiqat artır — bir boş yer qalır.", lines: [5, 6], cells: ["milk", "bread", "honey"], cap: 4, out: "[milk bread honey] 3 4" },
  ];
  const flCode = $("#fl-code"), flSteps = $("#fl-steps"), flCells = $("#fl-cells");
  W.renderCode(flCode, FL_SRC);
  flSteps.innerHTML = FL_STEPS.map((s, i) => '<li data-s="' + i + '"><b>' + esc(s.h) + "</b>" + esc(s.p) + "</li>").join("");
  let flI = -1, flPrev = [], flHold = 0;
  function flPaint(i) {
    if (i === flI) return;
    flI = i;
    const st = FL_STEPS[i];
    $$("li", flSteps).forEach((l, k) => l.classList.toggle("on", k === i));
    $$(".ln", flCode).forEach((l, k) => l.classList.toggle("hl", st.lines.includes(k + 1)));
    let html = st.cells.map((c, k) => '<span class="cell on' + (k >= flPrev.length ? " pop" : "") + '">"' + c + '"</span>').join("");
    for (let k = st.cells.length; k < st.cap; k++) html += '<span class="cell cap">·</span>';
    flCells.innerHTML = html || '<span class="cell cap">nil</span>';
    $("#fl-lc").textContent = "len " + st.cells.length + " · cap " + st.cap;
    $("#fl-step").textContent = i + 1;
    $("#fl-out-v").textContent = st.out;
    flPrev = st.cells;
  }
  flPaint(0);
  const flHoldFor = (ms) => (flHold = Date.now() + ms);
  flSteps.addEventListener("mouseover", (e) => { const l = e.target.closest("li"); if (l) { flHoldFor(6000); flPaint(+l.dataset.s); } });
  flSteps.addEventListener("click", (e) => { const l = e.target.closest("li"); if (l) { flHoldFor(10000); flPaint(+l.dataset.s); } });
  flCode.addEventListener("mouseover", (e) => {
    const ln = e.target.closest(".ln"); if (!ln) return;
    const n = +ln.dataset.n, i = FL_STEPS.findIndex((s) => s.lines.includes(n));
    if (i >= 0) { flHoldFor(4000); flPaint(i); }
  });
  if (motion) setInterval(() => { if (!live(1) || Date.now() < flHold) return; if (flI === FL_STEPS.length - 1) flPrev = []; flPaint((flI + 1) % FL_STEPS.length); }, 2600);

  // frame 2: the quiz, played by a ghost cursor
  W.renderCode($("#fq-code"), "s := []int{1, 2, 3}\nt := s[:2]\nt[0] = 9\nfmt.Println(s[0])");
  const fqFrame = frames[2], fqOpts = $("#fq-opts"), fqWhy = $("#fq-why"), fqLearn = $("#fq-learn"), fqNext = $("#fq-next"), cursor = $("#fq-cursor");
  const WHY = { ok: "Düzdür: <code>t</code> və <code>s</code> eyni array-i bölüşür.", bad: "Yenidən cəhd et — <code>t := s[:2]</code> kopya yaratmır." };
  function fqAnswer(o) {
    const li = $('[data-o="' + o + '"]', fqOpts); if (!li) return;
    const ok = o === "9";
    li.classList.add(ok ? "ok" : "bad");
    fqWhy.innerHTML = WHY[ok ? "ok" : "bad"];
  }
  function fqReset() { $$("li", fqOpts).forEach((l) => l.classList.remove("ok", "bad")); fqWhy.textContent = ""; fqLearn.classList.remove("on"); fqNext.classList.remove("on"); }
  fqOpts.addEventListener("click", (e) => { const li = e.target.closest("li"); if (li) { fqScript.stop(); fqReset(); fqAnswer(li.dataset.o); } });
  fqLearn.addEventListener("click", () => { fqScript.stop(); fqLearn.classList.add("on"); fqNext.classList.add("on"); });
  const fqScript = (function () {
    let timer = 0, stopped = false;
    const at = (el) => { const r = el.getBoundingClientRect(), f = fqFrame.getBoundingClientRect(); cursor.style.setProperty("--cx", (r.left - f.left + r.width * 0.5) + "px"); cursor.style.setProperty("--cy", (r.top - f.top + r.height * 0.5) + "px"); };
    const click = () => { cursor.classList.add("click"); setTimeout(() => cursor.classList.remove("click"), 180); };
    const steps = [
      [600, () => { fqReset(); cursor.classList.add("show"); at($('[data-o="1"]', fqOpts)); }],
      [900, () => { click(); fqAnswer("1"); }],
      [1600, () => at($('[data-o="9"]', fqOpts))],
      [900, () => { click(); fqAnswer("9"); }],
      [1300, () => at(fqLearn)],
      [900, () => { click(); fqLearn.classList.add("on"); fqNext.classList.add("on"); }],
      [1200, () => cursor.classList.remove("show")],
      [2600, () => {}],
    ];
    let i = 0;
    function next() {
      if (stopped) return;
      if (!live(2)) { timer = setTimeout(next, 600); return; }
      const [wait, fn] = steps[i];
      timer = setTimeout(() => { fn(); i = (i + 1) % steps.length; next(); }, wait);
    }
    return { start() { if (motion) next(); }, stop() { stopped = true; clearTimeout(timer); cursor.classList.remove("show"); } };
  })();
  fqScript.start();
  if (!motion) { fqAnswer("9"); fqLearn.classList.add("on"); fqNext.classList.add("on"); }

  // ======================================================
  // DIRECTIONS: tabs + FLIP chain + technology cloud
  // ======================================================
  const dirTabs = $("#dir-tabs"), chain = $("#chain"), dirMeta = $("#dir-meta"), cloud = $("#tech-cloud");
  dirTabs.innerHTML = W.DIRECTIONS.map((d) =>
    '<button class="dir-tab" role="tab" aria-selected="false" data-dir="' + d.id + '" style="--c:' + d.c + '"><span class="mono-ic" style="--c:' + d.c + '">' + d.ic + "</span>" + d.name + "<small>" + d.techs.length + " tex.</small></button>").join("");
  cloud.innerHTML = W.TECHS.map((t) => {
    const inner = '<span class="mono-ic" style="--c:' + t.c + '">' + esc(t.ic) + "</span>" + esc(t.name) + (t.status === "live" ? "" : "<small>tezliklə</small>");
    return t.href ? '<a class="tc" href="' + t.href + '" data-tech="' + t.id + '" style="--c:' + t.c + '">' + inner + "</a>" : '<span class="tc" data-tech="' + t.id + '" style="--c:' + t.c + '" title="' + esc(t.desc) + '">' + inner + "</span>";
  }).join("");
  let curDir = null, dirTouched = false;
  function tileHTML(t, isNew) {
    const inner = '<span class="mono-ic" style="--c:' + t.c + '">' + esc(t.ic) + "</span><b>" + esc(t.name) + "</b><small>" + (t.status === "live" ? "hazırdır" : "tezliklə") + "</small>";
    const cls = "ct" + (t.status === "live" ? " live" : "") + (isNew ? " enter" : "");
    return t.href ? '<a class="' + cls + '" href="' + t.href + '" data-id="' + t.id + '" style="--c:' + t.c + '">' + inner + "</a>" : '<span class="' + cls + '" data-id="' + t.id + '" style="--c:' + t.c + '" title="' + esc(t.desc) + '">' + inner + "</span>";
  }
  function selectDir(id) {
    if (id === curDir) return;
    const d = W.DIRECTIONS.find((x) => x.id === id);
    const before = {};
    $$(".ct", chain).forEach((el) => { before[el.dataset.id] = el.getBoundingClientRect(); });
    curDir = id;
    $$(".dir-tab", dirTabs).forEach((b) => b.setAttribute("aria-selected", String(b.dataset.dir === id)));
    chain.style.setProperty("--wire", d.c);
    chain.innerHTML = d.techs.map((tid, i) => (i ? '<span class="ct-link" style="--i:' + i + '"><i></i></span>' : "") + tileHTML(tech(tid), motion && !before[tid])).join("");
    // FLIP: tiles that were already on the board glide to their new slot
    if (motion) $$(".ct", chain).forEach((el) => {
      const a = before[el.dataset.id]; if (!a) return;
      const b = el.getBoundingClientRect(), dx = a.left - b.left, dy = a.top - b.top;
      if (!dx && !dy) return;
      el.style.transition = "none"; el.style.transform = "translate(" + dx + "px," + dy + "px)";
      requestAnimationFrame(() => { el.style.transition = "transform 0.6s var(--ease-out)"; el.style.transform = ""; el.addEventListener("transitionend", () => { el.style.transition = ""; }, { once: true }); });
    });
    dirMeta.innerHTML = "<p>" + esc(d.desc) + '</p><span class="n">' + d.techs.length + " texnologiya · ~" + d.nodes + " node</span>" + W.badge(d.status) + (d.href ? '<a href="' + d.href + '">Xəritəni aç →</a>' : '<span class="n">xəritə hazırlanır</span>');
    $$(".tc", cloud).forEach((el) => el.classList.toggle("on", d.techs.includes(el.dataset.tech)));
  }
  dirTabs.addEventListener("click", (e) => { const b = e.target.closest(".dir-tab"); if (b) { dirTouched = true; selectDir(b.dataset.dir); } });
  chain.addEventListener("click", (e) => { const t = e.target.closest("span.ct"); if (t) W.toast(tech(t.dataset.id).name + " — tezliklə"); });
  cloud.addEventListener("click", (e) => { const t = e.target.closest("span.tc"); if (t) W.toast(tech(t.dataset.tech).name + " — tezliklə"); });
  selectDir("backend");
  if (motion) {
    const vis = watch($("#stack"), () => {}, { threshold: 0.3 });
    let i = 0;
    setInterval(() => { if (dirTouched || !vis() || document.hidden) return; i = (i + 1) % W.DIRECTIONS.length; selectDir(W.DIRECTIONS[i].id); }, 4200);
  }

  // ======================================================
  // FIVE FACETS: live cards
  // ======================================================
  const FACETS = [
    { id: "theory", name: "Nəzəriyyə", sub: "Qısa, dəqiq izah", icon: "book",
      html: '<div class="fc-theory"><p><mark>Slice</mark> — eyni tipli elementlərin dinamik siyahısıdır. <mark>len</mark> hazırkı element sayını, <mark>cap</mark> yeni yer ayrılmadan sığan sayı göstərir. <mark>append</mark> nəticəni qaytarır — onu yenidən mənimsət.</p></div>' },
    { id: "practice", name: "Praktika", sub: "İşlək kod, real çıxış", icon: "code",
      html: '<div class="fc-practice"><pre class="code" data-code></pre><div class="fc-out" data-out></div></div>' },
    { id: "visual", name: "Vizual", sub: "Yaddaşda addım-addım", icon: "eye",
      html: '<div class="fc-vis"><code data-vcode></code><div class="cells" data-cells></div><span class="meta" data-meta></span><span class="note" data-note></span></div>' },
    { id: "test", name: "Test", sub: "Özünü yoxla", icon: "check",
      html: '<div class="fc-test"><p>len(s[1:]) neçədir?</p><pre class="code" data-code></pre><div class="fc-opts">' + ["2", "3", "1"].map((o) => '<button type="button" data-o="' + o + '">' + o + "</button>").join("") + "</div></div>" },
    { id: "interview", name: "Müsahibə", sub: "Real sual, cavabı ilə", icon: "chat",
      html: '<div class="fc-int"><span class="badge next lvl">junior+</span><p class="q"><code>append</code> niyə bəzən orijinal slice-ı dəyişir, bəzən yox?</p><p class="a blur">Tutum çatırsa eyni array-ə yazır — onu bölüşən slice dəyişikliyi görür. Çatmırsa yeni array ayırır, köhnə toxunulmaz qalır.</p><button type="button" class="btn btn-sm reveal" data-reveal-a>Cavabı göstər</button></div>' },
  ];
  const facetsEl = $("#facets5");
  facetsEl.innerHTML = FACETS.map((f, i) => '<article class="fc glass spot" data-reveal style="--i:' + i + '" data-fc="' + f.id + '"><div class="fc-head"><span class="fc-ic">' + W.I[f.icon] + "</span><div><h3>" + f.name + "</h3><small>" + f.sub + '</small></div></div><div class="fc-demo">' + f.html + "</div></article>").join("");
  const fcVis = watch(facetsEl, () => {}, { threshold: 0.25 });
  const fcLive = () => fcVis() && !document.hidden;
  // theory: terms light up in turn
  const marks = $$('[data-fc="theory"] mark');
  if (motion) { let m = 0; setInterval(() => { if (!fcLive()) return; marks.forEach((x, k) => x.classList.toggle("on", k === m)); m = (m + 1) % marks.length; }, 1500); } else marks.forEach((x) => x.classList.add("on"));
  // practice: the cursor line sweeps, then the program prints
  const prPre = $('[data-fc="practice"] [data-code]'), prOut = $('[data-fc="practice"] [data-out]');
  W.renderCode(prPre, "s := []int{1, 2}\ns = append(s, 3)\nfmt.Println(s, len(s))");
  const prLines = $$(".ln", prPre), PR_OUT = "[1 2 3] 3";
  if (motion) {
    let p = 0;
    setInterval(() => {
      if (!fcLive()) return;
      prLines.forEach((l, k) => l.classList.toggle("hl", k === p));
      if (p === prLines.length - 1) { let c = 0; const ty = setInterval(() => { c++; prOut.textContent = PR_OUT.slice(0, c); if (c >= PR_OUT.length) clearInterval(ty); }, 28); }
      if (p === 0) prOut.textContent = "";
      p = (p + 1) % (prLines.length + 1);
    }, 1100);
  } else { prOut.textContent = PR_OUT; }
  // visual: cells appear as append runs
  const VIS = [
    { code: "var cart []string", cells: [], cap: 0, note: "nil: hələ array yoxdur" },
    { code: 'append(cart, "milk")', cells: ["milk"], cap: 1, note: "yeni array ayrılır" },
    { code: 'append(cart, "bread")', cells: ["milk", "bread"], cap: 2, note: "yer çatmır — yenə yeni array" },
    { code: 'append(cart, "honey")', cells: ["milk", "bread", "honey"], cap: 4, note: "tutum ikiqat: bir boş yer" },
  ];
  const vc = $('[data-fc="visual"]');
  function paintVis(i) {
    const s = VIS[i], prev = i ? VIS[i - 1].cells.length : 0;
    $("[data-vcode]", vc).textContent = s.code;
    let html = s.cells.map((c, k) => '<span class="cell on' + (k >= prev ? " pop" : "") + '">"' + c + '"</span>').join("");
    for (let k = s.cells.length; k < s.cap; k++) html += '<span class="cell cap">·</span>';
    $("[data-cells]", vc).innerHTML = html || '<span class="cell cap">nil</span>';
    $("[data-meta]", vc).textContent = "len " + s.cells.length + " · cap " + s.cap;
    $("[data-note]", vc).textContent = s.note;
  }
  paintVis(motion ? 0 : 3);
  if (motion) { let v = 0; setInterval(() => { if (!fcLive()) return; v = (v + 1) % VIS.length; paintVis(v); }, 1600); }
  // test: a right answer, picked (or pick it yourself)
  const tc = $('[data-fc="test"]');
  W.renderCode($("[data-code]", tc), 's := []int{1, 2, 3}\nfmt.Println(len(s[1:]))');
  const tBtns = $$(".fc-opts button", tc);
  let tTouched = 0;
  tc.addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; tTouched = Date.now() + 8000; tBtns.forEach((x) => x.classList.remove("ok", "bad")); b.classList.add(b.dataset.o === "2" ? "ok" : "bad"); });
  if (motion) { let phase = 0; setInterval(() => { if (!fcLive() || Date.now() < tTouched) return; phase = (phase + 1) % 3; tBtns.forEach((x) => x.classList.remove("ok", "bad")); if (phase === 1) tBtns[2].classList.add("bad"); if (phase === 2) tBtns[0].classList.add("ok"); }, 1400); } else tBtns[0].classList.add("ok");
  // interview: the answer un-blurs, then hides again
  const ic = $('[data-fc="interview"]'), ia = $(".a", ic), ib = $("[data-reveal-a]", ic);
  let iTouched = 0;
  ib.addEventListener("click", () => { iTouched = Date.now() + 10000; ia.classList.remove("blur"); });
  if (motion) setInterval(() => { if (!fcLive() || Date.now() < iTouched) return; ia.classList.toggle("blur"); }, 3200); else ia.classList.remove("blur");

  // ======================================================
  // COMPARISON
  // ======================================================
  const Y = '<span class="mk y" aria-label="var">✓</span>', N = '<span class="mk n" aria-label="yoxdur">—</span>';
  const Pp = '<span class="mk p">qismən</span>', S = '<span class="mk s">tezliklə</span>';
  const ROWS = [
    ["Azərbaycan dilində", Y, N, Pp, N],
    ["Öyrənmə ardıcıllığı (yol xəritəsi)", Y, Y, Pp, N],
    ["Hər mövzuda işlək, yoxlanılmış kod", Y, Pp, Y, Y],
    ["Vizual, addım-addım izah", Y, N, Pp, N],
    ["Hər dərsdə test", Y, Pp, Pp, N],
    ["Müsahibə sualları mövzuya bağlı", S, Pp, Pp, N],
    ["Bütün texnologiyalar bir saytda", Y, Y, N, N],
    ["Pulsuz, açıq lisenziyalı məzmun", Y, Pp, N, Y],
  ];
  $("#cmp-body").innerHTML = ROWS.map((r) => '<tr><th scope="row">' + r[0] + '</th><td class="us">' + r[1] + "</td><td>" + r[2] + "</td><td>" + r[3] + "</td><td>" + r[4] + "</td></tr>").join("");

  // ======================================================
  // PLATFORM TIMELINE (rollout order)
  // ======================================================
  const tl = $("#timeline");
  const lastLive = W.PLATFORM.map((p) => p.status).lastIndexOf("live");
  tl.style.setProperty("--p", ((lastLive / (W.PLATFORM.length - 1)) * 87.5).toFixed(2) + "%");
  tl.innerHTML = '<span class="tl-fill" aria-hidden="true"></span>' + W.PLATFORM.map((p, i) =>
    '<li class="tl ' + p.status + '"><span class="tl-dot">' + W.I[p.icon] + "</span><b>" + p.name + "</b><p>" + esc(p.desc) + "</p>" + W.badge(p.status) + "</li>").join("");

  // ======================================================
  // CTA: resume where you left off
  // ======================================================
  const FLAT = W.FLAT;
  if (FLAT.length) {
    const done = FLAT.filter((e) => W.learnedSet.has(e.slug)).length;
    const next = FLAT.find((e) => !W.learnedSet.has(e.slug));
    $("#res-pct").textContent = Math.round((done / FLAT.length) * 100) + "%";
    new IntersectionObserver((e, o) => { if (e[0].isIntersecting) { $("#res-bar").style.strokeDashoffset = 314.2 * (1 - done / FLAT.length); o.disconnect(); } }).observe($("#resume"));
    if (next) {
      $("#res-title").textContent = next.title;
      $("#res-sub").textContent = next.sub + " · " + next.section + " · " + done + "/" + FLAT.length;
      $("#resume").href = $("#cta-next").href = $("#hero-go").href = W.lessonHref(next.slug);
    }
  }

  W.paintIcons();
  W.observe();
  if (document.fonts) document.fonts.ready.then(() => { layoutPath(); if (!document.body.classList.contains("intro")) finalState(); });
})();
