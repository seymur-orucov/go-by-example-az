// Design v2 — platform home interactions.
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

  // ---------- hero: showcase lesson card ----------
  const SC_SRC = 'func main() {\n\tvar cart []string\n\tcart = append(cart, "milk")\n\tcart = append(cart, "bread")\n\tcart = append(cart, "honey")\n\tfmt.Println(len(cart), cap(cart))\n\tfmt.Println(cart[1:])\n}';
  const SC_STEPS = [
    { lines: [2], cells: [], cap: 0 },
    { lines: [3, 4], cells: ["milk", "bread"], cap: 2 },
    { lines: [5], cells: ["milk", "bread", "honey"], cap: 4 },
    { lines: [6, 7], cells: ["milk", "bread", "honey"], cap: 4 },
  ];
  const scCode = $("#sc-code"), scCells = $("#sc-cells");
  W.renderCode(scCode, SC_SRC);
  let scI = 1, scPrev = [];
  function scPaint() {
    const st = SC_STEPS[scI];
    scCode.querySelectorAll(".ln").forEach((l, i) => l.classList.toggle("hl", st.lines.includes(i + 1)));
    let html = st.cells.map((c, i) => '<span class="cell on' + (i >= scPrev.length ? " pop" : "") + '">"' + c + '"</span>').join("");
    for (let i = st.cells.length; i < st.cap; i++) html += '<span class="cell cap">·</span>';
    scCells.innerHTML = html || '<span class="cell cap">nil</span>';
    $("#sc-lc").textContent = "len " + st.cells.length + " · cap " + st.cap;
    $("#sc-step").textContent = scI + 1;
    scPrev = st.cells;
  }
  scPaint();
  const showcase = $("#showcase");
  W.tilt(showcase, 5);
  if (motion) {
    let scVis = false;
    new IntersectionObserver((e) => (scVis = e[0].isIntersecting)).observe(showcase);
    setInterval(() => { if (!scVis || document.hidden) return; scI = (scI + 1) % SC_STEPS.length; if (scI === 0) scPrev = []; scPaint(); }, 2600);
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

  W.paintIcons();
  W.observe();
  // wires depend on final layout (fonts)
  if (document.fonts) document.fonts.ready.then(() => { drawWires(); drawAnatomy(); });
})();
