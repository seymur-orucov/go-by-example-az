// Design v2 — Go technology page (future /go/).
(function () {
  "use strict";
  const W = window.W3;
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = W.esc, ls = W.learnedSet;
  const LEVEL = { basics: "başlanğıc", collections: "başlanğıc", functions: "başlanğıc", types: "orta", errors: "orta", concurrency: "orta", text: "orta", files: "orta", system: "irəli" };
  const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);

  // aurora tinted toward Go cyan (the color vars live on :root in go.css)
  W.aurora($("#go-aurora"), { colors: () => ["--go-ice", "--go-cyan", "--accent", "--accent-2"], start: 30 });

  // ---------- hero numbers + resume card ----------
  const FLAT = W.FLAT, SECS = W.SECTIONS;
  const done = FLAT.filter((e) => ls.has(e.slug)).length;
  const next = FLAT.find((e) => !ls.has(e.slug));
  $("#st-sec").textContent = $("#ph-sec").textContent = SECS.length;
  $("#st-top").textContent = $("#ph-top").textContent = FLAT.length;
  $("#st-ready").textContent = FLAT.filter((e) => W.READY.has(e.slug)).length;
  $("#st-done").textContent = done;
  $("#gr-pct").textContent = pct(done, FLAT.length) + "%";
  requestAnimationFrame(() => ($("#gr-bar").style.strokeDashoffset = 263.9 * (1 - done / FLAT.length)));
  if (next) {
    $("#gr-title").textContent = next.title;
    $("#gr-sub").textContent = next.sub + " · " + next.section;
    $("#gr-next").href = $("#go-continue").href = W.lessonHref(next.slug);
    $("#go-continue").firstChild.textContent = done ? "Davam et: " + next.title + " " : "Başla: " + next.title + " ";
  }
  $("#gr-secs").innerHTML = SECS.map((s, i) => {
    const d = s.items.filter(([slug]) => ls.has(slug)).length;
    return '<li><span class="n">' + String(i + 1).padStart(2, "0") + "</span><span class=\"t\">" + esc(s.title) + '</span><span class="b"><i style="width:' + pct(d, s.items.length) + '%"></i></span><span class="c">' + d + "/" + s.items.length + "</span></li>";
  }).join("");

  // ---------- where Go fits ----------
  const dirs = W.DIRECTIONS.filter((d) => d.techs.includes("go"));
  $("#fit-dirs").innerHTML = dirs.map((d) => '<a class="chip fit-chip" href="' + (d.href || "#") + '"><span class="mono-ic" style="--c:' + d.c + '">' + d.ic + "</span>" + d.name + W.badge(d.status) + "</a>").join("");
  const be = W.DIRECTIONS.find((d) => d.id === "backend");
  const after = be.techs.slice(be.techs.indexOf("go") + 1).map((id) => W.TECHS.find((t) => t.id === id));
  $("#fit-next").innerHTML = after.map((t, i) => (i ? '<span class="fit-sep">→</span>' : "") + '<span class="chip fit-chip" title="' + esc(t.desc) + '"><span class="mono-ic" style="--c:' + t.c + '">' + esc(t.ic) + "</span>" + esc(t.name) + "</span>").join("");

  // ---------- program: sections / all topics ----------
  function topicState(slug) {
    if (ls.has(slug)) return ["done", "✓"];
    if (next && next.slug === slug) return ["next", "növbəti"];
    return W.READY.has(slug) ? ["ready", "hazır"] : ["soon", "tezliklə"];
  }
  function topicRow(slug, title, sub) {
    const [st, tag] = topicState(slug);
    return '<li><a class="topic ' + st + '" href="' + W.lessonHref(slug) + '"><i class="td"></i><span><b>' + esc(title) + "</b><small>" + esc(sub) + "</small></span><em>" + tag + "</em></a></li>";
  }
  const openSet = new Set(W.store.get("w3:go-open", ["basics", "collections"]));
  function renderSections() {
    $("#prog-sections").innerHTML = SECS.map((s, i) => {
      const d = s.items.filter(([slug]) => ls.has(slug)).length;
      const r = s.items.filter(([slug]) => W.READY.has(slug)).length;
      const open = openSet.has(s.id);
      return '<article class="sec-card glass spot' + (open ? " open" : "") + '" data-reveal style="--i:' + (i % 3) + '">' +
        '<div class="sc-top"><span class="sc-n">' + String(i + 1).padStart(2, "0") + '</span><span class="sc-lvl">' + LEVEL[s.id] + "</span>" + (r ? '<span class="badge live">' + r + " hazır</span>" : '<span class="badge later">tezliklə</span>') + "</div>" +
        "<h3>" + esc(s.title) + "</h3><p>" + esc(s.desc) + "</p>" +
        '<div class="sc-prog"><span class="sc-bar"><i style="width:' + pct(d, s.items.length) + '%"></i><i class="r" style="width:' + pct(r, s.items.length) + '%"></i></span><small>' + d + " / " + s.items.length + " öyrənilib</small></div>" +
        '<button class="sc-toggle" data-sec="' + s.id + '" aria-expanded="' + open + '">' + s.items.length + " mövzu " + W.I.chev + "</button>" +
        '<ul class="sc-topics"' + (open ? "" : " hidden") + ">" + s.items.map(([slug, t, sub]) => topicRow(slug, t, sub)).join("") + "</ul></article>";
    }).join("");
  }
  function renderAll() {
    $("#prog-all").innerHTML = SECS.map((s, i) =>
      '<div class="all-group" data-reveal><div class="all-head"><span class="sc-n">' + String(i + 1).padStart(2, "0") + "</span><b>" + esc(s.title) + "</b><small>" + s.items.length + ' mövzu</small></div><ul class="all-grid">' +
      s.items.map(([slug, t, sub]) => topicRow(slug, t, sub)).join("") + "</ul></div>").join("");
  }
  let view = W.store.get("w3:go-view", "sections");
  function setView(v) {
    view = v; W.store.set("w3:go-view", v);
    document.querySelectorAll("[data-view]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.view === v)));
    $("#prog-sections").hidden = v !== "sections";
    $("#prog-all").hidden = v !== "all";
    W.observe($("#proqram"));
  }
  document.querySelectorAll("[data-view]").forEach((b) => b.addEventListener("click", () => setView(b.dataset.view)));
  $("#prog-sections").addEventListener("click", (e) => {
    const b = e.target.closest(".sc-toggle"); if (!b) return;
    const card = b.closest(".sec-card"), list = card.querySelector(".sc-topics");
    const open = list.hidden;
    list.hidden = !open; card.classList.toggle("open", open); b.setAttribute("aria-expanded", String(open));
    if (open) openSet.add(b.dataset.sec); else openSet.delete(b.dataset.sec);
    W.store.set("w3:go-open", Array.from(openSet));
  });
  renderSections(); renderAll(); setView(view);

  // ---------- 5 facets strip ----------
  $("#fs-items").innerHTML = [["book", "Nəzəriyyə"], ["code", "Praktika"], ["eye", "Vizual"], ["check", "Test"], ["chat", "Müsahibə"]]
    .map(([ic, t]) => '<span class="fs-item">' + W.I[ic] + t + "</span>").join("");

  W.paintIcons();
  W.observe();
})();
