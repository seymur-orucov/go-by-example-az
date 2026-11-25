// Design v2 — roadmap page: Go technology roadmap + Backend direction preview,
// spine graph with drawn connectors and a sticky 5-facet node panel.
(function () {
  "use strict";
  const W = window.W3, NODES = window.W3_NODES || {};
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = W.esc;
  const ls = W.learnedSet;
  const motion = !W.reduced;
  const TECH = (id) => W.TECHS.find((t) => t.id === id);
  const META = (slug) => W.FLAT.find((e) => e.slug === slug);

  // Direction roadmap preview. On the platform: content/roadmaps/backend.yaml; Go nodes reference technology content.
  const BACKEND = [
    { tech: "git", items: ["Git əsasları", "Branch və merge", "Pull request axını"] },
    { tech: "linux", items: ["Terminal və fayl sistemi", "Proseslər və icazələr"] },
    { tech: "http", items: ["HTTP sorğu və cavab", "REST API dizaynı", "DNS və TLS"] },
    { tech: "go", slugs: ["variables", "functions", "structs", "interfaces", "errors", "goroutines", "channels", "context", "http-server", "testing-and-benchmarking"] },
    { tech: "sql", items: ["SELECT və JOIN", "Index-lər", "Tranzaksiyalar", "Miqrasiyalar"] },
    { tech: "docker", items: ["Image və container", "Dockerfile", "Docker Compose"] },
    { tech: "k8s", items: ["Pod və Deployment", "Service və Ingress"] },
  ];
  const BE_GO = BACKEND.find((g) => g.slugs).slugs.filter((s) => META(s));
  const LEVEL = { basics: "başlanğıc", collections: "başlanğıc", functions: "başlanğıc", types: "orta", errors: "orta", concurrency: "orta", text: "orta", files: "orta", system: "irəli" };

  let kind = "tech", filter = W.store.get("w3:rm-filter", "all"), cur = null, tab = "theory";
  const mapEl = $("#rm-map"), panel = $("#rm-panel"), scrim = $("#rm-scrim");

  const nextOf = (list) => list.find((s) => !ls.has(s));
  const scope = () => (kind === "tech" ? W.FLAT.map((e) => e.slug) : BE_GO);
  function stateOf(slug) {
    if (ls.has(slug)) return "done";
    if (slug === nextOf(scope())) return "next";
    return W.READY.has(slug) ? "ready" : "planned";
  }
  const passes = (slug) => filter === "all" || (filter === "done") === ls.has(slug);

  function pill(slug, side) {
    const m = META(slug), st = stateOf(slug);
    const tag = st === "done" ? '<em class="ok">✓</em>' : st === "next" ? '<em class="nx">növbəti</em>' : st === "planned" ? '<em class="sn">tezliklə</em>' : "";
    return '<button class="pill glass ' + st + '" data-slug="' + slug + '" data-side="' + side + '" aria-pressed="' + (slug === cur) + '"><i class="pd"></i><span><b>' + esc(m.title) + "</b><small>" + esc(m.sub) + "</small></span>" + tag + "</button>";
  }
  const soonPill = (t, side) => '<span class="pill glass soon" data-side="' + side + '" title="Tezliklə"><i class="pd"></i><span><b>' + esc(t) + "</b><small>tezliklə</small></span></span>";

  // a section: hub in the middle, topics alternate left/right
  function section(o) {
    const L = [], R = [];
    o.nodes.forEach((n, i) => (i % 2 ? R : L).push(n));
    return '<section class="rm-sec" style="--c:' + o.c + '" data-reveal>' +
      '<svg class="rm-wires" aria-hidden="true"></svg>' +
      '<div class="rm-side left">' + L.map((n) => n("left")).join("") + "</div>" +
      '<div class="rm-hub glass dots"><span class="mono-ic" style="--c:' + o.c + '">' + esc(o.ic) + '</span><div class="hub-t"><small>' + esc(o.kicker) + "</small><b>" + esc(o.title) + "</b></div>" +
      (o.total ? '<div class="hub-bar"><i style="width:' + Math.round((o.done / o.total) * 100) + '%"></i></div><small class="hub-n">' + o.done + " / " + o.total + (o.level ? " · " + o.level : "") + "</small>" : '<small class="hub-n">' + esc(o.note || "") + "</small>") +
      "</div>" +
      '<div class="rm-side right">' + R.map((n) => n("right")).join("") + "</div></section>";
  }

  function renderMap() {
    let html = "";
    if (kind === "tech") {
      html = W.SECTIONS.map((s, si) => {
        const items = s.items.filter(([slug]) => passes(slug));
        if (!items.length) return "";
        return section({
          c: "#00add8", ic: String(si + 1).padStart(2, "0"), kicker: "Bölmə " + (si + 1), title: s.title, level: LEVEL[s.id],
          done: s.items.filter(([slug]) => ls.has(slug)).length, total: s.items.length,
          nodes: items.map(([slug]) => (side) => pill(slug, side)),
        });
      }).join("");
    } else {
      html = BACKEND.map((g, gi) => {
        const t = TECH(g.tech);
        if (g.slugs) {
          const items = BE_GO.filter(passes);
          return section({ c: t.c, ic: t.ic, kicker: "Addım " + (gi + 1) + " · aktiv", title: t.name, done: BE_GO.filter((s) => ls.has(s)).length, total: BE_GO.length, nodes: items.map((slug) => (side) => pill(slug, side)) });
        }
        if (filter === "done") return "";
        return section({ c: t.c, ic: t.ic, kicker: "Addım " + (gi + 1), title: t.name, note: "tezliklə · " + g.items.length + " mövzu", nodes: g.items.map((it) => (side) => soonPill(it, side)) });
      }).join("");
    }
    mapEl.innerHTML = html ? '<div class="rm-spine" aria-hidden="true"></div>' + html + '<div class="rm-end glass"><span class="badge ' + (kind === "tech" ? "live" : "next") + '">' + (kind === "tech" ? "son" : "önizləmə") + "</span>" + (kind === "tech" ? "Go yolu burada bitir — növbəti addım istiqamətdir." : "Backend xəritəsi Go-dan sonra digər texnologiyalarla dolacaq.") + "</div>"
      : '<p class="rm-empty glass">Bu filtrdə mövzu yoxdur.</p>';
    W.observe(mapEl);
    drawWires();
    paintHead();
  }

  // ---------- connectors: hub edge → each pill edge ----------
  function rel(el, anc) {
    let x = 0, y = 0, n = el;
    while (n && n !== anc) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
    return { x, y, w: el.offsetWidth, h: el.offsetHeight };
  }
  function drawWires() {
    mapEl.querySelectorAll(".rm-sec").forEach((sec) => {
      const svg = sec.querySelector(".rm-wires");
      if (getComputedStyle(svg).display === "none") { svg.innerHTML = ""; return; }
      const hub = rel(sec.querySelector(".rm-hub"), sec);
      let out = "";
      sec.querySelectorAll(".pill").forEach((p) => {
        const r = rel(p, sec), left = p.dataset.side === "left";
        const x1 = left ? hub.x : hub.x + hub.w, y1 = hub.y + hub.h / 2;
        const x2 = left ? r.x + r.w : r.x, y2 = r.y + r.h / 2;
        const dx = (x2 - x1) * 0.5;
        const cls = p.classList.contains("done") ? "done" : p.dataset.slug && p.dataset.slug === cur ? "on" : p.classList.contains("next") ? "next" : p.classList.contains("soon") ? "soon" : "";
        out += '<path class="' + cls + '" d="M' + x1 + " " + y1 + " C" + (x1 + dx) + " " + y1 + " " + (x2 - dx) + " " + y2 + " " + x2 + " " + y2 + '"/>';
      });
      svg.innerHTML = out;
    });
  }

  // ---------- head: titles, progress ring, next ----------
  function paintHead() {
    const list = scope();
    const done = list.filter((s) => ls.has(s)).length, pct = Math.round((done / list.length) * 100);
    $("#rm-title").textContent = kind === "tech" ? "Go" : "Backend";
    $("#rm-title2").textContent = kind === "tech" ? "yol xəritəsi" : "istiqaməti";
    $("#rm-crumb").textContent = kind === "tech" ? "Go · yol xəritəsi" : "Backend · istiqamət";
    $("#rm-sub").textContent = kind === "tech"
      ? W.SECTIONS.length + " bölmə, " + W.FLAT.length + " mövzu — sadədən mürəkkəbə. Mövzuya bas: izah, kod, vizual, test və müsahibə sualı bir paneldədir."
      : "Git → Linux → HTTP → Go → SQL → Docker → Kubernetes. İstiqamət texnologiyaların node-larına istinad edir — məzmun təkrarlanmır. Hazırda Go hissəsi aktivdir.";
    $("#rm-done").textContent = done + " / " + list.length;
    $("#rm-done-label").textContent = kind === "tech" ? "mövzu öyrənilib" : "Go mövzusu öyrənilib (istiqamətdə)";
    $("#rm-pct").textContent = pct + "%";
    $("#rm-ring").style.strokeDashoffset = 263.9 * (1 - done / list.length);
    const nx = nextOf(list);
    const a = $("#rm-next");
    if (nx) { a.hidden = false; a.href = "#" + (kind === "dir" ? "backend/" : "") + nx; $("#rm-next-t").textContent = META(nx).title + " →"; }
    else a.hidden = true;
    document.querySelectorAll("[data-kind]").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.kind === kind)));
    document.querySelectorAll("[data-filter]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filter === filter)));
  }

  // ---------- node panel ----------
  const TABS = [["theory", "Nəzəriyyə", "book"], ["practice", "Praktika", "code"], ["visual", "Vizual", "eye"], ["test", "Test", "check"], ["interview", "Müsahibə", "chat"]];
  $("#rp-tabs").innerHTML = TABS.map(([id, t, ic]) => '<button role="tab" data-tab="' + id + '" aria-selected="false">' + W.I[ic] + "<span>" + t + "</span></button>").join("");

  function facet(slug) {
    const n = NODES[slug], m = META(slug), ready = W.READY.has(slug);
    const soon = (t) => '<p class="rp-soon">' + t + "</p>";
    if (tab === "theory") return n ? '<p class="rp-text">' + n.theory + "</p>" : soon((ready ? "Dərs hazırdır: " : "Bu mövzunun izahı hazırlanır: ") + "<b>" + esc(m.sub) + "</b>. " + (ready ? "Tam izah dərs səhifəsindədir." : "Tezliklə əlavə olunacaq."));
    if (tab === "practice") return n ? '<div class="rp-code"><div class="win-head"><span class="win-dots"><i></i><i></i><i></i></span>main.go</div><pre class="code" data-code></pre></div><div class="rp-out">' + esc(n.out).replace(/\n/g, "<br>") + "</div>" : soon(ready ? "İşlək nümunə dərs səhifəsindədir." : "İşlək nümunə və tapşırıq tezliklə əlavə olunacaq.");
    if (tab === "visual") return n ? '<ol class="rp-steps">' + n.steps.map((s, i) => '<li style="--i:' + i + '"><span>' + String(i + 1).padStart(2, "0") + "</span><code>" + esc(s) + "</code></li>").join("") + "</ol>" : soon("Bu mövzu üçün addım-addım vizual izah hazırlanır.");
    if (tab === "test") return n ? '<p class="rp-q">' + n.quiz.q + "</p>" + (n.quiz.code ? '<div class="rp-code"><pre class="code" data-qcode></pre></div>' : "") + '<div class="rp-opts">' + n.quiz.opts.map((o, i) => '<button data-opt="' + i + '"><code>' + esc(o) + "</code></button>").join("") + '</div><p class="rp-why" id="rp-why"></p>' : soon(ready ? "Bu mövzunun testi dərs səhifəsinin sonundadır." : "Bu mövzunun testi tezliklə əlavə olunacaq.");
    return n ? '<p class="rp-q"><span class="badge next">' + n.interview.lvl + "</span> " + n.interview.q + '</p><div class="rp-ans blur" id="rp-ans">' + n.interview.a + '</div><button class="btn btn-sm" id="rp-reveal">Cavabı göstər</button><p class="rp-note">Önizləmə · Müsahibə bölməsi planlaşdırılır</p>' : soon("Bu mövzu üzrə müsahibə sualları tezliklə əlavə olunacaq.");
  }
  function renderBody() {
    const body = $("#rp-body"), n = NODES[cur];
    body.innerHTML = facet(cur);
    const pre = body.querySelector("[data-code]"); if (pre) W.renderCode(pre, n.code);
    const qpre = body.querySelector("[data-qcode]"); if (qpre) W.renderCode(qpre, n.quiz.code);
    body.querySelectorAll("[data-opt]").forEach((b) => b.addEventListener("click", () => {
      const ok = +b.dataset.opt === n.quiz.ok;
      b.classList.add(ok ? "ok" : "bad");
      $("#rp-why").innerHTML = ok ? "Düzdür. " + (n.quiz.why || "") : "Yenidən cəhd et.";
    }));
    const rv = $("#rp-reveal"); if (rv) rv.addEventListener("click", () => { $("#rp-ans").classList.remove("blur"); rv.remove(); });
    document.querySelectorAll("#rp-tabs [data-tab]").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.tab === tab)));
    body.classList.remove("in"); void body.offsetWidth; body.classList.add("in");
  }
  function paintPanel() {
    if (!cur) return;
    const m = META(cur), st = stateOf(cur);
    $("#rp-crumb").textContent = (kind === "dir" ? "Backend · " : "") + "Go · " + m.section;
    $("#rp-title").textContent = m.title;
    $("#rp-status").innerHTML = st === "done" ? '<span class="badge live">öyrənilib</span>' : st === "next" ? '<span class="badge next">növbəti</span>' : st === "ready" ? '<span class="badge plan">hazırdır</span>' : '<span class="badge later">tezliklə</span>';
    $("#rp-go").href = W.lessonHref(cur);
    $("#rp-go").firstChild.textContent = W.READY.has(cur) ? "Dərsə keç " : "Mövzuya bax ";
    const learned = ls.has(cur);
    const lb = $("#rp-learn");
    lb.setAttribute("aria-pressed", String(learned));
    lb.textContent = learned ? "✓ Öyrənilib" : "Öyrəndim";
    lb.classList.toggle("is-on", learned);
    renderBody();
  }
  function select(slug, opts) {
    opts = opts || {};
    cur = slug;
    mapEl.querySelectorAll(".pill[data-slug]").forEach((p) => p.setAttribute("aria-pressed", String(p.dataset.slug === slug)));
    drawWires();
    paintPanel();
    try { history.replaceState(null, "", "#" + (kind === "dir" ? "backend/" : "") + slug); } catch (e) {}
    if (opts.open) openSheet();
    if (opts.scroll) { const p = mapEl.querySelector('.pill[data-slug="' + slug + '"]'); if (p) p.scrollIntoView({ block: "center", behavior: motion ? "smooth" : "auto" }); }
  }

  // bottom sheet on narrow screens
  const narrow = () => matchMedia("(max-width: 1100px)").matches;
  function openSheet() { if (!narrow()) return; panel.classList.add("open"); scrim.hidden = false; }
  function closeSheet() { panel.classList.remove("open"); scrim.hidden = true; }
  $("#rm-close").addEventListener("click", closeSheet);
  scrim.addEventListener("click", closeSheet);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeSheet(); });

  // ---------- events ----------
  mapEl.addEventListener("click", (e) => {
    const p = e.target.closest(".pill[data-slug]");
    if (p) { select(p.dataset.slug, { open: true }); return; }
    if (e.target.closest(".pill.soon")) W.toast("Bu mövzu tezliklə əlavə olunacaq");
  });
  $("#rp-tabs").addEventListener("click", (e) => { const b = e.target.closest("[data-tab]"); if (b) { tab = b.dataset.tab; renderBody(); } });
  $("#rp-tabs").addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const i = TABS.findIndex((t) => t[0] === tab), n = (i + (e.key === "ArrowRight" ? 1 : -1) + TABS.length) % TABS.length;
    tab = TABS[n][0]; renderBody(); $("#rp-tabs").children[n].focus();
  });
  $("#rp-learn").addEventListener("click", () => {
    if (ls.has(cur)) ls.delete(cur); else ls.add(cur);
    W.saveLearned();
    W.toast(ls.has(cur) ? META(cur).title + " — öyrənildi ✓" : META(cur).title + " — qeyd silindi");
    renderMap();
    select(cur);
  });
  document.querySelectorAll("[data-kind]").forEach((b) => b.addEventListener("click", () => {
    if (kind === b.dataset.kind) return;
    kind = b.dataset.kind;
    const list = scope();
    const keep = cur && list.includes(cur) ? cur : nextOf(list) || list[0];
    renderMap(); select(keep);
  }));
  document.querySelectorAll("[data-filter]").forEach((b) => b.addEventListener("click", () => {
    filter = b.dataset.filter; W.store.set("w3:rm-filter", filter); renderMap(); select(cur);
  }));
  $("#rm-next").addEventListener("click", (e) => { e.preventDefault(); const nx = nextOf(scope()); if (nx) select(nx, { open: true, scroll: true }); });

  // ---------- start: deep link #slug, #backend, #backend/slug ----------
  function fromHash() {
    const h = decodeURIComponent(location.hash.slice(1));
    let start = null;
    if (h.startsWith("backend")) { kind = "dir"; const s = h.split("/")[1]; if (s && BE_GO.includes(s)) start = s; }
    else { kind = "tech"; if (META(h)) start = h; }
    renderMap();
    select(start || nextOf(scope()) || scope()[0], { scroll: !!start, open: !!start });
  }
  addEventListener("hashchange", fromHash);
  addEventListener("resize", drawWires);
  fromHash();
  W.paintIcons();
  W.observe();
  if (document.fonts) document.fonts.ready.then(drawWires);
})();
