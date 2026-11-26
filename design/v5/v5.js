// Design v5 — platform home: v2 and v3 merged. Runs after ../v2/v2.js (window.W3: data, icons, search, reveal).
// Part A is v2's home.js without the showcase cards; part B is v3's particle hero, before/after slider and
// manifesto, plus what is new in v5 (typed text drawn by the particles, click to scatter, tabs → facet demo).

// ---------- part A: v2 sections ----------
(function () {
  "use strict";
  const W = window.W3;
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = W.esc;
  const SVG = "http://www.w3.org/2000/svg";
  const motion = !W.reduced;

  // ---------- aurora ----------
  W.aurora($("#aurora"));

  // layout position of el inside an ancestor (ignores transforms, so reveal animations don't skew wires)
  function rel(el, anc) {
    let x = 0, y = 0, n = el;
    while (n && n !== anc) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
    return { x, y, w: el.offsetWidth, h: el.offsetHeight };
  }
  const tech = (id) => W.TECHS.find((t) => t.id === id);

  // ---------- hero: ask box ----------
  const ask = $("#ask"), askInput = $("#ask-input");
  ask.addEventListener("submit", (e) => { e.preventDefault(); W.openPalette(askInput.value.trim()); });
  ask.querySelectorAll("[data-q]").forEach((c) => c.addEventListener("click", () => W.openPalette(c.dataset.q)));
  if (motion) {
    const PH = ["Backend developer olmaq üçün nə öyrənim?", "Go-da goroutine necə işləyir?", "Slice ilə array arasında fərq", "System design müsahibəsinə hazırlıq", "Two pointers pattern-i"];
    let pi = 0, ci = 0, del = false;
    (function type() {
      if (document.activeElement === askInput || askInput.value) { setTimeout(type, 800); return; }
      const s = PH[pi];
      ci += del ? -1 : 1;
      askInput.placeholder = s.slice(0, ci) + (ci < s.length || del ? "▍" : "");
      let wait = del ? 22 : 48;
      if (!del && ci === s.length) { wait = 2200; del = true; }
      else if (del && ci === 0) { del = false; pi = (pi + 1) % PH.length; wait = 400; }
      setTimeout(type, wait);
    })();
  }

  // ---------- stack map ----------
  const stack = $("#stack-map"), dirsEl = $("#stack-dirs"), techsEl = $("#stack-techs"), wires = $("#stack-wires"), pathEl = $("#stack-path");
  dirsEl.innerHTML = W.DIRECTIONS.map((d) =>
    '<button class="dir glass spot" role="tab" aria-selected="false" data-dir="' + d.id + '" style="--c:' + d.c + '">' +
    '<span class="mono-ic" style="--c:' + d.c + '">' + d.ic + "</span><span><b>" + d.name + "</b><small>" + esc(d.desc) + "</small></span>" +
    '<span class="n">' + d.techs.length + " tex.<br>~" + d.nodes + " node</span></button>").join("");
  techsEl.innerHTML = W.TECHS.map((t) => {
    const live = t.status === "live";
    const inner = '<span class="mono-ic" style="--c:' + t.c + '">' + esc(t.ic) + "</span><span><b>" + esc(t.name) + "</b><small>" + (live ? "84 mövzu · hazırdır" : "tezliklə") + "</small></span>";
    return live
      ? '<a class="tech glass live" href="' + t.href + '" data-tech="' + t.id + '" style="--c:' + t.c + '">' + inner + "</a>"
      : '<div class="tech glass" data-tech="' + t.id + '" style="--c:' + t.c + '" title="' + esc(t.desc) + '">' + inner + "</div>";
  }).join("");

  let curDir = null, dirTouched = false;
  function drawWires() {
    wires.innerHTML = "";
    if (!curDir || getComputedStyle(wires).display === "none") return;
    const d = W.DIRECTIONS.find((x) => x.id === curDir);
    const dEl = dirsEl.querySelector('[data-dir="' + curDir + '"]');
    const a = rel(dEl, stack);
    const x1 = a.x + a.w + 6, y1 = a.y + a.h / 2;
    wires.style.setProperty("--wire", d.c);
    let out = "";
    d.techs.forEach((id) => {
      const tEl = techsEl.querySelector('[data-tech="' + id + '"]');
      const b = rel(tEl, stack);
      const x2 = b.x - 2, y2 = b.y + b.h / 2;
      const dx = Math.max(40, (x2 - x1) * 0.5);
      out += '<path class="on" d="M' + x1 + " " + y1 + " C" + (x1 + dx) + " " + y1 + " " + (x2 - dx) + " " + y2 + " " + x2 + " " + y2 + '"/><circle cx="' + x2 + '" cy="' + y2 + '" r="3"/>';
    });
    wires.innerHTML = out + '<circle cx="' + x1 + '" cy="' + y1 + '" r="4"/>';
  }
  function selectDir(id) {
    curDir = id;
    const d = W.DIRECTIONS.find((x) => x.id === id);
    stack.classList.add("has-sel");
    dirsEl.querySelectorAll(".dir").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.dir === id)));
    techsEl.querySelectorAll(".tech").forEach((t) => t.classList.toggle("on", d.techs.includes(t.dataset.tech)));
    drawWires();
    pathEl.innerHTML = '<span class="lbl">' + d.name + " yolu</span>" +
      d.techs.map((tid) => { const t = tech(tid); return '<span class="step"><span class="mono-ic" style="--c:' + t.c + '">' + esc(t.ic) + "</span>" + esc(t.name) + "</span>"; }).join('<span class="sep">→</span>') +
      '<span class="go">' + W.badge(d.status) + (d.href ? '<a href="' + d.href + '">Xəritəni aç →</a>' : "") + "</span>";
  }
  dirsEl.addEventListener("click", (e) => { const b = e.target.closest(".dir"); if (b) { dirTouched = true; selectDir(b.dataset.dir); b.scrollIntoView({ block: "nearest", inline: "nearest", behavior: W.reduced ? "auto" : "smooth" }); } });
  dirsEl.addEventListener("mouseover", (e) => { const b = e.target.closest(".dir"); if (b && matchMedia("(hover: hover)").matches) { dirTouched = true; selectDir(b.dataset.dir); } });
  techsEl.addEventListener("click", (e) => { const t = e.target.closest("div.tech"); if (t) W.toast(tech(t.dataset.tech).name + " — tezliklə"); });
  selectDir("backend");
  addEventListener("resize", drawWires);
  if (motion) {
    let i = 0, vis = false;
    new IntersectionObserver((e) => (vis = e[0].isIntersecting)).observe(stack);
    setInterval(() => { if (dirTouched || !vis || document.hidden || innerWidth < 860) return; i = (i + 1) % W.DIRECTIONS.length; selectDir(W.DIRECTIONS[i].id); }, 3800);
  }

  // ---------- node anatomy: one node, five facets ----------
  const FACETS = [
    { id: "theory", name: "Nəzəriyyə", icon: "book", sub: "Qısa, dəqiq izah" },
    { id: "practice", name: "Praktika", icon: "code", sub: "İşlək kod və nəticə" },
    { id: "visual", name: "Vizual", icon: "eye", sub: "Yaddaşda addım-addım" },
    { id: "test", name: "Test", icon: "check", sub: "Özünü yoxla" },
    { id: "interview", name: "Müsahibə", icon: "chat", sub: "Real sual, cavabı ilə" },
  ];
  const facetsEl = $("#facets"), body = $("#node-body"), anatomy = $("#anatomy"), aw = $("#anatomy-wires"), nodeCard = $("#node-card");
  facetsEl.innerHTML = FACETS.map((f) => '<button class="facet glass spot" role="tab" aria-selected="false" data-f="' + f.id + '"><span class="fi">' + W.I[f.icon] + "</span><b>" + f.name + "</b><small>" + f.sub + "</small></button>").join("");
  const seen = new Set();
  let curF = "theory", visTimer = 0, fTouched = false;

  const VIS = [
    { code: "var cart []string", cells: [], cap: 0, note: "nil slice: hələ array yoxdur" },
    { code: 'cart = append(cart, "milk")', cells: ["milk"], cap: 1, note: "append yeni array ayırır" },
    { code: 'cart = append(cart, "bread")', cells: ["milk", "bread"], cap: 2, note: "yer çatmır — yenə yeni array" },
    { code: 'cart = append(cart, "honey")', cells: ["milk", "bread", "honey"], cap: 4, note: "tutum ikiqat artdı: bir boş yer qaldı" },
  ];
  const PRACTICE = 'package main\n\nimport "fmt"\n\nfunc main() {\n\tcart := []string{"milk", "bread"}\n\tcart = append(cart, "honey")\n\tfmt.Println(cart, len(cart))\n}';

  function facetHTML(id) {
    if (id === "theory") return '<div class="nb-grid"><div class="nb-text"><div class="nb-label">Nəzəriyyə</div>' +
      "<p><b>Slice</b> — eyni tipli elementlərin dinamik siyahısıdır. Array-dən fərqli olaraq ölçüsü sabit deyil: <code>append</code> ilə böyüyür.</p>" +
      "<p>Slice özü kiçik bir başlıqdır: altdakı array-ə göstərici, uzunluq və tutum. Ona görə iki slice eyni elementləri bölüşə bilər.</p></div>" +
      '<ul class="nb-list"><li><span><code>len</code> — hazırda neçə element var</span></li><li><span><code>cap</code> — yeni yer ayrılmadan neçə element sığar</span></li><li><span><code>append</code> nəticəni qaytarır — onu yenidən mənimsət</span></li></ul></div>';
    if (id === "practice") return '<div class="nb-grid"><div class="nb-text"><div class="nb-label">Praktika</div>' +
      "<p>Səbət iki məhsulla yaranır, sonra <code>append</code> üçüncünü əlavə edir. Kod Go ilə işlədilib, çıxış realdır.</p>" +
      '<p style="margin-top:14px"><a class="btn btn-sm" href="' + W.lessonHref("slices") + '">Tam dərsi aç <span class="arrow" data-icon="arrow"></span></a></p></div>' +
      '<div><div class="nb-code"><div class="win-head"><span class="win-dots"><i></i><i></i><i></i></span>main.go</div><pre class="code" id="nb-pre"></pre></div><div class="nb-out">[milk bread honey] 3</div></div></div>';
    if (id === "visual") return '<div class="nb-vis"><div class="nb-label">Vizual · yaddaş</div><div class="nb-vis-row"><code class="nb-vis-code" id="nv-code"></code><span class="nb-vis-meta" id="nv-meta"></span></div>' +
      '<div class="cells" id="nv-cells"></div><div class="nb-vis-row"><span class="muted" id="nv-note" style="font-size:14px"></span><div class="nb-steps" id="nv-steps">' +
      VIS.map((_, i) => '<button aria-label="Addım ' + (i + 1) + '" data-s="' + i + '"></button>').join("") + "</div></div></div>";
    if (id === "test") return '<div class="nb-grid"><div><div class="nb-label">Test · sual 3 / 8</div><p style="font-weight:600;margin-bottom:10px">Bu kod nə çap edir?</p>' +
      '<div class="nb-code"><pre class="code" id="nb-pre"></pre></div></div><div><div class="nb-quiz" id="nb-quiz">' +
      ["1", "9", "0", "kompilyasiya xətası"].map((o) => '<button data-o="' + o + '">' + o + "</button>").join("") + '</div><p class="nb-why" id="nb-why"></p></div></div>';
    if (id === "interview") return '<div class="nb-int"><div class="nb-label">Müsahibə sualı</div><div class="q"><span class="badge next lvl">junior+</span><span><code>append</code> niyə bəzən orijinal slice-ın elementlərini dəyişir, bəzən dəyişmir?</span></div>' +
      '<div class="a blur" id="nb-a">Tutum (<code>cap</code>) çatırsa, <code>append</code> eyni array-ə yazır və həmin array-i bölüşən başqa slice dəyişikliyi görür. Çatmırsa, Go yeni, daha böyük array ayırır — köhnə slice toxunulmaz qalır. Ona görə <code>append</code>-in nəticəsini həmişə yenidən mənimsədirik.</div>' +
      '<div class="tags"><button class="btn btn-sm btn-primary" id="nb-reveal">Cavabı göstər</button><span class="chip">slice</span><span class="chip">append</span><span class="chip">yaddaş</span></div></div>';
    return "";
  }
  function paintVis(i) {
    const s = VIS[i], prev = i ? VIS[i - 1].cells.length : 0;
    $("#nv-code").textContent = s.code;
    $("#nv-meta").innerHTML = "len <b>" + s.cells.length + "</b> · cap <b>" + s.cap + "</b>";
    let html = s.cells.map((c, k) => '<span class="cell on' + (k >= prev ? " pop" : "") + '">"' + c + '"</span>').join("");
    for (let k = s.cells.length; k < s.cap; k++) html += '<span class="cell cap">·</span>';
    $("#nv-cells").innerHTML = html || '<span class="cell cap">nil</span>';
    $("#nv-note").textContent = s.note;
    $("#nv-steps").querySelectorAll("button").forEach((b) => b.setAttribute("aria-current", String(+b.dataset.s === i)));
  }
  function selectFacet(id) {
    curF = id; seen.add(id);
    clearInterval(visTimer);
    facetsEl.querySelectorAll(".facet").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.f === id)));
    body.innerHTML = facetHTML(id);
    W.paintIcons(body);
    if (id === "practice") W.renderCode($("#nb-pre"), PRACTICE);
    if (id === "test") {
      W.renderCode($("#nb-pre"), "s := []int{1, 2, 3}\nt := s[:2]\nt[0] = 9\nfmt.Println(s[0])");
      $("#nb-quiz").addEventListener("click", (e) => {
        const b = e.target.closest("button"); if (!b) return;
        const ok = b.dataset.o === "9";
        b.classList.add(ok ? "ok" : "bad");
        $("#nb-why").innerHTML = ok ? "Düzdür: <code>t</code> və <code>s</code> eyni array-i bölüşür." : "Yenidən cəhd et — <code>t := s[:2]</code> kopya yaratmır.";
      });
    }
    if (id === "interview") $("#nb-reveal").addEventListener("click", (e) => { $("#nb-a").classList.remove("blur"); e.target.remove(); });
    if (id === "visual") {
      let i = 0; paintVis(0);
      $("#nv-steps").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { clearInterval(visTimer); i = +b.dataset.s; paintVis(i); } });
      if (motion) visTimer = setInterval(() => { i = (i + 1) % VIS.length; paintVis(i); }, 1700);
    }
    const n = seen.size;
    $("#node-ring").style.strokeDashoffset = 100.5 * (1 - n / 5);
    $("#node-ring-n").textContent = n + "/5";
    drawAnatomy();
  }
  function drawAnatomy() {
    if (getComputedStyle(aw).display === "none") return;
    const nc = rel(nodeCard, anatomy);
    const H = anatomy.offsetHeight;
    let out = '<defs><linearGradient id="wireGrad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="' + H + '"><stop offset="0" stop-color="var(--accent-2)"/><stop offset="1" stop-color="var(--accent)"/></linearGradient></defs>';
    const btns = facetsEl.querySelectorAll(".facet");
    btns.forEach((b, i) => {
      const r = rel(b, anatomy);
      const x1 = r.x + r.w / 2, y1 = r.y + r.h;
      const x2 = nc.x + nc.w * (0.18 + i * 0.16), y2 = nc.y;
      const my = (y1 + y2) / 2;
      const d = "M" + x1 + " " + y1 + " C" + x1 + " " + my + " " + x2 + " " + my + " " + x2 + " " + y2;
      const on = b.dataset.f === curF;
      out += '<path d="' + d + '"' + (on ? ' class="on"' : "") + "/>";
      out += '<circle cx="' + x2 + '" cy="' + y2 + '" r="3" fill="' + (on ? "var(--accent)" : "var(--line-strong)") + '"/>';
      if (on && motion) out += '<circle r="3.5" class="pulse"><animateMotion dur="1.4s" repeatCount="indefinite" path="' + d + '"/></circle>';
    });
    aw.innerHTML = out;
  }
  facetsEl.addEventListener("click", (e) => { const b = e.target.closest(".facet"); if (b) { fTouched = true; selectFacet(b.dataset.f); } });
  facetsEl.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const i = FACETS.findIndex((f) => f.id === curF), n = (i + (e.key === "ArrowRight" ? 1 : -1) + 5) % 5;
    fTouched = true; selectFacet(FACETS[n].id); facetsEl.children[n].focus();
  });
  selectFacet("theory");
  addEventListener("resize", drawAnatomy);
  if (motion) {
    let vis = false;
    new IntersectionObserver((e) => (vis = e[0].isIntersecting), { threshold: 0.4 }).observe(anatomy);
    setInterval(() => {
      if (fTouched || !vis || document.hidden) return;
      const i = FACETS.findIndex((f) => f.id === curF);
      selectFacet(FACETS[(i + 1) % 5].id);
    }, 7000);
  }

  // ---------- platform rail ----------
  const rail = $("#rail"), rd = $("#rail-detail");
  const lastLive = W.PLATFORM.map((p) => p.status).lastIndexOf("live");
  rail.innerHTML = '<div class="rail-line" style="--p:' + (lastLive / (W.PLATFORM.length - 1)) * 100 + '%"><i></i></div>' +
    W.PLATFORM.map((p, i) => '<button class="rail-item ' + p.status + '" data-i="' + i + '" aria-pressed="false"><span class="rail-ic">' + W.I[p.icon] + "</span><b>" + p.name + "</b>" + W.badge(p.status) + "</button>").join("");
  function selectRail(i) {
    const p = W.PLATFORM[i];
    rail.querySelectorAll(".rail-item").forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.i === i)));
    rd.innerHTML = '<span class="n">0' + (i + 1) + "</span><div><b>" + p.name + "</b><p>" + esc(p.desc) + "</p></div>" + W.badge(p.status);
  }
  rail.addEventListener("click", (e) => { const b = e.target.closest(".rail-item"); if (b) selectRail(+b.dataset.i); });
  rail.addEventListener("mouseover", (e) => { const b = e.target.closest(".rail-item"); if (b) selectRail(+b.dataset.i); });
  selectRail(0);

  // ---------- comparison ----------
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

  // ---------- CTA: resume card ----------
  const FLAT = W.FLAT;
  if (FLAT.length) {
    const done = FLAT.filter((e) => W.learnedSet.has(e.slug)).length;
    const next = FLAT.find((e) => !W.learnedSet.has(e.slug));
    const pct = Math.round((done / FLAT.length) * 100);
    $("#res-pct").textContent = pct + "%";
    new IntersectionObserver((e, o) => { if (e[0].isIntersecting) { $("#res-bar").style.strokeDashoffset = 314.2 * (1 - done / FLAT.length); o.disconnect(); } }).observe($("#resume"));
    if (next) {
      $("#res-title").textContent = next.title;
      $("#res-sub").textContent = next.sub + " · " + next.section + " · " + done + "/" + FLAT.length;
      $("#resume").href = $("#cta-next").href = W.lessonHref(next.slug);
    }
  }

  // the hero tabs (part B) open a facet here
  window.W5 = { selectFacet(id) { fTouched = true; selectFacet(id); } };

  W.paintIcons();
  W.observe();
  // wires depend on final layout (fonts)
  if (document.fonts) document.fonts.ready.then(() => { drawWires(); drawAnatomy(); });
})();

// ---------- part B: v3 hero, before/after, manifesto + v5 additions ----------
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
  let custom = null; // a shape made from typed text; overrides the five while it is set
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
    const t = now * 0.001, sh = custom || SH[shapeIdx], pts = sh.pts, dark = W.isDark();
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
  const paintCap = () => { const s = custom || SH[shapeIdx]; cap.firstElementChild.textContent = s.cap[0]; cap.lastElementChild.textContent = s.cap[1]; };
  paintCap();
  function pulse() { ring.classList.remove("go"); void ring.offsetWidth; ring.classList.add("go"); }
  let cycleT = 0;
  function schedule() {
    clearTimeout(cycleT);
    if (!motion || custom) return;
    tabs.classList.add("auto");
    cycleT = setTimeout(() => { if (heroVis() && !document.hidden && scrollChaos < 0.3) setShape((shapeIdx + 1) % SH.length); else schedule(); }, CYCLE);
  }
  const kick = (f) => { for (let k = 0; k < N; k++) { vx[k] += (Math.random() - 0.5) * f; vy[k] += (Math.random() - 0.5) * f; } };
  function setShape(i) {
    shapeIdx = i; custom = null; ui.classList.remove("typed");
    kick(7); // so the swarm bursts before it re-forms
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

  // intro: the headline rises while the field is chaos; then everything locks into the map
  const title = $("#hero-title"), introEls = $$("[data-intro]");
  const reveal = (n) => introEls.forEach((el) => { if (+el.dataset.intro === n) el.classList.add("in"); });
  palette(); layout(); seed();
  if (!motion) {
    hero.classList.add("lit"); title.classList.add("go"); [1, 2, 3].forEach(reveal); settle();
  } else {
    run();
    setTimeout(() => title.classList.add("go"), 120);
    setTimeout(() => reveal(1), 1450);
    setTimeout(() => {
      const t0 = performance.now();
      (function lock(now) { const k = clamp01((now - t0) / 1150); introChaos = 1 - easeInOut(k); if (k < 1) requestAnimationFrame(lock); })(t0);
      setTimeout(pulse, 420);
      setTimeout(() => hero.classList.add("lit"), 520); // order brings the light: v2's aurora and grid fade in
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
  // NEW in v5: the field answers the reader
  // ======================================================
  // 1. Typed text (or a hovered suggestion) is drawn by the particles.
  function textShape(str) {
    str = str.trim().replace(/\s+/g, " ").slice(0, 22);
    let rows = [str];
    if (str.length > 8) {
      const half = Math.ceil(str.length / 2), sp = [str.lastIndexOf(" ", half), str.indexOf(" ", half)].filter((k) => k > 0).sort((a, b) => Math.abs(a - half) - Math.abs(b - half))[0];
      rows = sp ? [str.slice(0, sp), str.slice(sp + 1)] : [str.slice(0, half), str.slice(half)];
    }
    return {
      cap: ["“" + str + "”", "Enter — axtarışda aç"],
      pts: sample((g) => {
        let fs = 132;
        g.textAlign = "center"; g.textBaseline = "middle";
        do { fs -= 4; g.font = "800 " + fs + "px Inter, system-ui, sans-serif"; } while (fs > 20 && Math.max.apply(null, rows.map((r) => g.measureText(r).width)) > S - 12);
        rows.forEach((r, i) => g.fillText(r, S / 2, S / 2 + (i - (rows.length - 1) / 2) * fs * 1.12));
      }, 0.05),
    };
  }
  const askInput = $("#ask-input");
  let typeT = 0, shown = "";
  function showText(str) {
    if (str === shown) return;
    shown = str;
    if (!str) { setShape(shapeIdx); return; }
    custom = textShape(str);
    clearTimeout(cycleT); tabs.classList.remove("auto"); ui.classList.add("typed");
    $$("button", tabs).forEach((b) => b.setAttribute("aria-selected", "false"));
    kick(6); paintCap();
    if (motion) pulse(); else settle();
  }
  askInput.addEventListener("input", () => { clearTimeout(typeT); typeT = setTimeout(() => showText(askInput.value.trim()), 140); });
  $$("#ask [data-q]").forEach((c) => {
    c.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse" && !askInput.value.trim()) showText(c.dataset.q); });
    c.addEventListener("pointerleave", () => { if (!askInput.value.trim()) showText(""); });
  });

  // 2. A click on the empty part of the hero scatters the field from that point; it re-forms on its own.
  if (motion) hero.addEventListener("pointerdown", (e) => {
    if (e.target.closest("a, button, input, form, .sculpt-ui")) return;
    const r = hero.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top;
    for (let i = 0; i < N; i++) {
      const dx = x[i] - mx, dy = y[i] - my, d = Math.sqrt(dx * dx + dy * dy) + 1;
      if (d < 340) { const f = (1 - d / 340) * 46; vx[i] += (dx / d) * f; vy[i] += (dy / d) * f; }
    }
    ring.style.setProperty("--cx", mx + "px"); ring.style.setProperty("--cy", my + "px"); pulse();
    setTimeout(layout, 1250); // put the ring back on the sculpture
  });

  // 3. The five tabs are the five facets of the demo further down: the link opens the matching one.
  const FACET = ["", "practice", "visual", "test", "interview"];
  $("#sculpt-more").addEventListener("click", (e) => {
    const id = custom ? "" : FACET[shapeIdx];
    e.preventDefault();
    if (id && window.W5) window.W5.selectFacet(id);
    document.getElementById(id ? "model" : "stack").scrollIntoView({ behavior: motion ? "smooth" : "auto", block: "start" });
  });

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
  // one scroll handler for everything scroll-linked
  // ======================================================
  let ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      scrollChaos = clamp01(scrollY / (Hd * 0.75)) * 0.95; // leaving the hero: order dissolves back into dust
      maniScroll();
    });
  }
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  W.paintIcons();
  W.observe();
})();
